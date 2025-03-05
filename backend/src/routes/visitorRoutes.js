const express = require('express');
const router = express.Router();
const { 
    getAllVisitors, 
    addVisitor, 
    checkOutVisitor, 
    deleteVisitor, 
    updateVisitor 
} = require('../controllers/visitorController');

router.get('/', getAllVisitors);
router.post('/checkin', addVisitor); // Matches frontend endpoint
router.put('/checkout/:id', checkOutVisitor);
router.delete('/:id', deleteVisitor);
router.put('/:id', updateVisitor);

module.exports = router;