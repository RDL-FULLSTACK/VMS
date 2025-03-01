const express = require("express");
const router = express.Router();
const visitorController = require("../controllers/visitorController"); // Corrected reference

// 🔹 Get All Visitors
router.get("/", visitorController.getAllVisitors);

// 🔹 Add a Visitor
router.post("/", visitorController.addVisitor);

// 🔹 Check Out a Visitor
router.put("/checkout/:id", visitorController.checkOutVisitor);

// 🔹 Delete a Visitor
router.delete("/:id", visitorController.deleteVisitor);

module.exports = router;
