// routes/vehicleRoutes.js
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

router.get('/', vehicleController.getAllVehicles); // GET /api/vehicles
router.post('/', vehicleController.addVehicle); // POST /api/vehicles
router.put('/checkout', vehicleController.checkoutVehicle); // PUT /api/vehicles/checkout
router.delete('/:id', vehicleController.deleteVehicle); // DELETE /api/vehicles/:id
router.get('/report', vehicleController.getVehicleReports); // GET /api/vehicles/report

module.exports = router;