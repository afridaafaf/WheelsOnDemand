import React, { useState, useEffect } from 'react';
import { rentCar, getRecentRentals } from '../services/rentalService';

const ManageRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      const response = await getRecentRentals();
      setRentals(response.rentals || response); // Handle both response structures
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load rentals');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="manage-rentals">
      <h2>My Rentals</h2>
      <div className="rentals-list">
        {rentals.map((rental) => (
          <div key={rental._id} className="rental-card">
            <h3>Vehicle: {rental.vehicle.model}</h3>
            <p>Start Date: {new Date(rental.startDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(rental.endDate).toLocaleDateString()}</p>
            <p>Status: {rental.status}</p>
            <p>Total Cost: ${rental.totalCost}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageRentals;