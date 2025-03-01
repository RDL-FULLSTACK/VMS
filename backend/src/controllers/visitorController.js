const Visitor = require("../models/Visitor");

// 🔹 Get All Visitors
exports.getAllVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.find().populate("vehicle"); // Ensure vehicle model exists
        res.status(200).json(visitors);
    } catch (error) {
        res.status(500).json({ message: "Error fetching visitors", error: error.message });
    }
};

// 🔹 Add Visitor
exports.addVisitor = async (req, res) => {
    try {
        const { name, phone, address, vehicle } = req.body;

        // Validate input
        if (!name || !phone || !address) {
            return res.status(400).json({ message: "Name, phone, and address are required" });
        }

        const newVisitor = new Visitor(req.body);
        await newVisitor.save();
        res.status(201).json({ message: "Visitor added successfully", visitor: newVisitor });
    } catch (error) {
        res.status(400).json({ message: "Error adding visitor", error: error.message });
    }
};

// 🔹 Check Out Visitor
exports.checkOutVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.findById(req.params.id);
        if (!visitor) {
            return res.status(404).json({ message: "Visitor not found" });
        }

        // Prevent multiple check-outs
        if (visitor.checkOutTime) {
            return res.status(400).json({ message: "Visitor has already checked out" });
        }

        visitor.checkOutTime = new Date();
        await visitor.save();

        res.status(200).json({ message: "Visitor checked out successfully", visitor });
    } catch (error) {
        res.status(500).json({ message: "Error during checkout", error: error.message });
    }
};

// 🔹 Delete Visitor
exports.deleteVisitor = async (req, res) => {
    try {
        const deletedVisitor = await Visitor.findByIdAndDelete(req.params.id);
        if (!deletedVisitor) {
            return res.status(404).json({ message: "Visitor not found" });
        }
        res.status(200).json({ message: "Visitor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting visitor", error: error.message });
    }
};
