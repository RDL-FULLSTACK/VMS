// backend/src/controllers/visitorController.js
const Visitor = require("../models/Visitor");

// 🔹 Get All Visitors
exports.getAllVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.find();
        res.status(200).json(visitors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🔹 Add Visitor
exports.addVisitor = async (req, res) => {
    try {
        const newVisitor = new Visitor(req.body);
        await newVisitor.save();
        res.status(201).json({ message: "Visitor added successfully", visitor: newVisitor });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 🔹 Delete Visitor
exports.deleteVisitor = async (req, res) => {
    try {
        await Visitor.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Visitor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
