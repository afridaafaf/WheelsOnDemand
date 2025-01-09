const Vehicle = require('../models/Vehicle');
const Rental = require('../models/Rental');

const vehicleController = {
    addVehicle: async (req, res) => {
        try {
            const newVehicle = new Vehicle(req.body);
            await newVehicle.save();
            res.status(201).json(newVehicle);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    toggleVehicleStatus: async (req, res) => {
        try {
            const vehicle = await Vehicle.findById(req.params.id);
            if (!vehicle) {
                return res.status(404).json({ message: 'Vehicle not found' });
            }
            vehicle.status = vehicle.status === 'Available' ? 'Unavailable' : 'Available';
            await vehicle.save();
            res.json(vehicle);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    searchVehicles: async (req, res) => {
        try {
            const query = {};
            // ... existing search logic ...
            const vehicles = await Vehicle.find(query);
            res.json(vehicles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = vehicleController;
