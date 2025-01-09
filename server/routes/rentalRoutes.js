const express = require('express');
const router = express.Router();
const { verifyToken, isRenter } = require('../middleware/authMiddleware');
const rentalController = require('../controllers/rentalController');

router.post('/rent', verifyToken, isRenter, rentalController.createRental);
router.post('/book', verifyToken, isRenter, rentalController.bookVehicle); // New booking route
router.get('/recent', verifyToken, rentalController.getRecentRentals);
router.put('/:id/cancel', verifyToken, rentalController.cancelRental);

module.exports = router;