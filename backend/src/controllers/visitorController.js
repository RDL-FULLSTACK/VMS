const mongoose = require("mongoose");
const Visitor = require("../models/Visitor");
const Checkout = require("../models/Checkout");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

let c_otp = null;

// 🔹 Get All Visitors
exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Visitors retrieved successfully",
      data: visitors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching visitors",
      error: error.message,
    });
  }
};

// 🔹 Get Latest Visitor
exports.getLatestVisitor = async (req, res) => {
  try {
    const latestVisitor = await Visitor.findOne().sort({ createdAt: -1 });
    if (!latestVisitor) {
      return res.status(404).json({
        success: false,
        message: "No visitors found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Latest visitor retrieved successfully",
      data: latestVisitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching latest visitor",
      error: error.message,
    });
  }
};

// 🔹 Get Visitor by ID
exports.getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Visitor retrieved successfully",
      data: visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching visitor",
      error: error.message,
    });
  }
};

// 🔹 Add Visitor (Updated to match Checkin component)
exports.addVisitor = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      designation,
      visitType,
      expectedDuration: expectedDurationString,
      documentDetails,
      reasonForVisit,
      otp,
      visitorCompany,
      personToVisit,
      submittedDocument,
      hasAssets,
      assets: assetsString,
      hasTeamMembers,
      teamMembers: teamMembersString,
      department,
    } = req.body;

    const photoUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    let expectedDuration, assets, teamMembers;
    try {
      expectedDuration = expectedDurationString ? JSON.parse(expectedDurationString) : null;
      assets = assetsString ? JSON.parse(assetsString) : [];
      teamMembers = teamMembersString ? JSON.parse(teamMembersString) : [];
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in fields",
        error: parseError.message,
      });
    }

    const requiredFields = {
      fullName,
      email,
      phoneNumber,
      designation,
      visitType,
      expectedDuration,
      documentDetails,
      reasonForVisit,
      otp,
      visitorCompany,
      personToVisit,
      submittedDocument,
      hasAssets,
      department,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => value === undefined || value === null || value === "")
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    if (!/^[A-Za-z\s]+$/.test(fullName) || !/^[A-Za-z\s]+$/.test(personToVisit)) {
      return res.status(400).json({
        success: false,
        message: "Names must contain only letters and spaces",
      });
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be 6 digits",
      });
    }
    if (!["yes", "no"].includes(hasAssets)) {
      return res.status(400).json({
        success: false,
        message: "hasAssets must be 'yes' or 'no'",
      });
    }
    if (hasAssets === "yes" && (!assets || assets.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Assets are required if hasAssets is 'yes'",
      });
    }
    if (hasAssets === "yes") {
      for (const asset of assets) {
        if (!asset.type || !asset.serialNumber) {
          return res.status(400).json({
            success: false,
            message: "Asset fields (type, serialNumber) are required",
          });
        }
      }
    }

    if (hasTeamMembers === "yes" && (!teamMembers || teamMembers.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Team members are required if hasTeamMembers is 'yes'",
      });
    }
    if (hasTeamMembers === "yes") {
      for (const member of teamMembers) {
        if (!member.name || !member.email || !member.documentDetail || !member.hasAssets) {
          return res.status(400).json({
            success: false,
            message: "All team member fields (name, email, documentDetail, hasAssets) are required",
          });
        }
        if (!["yes", "no"].includes(member.hasAssets)) {
          return res.status(400).json({
            success: false,
            message: "Team member hasAssets must be 'yes' or 'no'",
          });
        }
        if (member.hasAssets === "yes" && (!member.assets || member.assets.length === 0)) {
          return res.status(400).json({
            success: false,
            message: "Assets required for team member if hasAssets is 'yes'",
          });
        }
        if (member.hasAssets === "yes") {
          for (const asset of member.assets) {
            if (!asset.type || !asset.serialNumber) {
              return res.status(400).json({
                success: false,
                message: "All team member asset fields (type, serialNumber) are required",
              });
            }
          }
        }
      }
    }

    if (
      !expectedDuration ||
      typeof expectedDuration.hours !== "number" ||
      typeof expectedDuration.minutes !== "number" ||
      expectedDuration.hours < 0 ||
      expectedDuration.minutes < 0 ||
      expectedDuration.minutes > 59
    ) {
      return res.status(400).json({
        success: false,
        message: "expectedDuration must be an object with valid hours (≥ 0) and minutes (0-59)",
      });
    }

    const newVisitor = new Visitor({
      fullName,
      email,
      phoneNumber,
      designation,
      visitType,
      expectedDuration,
      documentDetails,
      reasonForVisit,
      otp,
      visitorCompany,
      personToVisit,
      submittedDocument,
      hasAssets,
      assets: hasAssets === "yes" ? assets : [],
      teamMembers: hasTeamMembers === "yes" ? teamMembers : [],
      photoUrl,
      checkInTime: new Date(),
      department,
    });

    await newVisitor.save();

    res.status(201).json({
      success: true,
      message: "Visitor checked in successfully",
      data: newVisitor,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Error checking in visitor",
      error: error.message,
    });
  }
};

// 🔹 Check Out Visitor
exports.checkOutVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (visitor.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "Visitor has already checked out",
      });
    }

    visitor.checkOutTime = new Date();
    await visitor.save();

    res.status(200).json({
      success: true,
      message: "Visitor checked out successfully",
      data: visitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during checkout",
      error: error.message,
    });
  }
};

