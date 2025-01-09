import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchVehicles = () => {
    const [showConfirmation, setShowConfirmation] = useState(false); // New state for confirmation message
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        number: '',
        address: ''
    });
    const [searchCriteria, setSearchCriteria] = useState({
        startDate: '',
        endDate: '',
        category: '',
        maxPrice: '',
        transmission: '',
        fuelType: '',
        minSeats: ''
    });
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5002/api/vehicles/search', {
                params: searchCriteria,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setVehicles(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error searching vehicles');
        } finally {
            setLoading(false);
        }
    };

    const handleBookingClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowBookingForm(true);
    };

    const calculateTotalCost = () => {
        if (!selectedVehicle || !searchCriteria.startDate || !searchCriteria.endDate) return 0;
        const days = Math.ceil(
            (new Date(searchCriteria.endDate) - new Date(searchCriteria.startDate)) / (1000 * 60 * 60 * 24)
        );
        return days * selectedVehicle.price;
    };

    const handleConfirmBooking = () => {
        setShowBookingForm(false);
        setShowReceipt(true);
    };

    const handleReceiptSubmit = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5002/api/rentals/book', 
                {
                    vehicleId: selectedVehicle._id,
                    startDate: searchCriteria.startDate,
                    endDate: searchCriteria.endDate,
                    customerInfo
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setShowReceipt(false);
            setSelectedVehicle(null);
            navigate('/manage-rentals'); // Redirect to manage rentals page
        } catch (err) {
            setError(err.response?.data?.message || 'Error booking vehicle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-vehicles">
            <h2>Search Available Vehicles</h2>
            <form onSubmit={handleSearch} className="search-form">
                <div className="form-group">
                    <label>Start Date:</label>
                    <input
                        type="date"
                        value={searchCriteria.startDate}
                        onChange={(e) => setSearchCriteria({...searchCriteria, startDate: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>End Date:</label>
                    <input
                        type="date"
                        value={searchCriteria.endDate}
                        onChange={(e) => setSearchCriteria({...searchCriteria, endDate: e.target.value})}
                        min={searchCriteria.startDate}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Category:</label>
                    <select
                        value={searchCriteria.category}
                        onChange={(e) => setSearchCriteria({...searchCriteria, category: e.target.value})}
                    >
                        <option value="">All Categories</option>
                        <option value="Economy">Economy</option>
                        <option value="Luxury">Luxury</option>
                        <option value="SUV">SUV</option>
                        <option value="Van">Van</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Max Price per Day:</label>
                    <input
                        type="number"
                        value={searchCriteria.maxPrice}
                        onChange={(e) => setSearchCriteria({...searchCriteria, maxPrice: e.target.value})}
                        min="0"
                    />
                </div>
                <button type="submit" className="search-button">Search</button>
            </form>

            {error && <div className="error-message">{error}</div>}
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="vehicles-grid">
                    {vehicles.map(vehicle => (
                        <div key={vehicle._id} className="vehicle-card">
                            <h3>{vehicle.model}</h3>
                            <p>Category: {vehicle.category}</p>
                            <p>Price: ${vehicle.price}/day</p>
                            <p>Status: {vehicle.status}</p>
                            <button 
                                onClick={() => handleBookingClick(vehicle)}
                                disabled={vehicle.status !== 'Available'}
                                className="book-button"
                            >
                                Book Now
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showBookingForm && selectedVehicle && (
                <div className="booking-modal">
                    <div className="booking-content">
                        <h2>Booking Confirmation</h2>
                        <p>Vehicle: {selectedVehicle.model}</p>
                        <p>From: {searchCriteria.startDate}</p>
                        <p>To: {searchCriteria.endDate}</p>
                        <p>Total Cost: ${calculateTotalCost()}</p>
                        <button onClick={handleConfirmBooking} className="confirm-button">Confirm Booking</button>
                        <button onClick={() => setShowBookingForm(false)} className="cancel-button">Cancel</button>
                    </div>
                </div>
            )}

            {showReceipt && (
                <div className="receipt-modal">
                    <div className="receipt-content">
                        <h2>Payment Receipt</h2>
                        <p>Vehicle: {selectedVehicle.model}</p>
                        <p>Total Cost: ${calculateTotalCost()}</p>
                        <p>From: {searchCriteria.startDate}</p>
                        <p>To: {searchCriteria.endDate}</p>
                        <h3>Customer Information</h3>
                        <input 
                            type="text" 
                            placeholder="Name" 
                            value={customerInfo.name} 
                            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})} 
                            required 
                        />
                        <input 
                            type="text" 
                            placeholder="Phone Number" 
                            value={customerInfo.number} 
                            onChange={(e) => setCustomerInfo({...customerInfo, number: e.target.value})} 
                            required 
                        />
                        <input 
                            type="text" 
                            placeholder="Address" 
                            value={customerInfo.address} 
                            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})} 
                            required 
                        />
                        <div className="receipt-buttons">
                            <button onClick={handleReceiptSubmit} className="confirm-button">Confirm Payment</button>
                            <button onClick={() => navigate('/dashboard')} className="exit-button">Exit to Dashboard</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchVehicles;