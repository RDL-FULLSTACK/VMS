//visitorController.js
const Visitor = require("../models/Visitor");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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

// 🔹 Add Visitor
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
      teamMembers: teamMembersString,
    } = req.body;

    // Construct photo URL if a file was uploaded
    const photoUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    // Parse JSON strings
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

    // Validate required fields
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

    // Additional validation
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
        if (!asset.quantity || !asset.type || !asset.serialNumber) {
          return res.status(400).json({
            success: false,
            message: "All asset fields (quantity, type, serialNumber) are required",
          });
        }
      }
    }

    // Validate team members
    if (teamMembers && teamMembers.length > 0) {
      for (const member of teamMembers) {
        if (
          !member.name ||
          !member.email ||
          !member.documentDetail ||
          !["yes", "no"].includes(member.hasAssets)
        ) {
          return res.status(400).json({
            success: false,
            message:
              "All team member fields (name, email, documentDetail, hasAssets) are required",
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
            if (!asset.quantity || !asset.type || !asset.serialNumber) {
              return res.status(400).json({
                success: false,
                message:
                  "All team member asset fields (quantity, type, serialNumber) are required",
              });
            }
          }
        }
      }
    }

    // Validate expectedDuration
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
      assets,
      teamMembers,
      photoUrl,
    });

    await newVisitor.save();

    res.status(201).json({
      success: true,
      message: "Visitor added successfully",
      data: newVisitor,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Error adding visitor",
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

    // Prevent updating checkOutTime manually
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

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

let c_otp = null; // Locally storing OTP

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

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    c_otp = otp;
    setTimeout(() => {
      c_otp = null; // Reset OTP after 5 minutes
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

   // console.log("Session OTP:", c_otp);
   // console.log("User Input OTP:", otp);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (c_otp && c_otp === otp) {
      c_otp = null; // Clear OTP after successful verification
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