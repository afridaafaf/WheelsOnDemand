const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/add', verifyToken, vehicleController.addVehicle);
router.put('/toggle-status/:id', verifyToken, vehicleController.toggleVehicleStatus);
router.get('/search', verifyToken, vehicleController.searchVehicles);

module.exports = router;
