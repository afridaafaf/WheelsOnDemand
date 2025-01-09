const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Rental = require('../models/Rental');
const auth = require('../middleware/auth');

// Other routes...

router.get('/search', auth, async (req, res) => {
    try {
        const query = {};

        // Basic filters
        if (req.query.category) {
            query.category = req.query.category;
        }
        
        if (req.query.maxPrice) {
            query.price = { $lte: parseFloat(req.query.maxPrice) };
        }

        if (req.query.transmission) {
            query.transmission = req.query.transmission;
        }

        if (req.query.fuelType) {
            query.fuelType = req.query.fuelType;
        }

        if (req.query.minSeats) {
            query.seats = { $gte: parseInt(req.query.minSeats) };
        }

        // Validate date parameters
        if (req.query.startDate && isNaN(Date.parse(req.query.startDate))) {
            return res.status(400).json({ message: 'Invalid startDate format' });
        }
        
        if (req.query.endDate && isNaN(Date.parse(req.query.endDate))) {
            return res.status(400).json({ message: 'Invalid endDate format' });
        }

        // Date availability check
        if (req.query.startDate && req.query.endDate) {
            const startDate = new Date(req.query.startDate);
            const endDate = new Date(req.query.endDate);

            // Find vehicles that are not booked during the requested period
            const bookedVehicles = await Rental.find({
                $or: [
                    {
                        startDate: { $lte: endDate },
                        endDate: { $gte: startDate }
                    },
                    {
                        startDate: { $gte: startDate, $lte: endDate }
                    },
                    {
                        endDate: { $gte: startDate, $lte: endDate }
                    }
                ]
            }).distinct('vehicleId');

            query._id = { $nin: bookedVehicles };
            query.status = 'Available';
        }

        // Execute search query with all filters
        const vehicles = await Vehicle.find(query)
            .select('model category price status transmission fuelType seats images')
            .sort('price');

        res.json(vehicles);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            message: 'Error searching vehicles',
            error: error.message 
        });
    }
});

module.exports = router;
