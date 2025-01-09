const Rental = require('../models/Rental');
const Vehicle = require('../models/Vehicle');
const RentalOrder = require('../models/RentalOrder'); // Import the RentalOrder model

exports.createRental = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;
    const vehicle = await Vehicle.findById(vehicleId);
    
    if (!vehicle || vehicle.status !== 'Available') {
      return res.status(400).json({ message: 'Vehicle not available' });
    }

    const rental = new Rental({
      vehicle: vehicleId,
      renter: req.user.id,
      startDate,
      endDate,
      totalCost: calculateRentalCost(vehicle.price, startDate, endDate)
    });

    await rental.save();

    // Create a rental order
    const rentalOrder = new RentalOrder({
      rental: rental._id,
      vehicle: vehicleId,
      renter: req.user.id,
      startDate,
      endDate,
      totalCost: rental.totalCost
    });

    await rentalOrder.save();

    vehicle.status = 'Reserved';
    await vehicle.save();

    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecentRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ renter: req.user.id })
      .populate('vehicle')
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    
    if (rental.status !== 'Active') {
      return res.status(400).json({ message: 'Rental cannot be cancelled' });
    }

    rental.status = 'Cancelled';
    await rental.save();

    const vehicle = await Vehicle.findById(rental.vehicle);
    vehicle.status = 'Available';
    await vehicle.save();

    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New function to handle booking requests
exports.bookVehicle = async (req, res) => {
    try {
        const { vehicleId, startDate, endDate } = req.body;
        const vehicle = await Vehicle.findById(vehicleId);
        
        if (!vehicle || vehicle.status !== 'Available') {
            return res.status(400).json({ message: 'Vehicle not available' });
        }

        const rental = new Rental({
            vehicle: vehicleId,
            renter: req.user.id,
            startDate,
            endDate,
            totalCost: calculateRentalCost(vehicle.price, startDate, endDate)
        });

        await rental.save();

        // Create a rental order
        const rentalOrder = new RentalOrder({
            rental: rental._id,
            vehicle: vehicleId,
            renter: req.user.id,
            startDate,
            endDate,
            totalCost: rental.totalCost
        });

        await rentalOrder.save();

        // Update vehicle status to 'Reserved'
        vehicle.status = 'Reserved';
        await vehicle.save();

        res.status(201).json(rental);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to calculate rental cost
const calculateRentalCost = (pricePerDay, startDate, endDate) => {
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    return pricePerDay * days;
};
