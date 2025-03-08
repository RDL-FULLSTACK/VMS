


// const express = require("express");
// const router = express.Router();
// const { 
//     getAllVisitors, 
//     getLatestVisitor,
//     addVisitor, 
//     checkOutVisitor, 
//     deleteVisitor, 
//     updateVisitor ,
    
// } = require("../controllers/visitorController");

// router.get("/", getAllVisitors);
// router.get("/latest", getLatestVisitor); // Added route to fetch the latest visitor
// router.post("/checkin", addVisitor);
// router.put("/checkout/:id", checkOutVisitor);
// router.put("/:id", updateVisitor);
// router.delete("/:id", deleteVisitor);


// module.exports = router;



const express = require("express");
const router = express.Router();
const { 
    getAllVisitors, 
    getLatestVisitor,
    getVisitorById, // Add this
    addVisitor,
    sendEmailOtp, 
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
router.post("/send-email-otp", sendEmailOtp);

module.exports = router;