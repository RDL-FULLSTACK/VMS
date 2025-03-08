


const express = require("express");
const router = express.Router();
const { 
    getAllVisitors, 
    getLatestVisitor,
    getVisitorById, // Add this
    addVisitor, 
    checkOutVisitor, 
    deleteVisitor, 
    updateVisitor 
} = require("../controllers/visitorController");

router.get("/", getAllVisitors);
router.get("/latest", getLatestVisitor);
router.get("/:id", getVisitorById); // New route
router.post("/checkin", addVisitor);
router.put("/checkout/:id", checkOutVisitor);
router.put("/:id", updateVisitor);
router.delete("/:id", deleteVisitor);

module.exports = router;