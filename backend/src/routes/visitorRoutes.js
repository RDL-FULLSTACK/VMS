// const express = require('express');
// const router = express.Router();
// const { 
//     getAllVisitors, 
//     addVisitor, 
//     checkOutVisitor, 
//     deleteVisitor, 
//     updateVisitor 
// } = require('../controllers/visitorController');

// router.get('/', getAllVisitors);
// router.post('/checkin', addVisitor); // Matches frontend endpoint
// router.put('/checkout/:id', checkOutVisitor);
// router.delete('/:id', deleteVisitor);
// router.put('/:id', updateVisitor);

// module.exports = router;



const express = require("express");
const router = express.Router();
const { 
    getAllVisitors, 
    getLatestVisitor,
    addVisitor, 
    checkOutVisitor, 
    deleteVisitor, 
    updateVisitor 
} = require("../controllers/visitorController");

router.get("/", getAllVisitors);
router.get("/latest", getLatestVisitor); // Added route to fetch the latest visitor
router.post("/checkin", addVisitor);
router.put("/checkout/:id", checkOutVisitor);
router.put("/:id", updateVisitor);
router.delete("/:id", deleteVisitor);

module.exports = router;
