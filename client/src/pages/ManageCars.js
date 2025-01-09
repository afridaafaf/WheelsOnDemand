import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../ManageCars.css';

const API_URL = "http://localhost:5000/api";

const ManageCars = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [newVehicle, setNewVehicle] = useState({
        model: '',
        licensePlate: '',
        price: '',
        category: 'Economy',
        status: 'Available',
        features: [],
        year: new Date().getFullYear(),
        transmission: 'Automatic',
        fuelType: 'Petrol',
        seats: 4,
        owner: '' // Added owner field
    });

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
    };

    useEffect(() => {
        fetchVehicles();
        // Get user ID from token
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUserId(payload.id);
            setNewVehicle(prev => ({ ...prev, owner: payload.id }));
        }
    }, []);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/vehicles`, getAuthHeader());
            setVehicles(response.data);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching vehicles');
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddVehicle = async () => {
        try {
            setLoading(true);
            const vehicleData = {
                ...newVehicle,
                owner: userId // Ensure owner is set
            };
            const response = await axios.post(
                `${API_URL}/vehicles`,
                vehicleData,
                getAuthHeader()
            );
            setVehicles([...vehicles, response.data.vehicle]);
            setNewVehicle({
                model: '',
                licensePlate: '',
                price: '',
                category: 'Economy',
                status: 'Available',
                features: [],
                year: new Date().getFullYear(),
                transmission: 'Automatic',
                fuelType: 'Petrol',
                seats: 4,
                owner: userId // Keep the owner ID
            });
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || 'Error adding vehicle');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (vehicleId) => {
        try {
            const response = await axios.put(`${API_URL}/vehicles/status/${vehicleId}`, {}, getAuthHeader());
            // Update the vehicles state with the new status
            setVehicles(vehicles.map(vehicle => 
                vehicle._id === vehicleId ? { ...vehicle, status: response.data.vehicle.status } : vehicle
            ));
        } catch (error) {
            console.error('Error toggling vehicle status:', error);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="manage-cars">
            <h2>Add New Vehicle</h2>
            {error && <div className="error-message">{error}</div>}
            
            <div className="add-vehicle-form">
                <div className="form-group">
                    <label>Model:</label>
                    <input
                        type="text"
                        name="model"
                        value={newVehicle.model}
                        onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>License Plate:</label>
                    <input
                        type="text"
                        name="licensePlate"
                        value={newVehicle.licensePlate}
                        onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Price per Day:</label>
                    <input
                        type="number"
                        name="price"
                        value={newVehicle.price}
                        onChange={(e) => setNewVehicle({...newVehicle, price: e.target.value})}
                        min="0"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Category:</label>
                    <select
                        name="category"
                        value={newVehicle.category}
                        onChange={(e) => setNewVehicle({...newVehicle, category: e.target.value})}
                        required
                    >
                        <option value="Economy">Economy</option>
                        <option value="Luxury">Luxury</option>
                        <option value="SUV">SUV</option>
                        <option value="Van">Van</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Year:</label>
                    <input
                        type="number"
                        name="year"
                        value={newVehicle.year}
                        onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                        min="1900"
                        max={new Date().getFullYear()}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Transmission:</label>
                    <select
                        name="transmission"
                        value={newVehicle.transmission}
                        onChange={(e) => setNewVehicle({...newVehicle, transmission: e.target.value})}
                        required
                    >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Fuel Type:</label>
                    <select
                        name="fuelType"
                        value={newVehicle.fuelType}
                        onChange={(e) => setNewVehicle({...newVehicle, fuelType: e.target.value})}
                        required
                    >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Number of Seats:</label>
                    <input
                        type="number"
                        name="seats"
                        value={newVehicle.seats}
                        onChange={(e) => setNewVehicle({...newVehicle, seats: e.target.value})}
                        min="1"
                        required
                    />
                </div>

                <button onClick={handleAddVehicle} className="submit-button">Add Vehicle</button>
            </div>

            <h2>Vehicle List</h2>
            <div className="vehicles-list">
                {vehicles.map(vehicle => (
                    <div key={vehicle._id} className="vehicle-card">
                        <h3>{vehicle.model}</h3>
                        <p>License Plate: {vehicle.licensePlate}</p>
                        <p>Price: ${vehicle.price}/day</p>
                        <p>Status: {vehicle.status}</p>
                        <p>Category: {vehicle.category}</p>
                        <p>Year: {vehicle.year}</p>
                        <p>Transmission: {vehicle.transmission}</p>
                        <p>Fuel Type: {vehicle.fuelType}</p>
                        <p>Seats: {vehicle.seats}</p>
                        <button onClick={() => handleToggleStatus(vehicle._id)}>
                            {vehicle.status === 'Available' ? 'Make Unavailable' : 'Make Available'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageCars;