// 🔹 Delete Visitor
exports.deleteVisitor = async (req, res) => {
  try {
    const deletedVisitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!deletedVisitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Visitor deleted successfully",
      data: deletedVisitor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting visitor",
      error: error.message,
    });
  }
};

// 🔹 Update Visitor
exports.updateVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (req.body.checkOutTime) {
      delete req.body.checkOutTime;
    }

    Object.assign(visitor, req.body);
    await visitor.save();

    res.status(200).json({
      success: true,
      message: "Visitor updated successfully",
      data: visitor,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating visitor",
      error: error.message,
    });
  }
};

// 🔹 Send Email OTP
exports.sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    c_otp = otp;
    setTimeout(() => {
      c_otp = null;
    }, 300000);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP for visitor verification is: ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: `OTP sent to ${email}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message,
    });
  }
};

// 🔹 Verify Email OTP
exports.verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (c_otp && c_otp === otp) {
      c_otp = null;
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully!",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};

// 🔹 Get Visitors
exports.getVisitors = async (req, res) => {
  try {
    let query = {};
    const { page = 1, limit = 10, sortBy = "checkInTime", order = "desc", startDate, endDate, search, export: isExport } = req.query;

    if (startDate && endDate) {
      query.checkInTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + "T23:59:59.999Z"),
      };
    }

    if (search) {
      query.fullName = { $regex: new RegExp(search, "i") };
    }

    const pageNum = parseInt(page);
    const limitNum = isExport ? 0 : parseInt(limit);
    const skip = isExport ? 0 : (pageNum - 1) * limitNum;
    const sortOrder = order === "asc" ? 1 : -1;

    const fields = "_id fullName checkInTime checkOutTime reasonForVisit personToVisit teamMembers visitorCompany department";

    let visitors;
    if (isExport) {
      visitors = await Visitor.find(query)
        .select(fields)
        .sort({ [sortBy]: sortOrder });
    } else {
      visitors = await Visitor.find(query)
        .select(fields)
        .sort({ [sortBy]: sortOrder })
        .limit(limitNum)
        .skip(skip);
    }

    const totalVisitors = await Visitor.countDocuments(query);

    if (!visitors.length && !isExport) {
      return res.status(200).json({
        visitors: [],
        totalPages: 0,
        message: "No visitors found",
      });
    }

    const formattedVisitors = visitors.map((visitor) => {
      const checkIn = new Date(visitor.checkInTime);
      const checkOut = visitor.checkOutTime ? new Date(visitor.checkOutTime) : null;
      let meetingDuration = null;

      if (checkOut) {
        const diffMs = checkOut - checkIn;
        const totalMinutes = Math.round(diffMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        meetingDuration = { hours, minutes };
      }

      return {
        _id: visitor._id,
        name: visitor.fullName,
        checkInTime: visitor.checkInTime,
        checkOutTime: visitor.checkOutTime,
        reasonForVisit: visitor.reasonForVisit,
        personToVisit: visitor.personToVisit,
        teamMembersCount: (visitor.teamMembers ? visitor.teamMembers.length : 0) + 1,
        meetingDuration,
        visitorCompany: visitor.visitorCompany,
        department: visitor.department,
      };
    });

    if (isExport) {
      return res.status(200).json({ visitors: formattedVisitors });
    }

    res.status(200).json({
      visitors: formattedVisitors,
      totalPages: Math.ceil(totalVisitors / limitNum),
    });
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ message: "Error fetching visitors", error: error.message });
  }
};

// 🔹 Store Checkout Data
exports.storeCheckoutData = async (req, res) => {
  try {
    const visitorId = req.params.id;

    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    if (visitor.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: "Visitor has already checked out",
      });
    }

    const checkOutTime = new Date();
    visitor.checkOutTime = checkOutTime;
    await visitor.save();

    const checkIn = new Date(visitor.checkInTime);
    const diffMs = checkOutTime - checkIn;
    const totalMinutes = Math.round(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const checkoutData = {
      checkoutId: uuidv4(),
      visitorId: visitor._id,
      name: visitor.fullName,
      company: visitor.visitorCompany,
      phone: visitor.phoneNumber,
      checkInTime: visitor.checkInTime,
      checkOutTime: checkOutTime,
      purpose: visitor.reasonForVisit,
      otp: visitor.otp,
      department: visitor.department,
      meetingDuration: { hours, minutes },
    };

    const newCheckout = await Checkout.create(checkoutData);

    res.status(201).json({
      success: true,
      message: "Checkout data stored successfully",
      data: {
        checkoutId: newCheckout.checkoutId,
        visitorId: newCheckout.visitorId,
        name: newCheckout.name,
        company: newCheckout.company,
        phone: newCheckout.phone,
        checkInTime: newCheckout.checkInTime,
        checkOutTime: newCheckout.checkOutTime,
        purpose: newCheckout.purpose,
        otp: newCheckout.otp,
        department: newCheckout.department,
        meetingDuration: newCheckout.meetingDuration,
        createdAt: newCheckout.createdAt,
        updatedAt: newCheckout.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error storing checkout data:", error);
    res.status(500).json({
      success: false,
      message: "Error storing checkout data",
      error: error.message,
    });
  }
};

module.exports = exports;