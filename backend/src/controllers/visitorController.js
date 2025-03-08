


const Visitor = require("../models/Visitor");

// 🔹 Get All Visitors
exports.getAllVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.find().sort({ createdAt: -1 }); // Sort by latest first
        res.status(200).json({
            success: true,
            message: "Visitors retrieved successfully",
            data: visitors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching visitors",
            error: error.message
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
                message: "No visitors found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Latest visitor retrieved successfully",
            data: latestVisitor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching latest visitor",
            error: error.message
        });
    }
};

// 🔹 Get Visitor by ID (New Function)
exports.getVisitorById = async (req, res) => {
    try {
        const visitor = await Visitor.findById(req.params.id);
        if (!visitor) {
            return res.status(404).json({
                success: false,
                message: "Visitor not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Visitor retrieved successfully",
            data: visitor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching visitor",
            error: error.message
        });
    }
};

// 🔹 Add Visitor
exports.addVisitor = async (req, res) => {
    try {
        const {
            fullName, email, phoneNumber, designation, visitType,
            expectedDuration, documentDetails, photoUrl, reasonForVisit,
            otp, visitorCompany, personToVisit, submittedDocument,
            hasAssets, assets, teamMembers
        } = req.body;

        // Validate required fields
        const requiredFields = {
            fullName, email, phoneNumber, designation, visitType,
            "expectedDuration.hours": expectedDuration?.hours,
            "expectedDuration.minutes": expectedDuration?.minutes,
            documentDetails, reasonForVisit, otp, visitorCompany,
            personToVisit, submittedDocument, hasAssets
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(", ")}`
            });
        }

        // Additional validation
        if (!/^[A-Za-z\s]+$/.test(fullName) || !/^[A-Za-z\s]+$/.test(personToVisit)) {
            return res.status(400).json({ 
                success: false,
                message: "Names must contain only letters and spaces" 
            });
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({ 
                success: false,
                message: "Phone number must be 10 digits" 
            });
        }
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({ 
                success: false,
                message: "OTP must be 6 digits" 
            });
        }
        if (!["yes", "no"].includes(hasAssets)) {
            return res.status(400).json({ 
                success: false,
                message: "hasAssets must be 'yes' or 'no'" 
            });
        }
        if (hasAssets === "yes" && (!assets || assets.length === 0)) {
            return res.status(400).json({ 
                success: false,
                message: "Assets are required if hasAssets is 'yes'" 
            });
        }

        // Validate team members
        if (teamMembers && teamMembers.length > 0) {
            for (const member of teamMembers) {
                if (!member.name || !member.email || !member.documentDetail || !["yes", "no"].includes(member.hasAssets)) {
                    return res.status(400).json({ 
                        success: false,
                        message: "All team member fields are required" 
                    });
                }
                if (member.hasAssets === "yes" && (!member.assets || member.assets.length === 0)) {
                    return res.status(400).json({ 
                        success: false,
                        message: "Assets required for team member if hasAssets is 'yes'" 
                    });
                }
            }
        }

        const newVisitor = new Visitor(req.body);
        await newVisitor.save();

        res.status(201).json({
            success: true,
            message: "Visitor added successfully",
            data: newVisitor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error adding visitor",
            error: error.message
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
                message: "Visitor not found"
            });
        }

        if (visitor.checkOutTime) {
            return res.status(400).json({
                success: false,
                message: "Visitor has already checked out"
            });
        }

        visitor.checkOutTime = new Date();
        await visitor.save();

        res.status(200).json({
            success: true,
            message: "Visitor checked out successfully",
            data: visitor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error during checkout",
            error: error.message
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
                message: "Visitor not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Visitor deleted successfully",
            data: deletedVisitor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting visitor",
            error: error.message
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
                message: "Visitor not found"
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
            data: visitor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error updating visitor",
            error: error.message
        });
    }
};
