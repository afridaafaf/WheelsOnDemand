import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { isTokenValid } from '../utils/jwtUtils';
import axios from 'axios';
import ManageCars from './ManageCars';
import AvailableCars from './AvailableCars';
import { getRecentRentals } from '../services/rentalService'; // Importing the function to fetch recent rentals

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [recentRentals, setRecentRentals] = useState([]); // Initialize as empty array
    const [bookingRequests, setBookingRequests] = useState([]); // Initialize as empty array
    const [bookingLoading, setBookingLoading] = useState(true);
    const [bookingError, setBookingError] = useState(null);
    const [rentalsLoading, setRentalsLoading] = useState(true);
    const [rentalsError, setRentalsError] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchBookingRequests = async () => {
        setBookingLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/api/vehicles/bookings", {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });
            setBookingRequests(response.data);
        } catch (err) {
            console.error("Error fetching booking requests:", err);
            setBookingError(err.response?.data?.message || "Failed to fetch booking requests");
        } finally {
            setBookingLoading(false);
        }
    };

    const handleConfirm = async (requestId) => {
        try {
            // Implement the logic to confirm the booking
            await axios.post(`http://localhost:5000/api/vehicles/bookings/confirm/${requestId}`, {}, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });
            // Refresh booking requests after confirmation
            fetchBookingRequests();
        } catch (err) {
            console.error("Error confirming booking:", err);
        }
    };

    const handleDeny = async (requestId) => {
        try {
            // Implement the logic to deny the booking
            await axios.post(`http://localhost:5000/api/vehicles/bookings/deny/${requestId}`, {}, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });
            // Refresh booking requests after denial
            fetchBookingRequests();
        } catch (err) {
            console.error("Error denying booking:", err);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!isTokenValid(token)) {
                setError("Token is invalid or expired");
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get("http://localhost:5000/api/auth/profile", {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setUser(response.data.user);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError(err.response?.data?.message || "Failed to fetch user data");
            }
        };

        const fetchRecentRentals = async () => {
            setRentalsLoading(true);
            try {
                const response = await getRecentRentals();
                setRecentRentals(response.rentals || []); // Set to empty array on error
            } catch (err) {
                console.error("Error fetching recent rentals:", err);
                setRentalsError(err.message || "Failed to fetch rentals");
            } finally {
                setRentalsLoading(false);
            }
        };

        fetchUser();
        fetchRecentRentals(); // Call to fetch recent rentals
        fetchBookingRequests(); // Call to fetch booking requests
    }, [navigate]);

    const renderRoleSpecificContent = () => {
        if (user.role === "Car Owner") {
            return (
                <div>
                    <h3>Car Owner Dashboard</h3>
                    <ManageCars />
                </div>
            );
        } else if (user.role === "Renter") {
            return (
                <div>
                    <h3>Renter Dashboard</h3>
                    <p>Browse available cars for rent:</p>
                    <AvailableCars />
                </div>
            );
        }
    };

    const renderBookingRequests = () => {
        if (bookingLoading) return <p>Loading booking requests...</p>;
        if (bookingError) return <p className="error-message">{bookingError}</p>;
        if (bookingRequests.length === 0) return <p>No booking requests found.</p>;

        return (
            <div></div>
        );
    };

    if (error) return <div className="dashboard-error">Error: {error}</div>;
    if (!user) return <div className="dashboard-loading">Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Welcome, {user.name}!</h2>
                <div className="user-info">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                </div>
            </div>
            <div className="dashboard-content">
                {renderRoleSpecificContent()}
            </div>
            
            <div className="recent-rentals">
                <h3>Recent Rentals</h3>
                {rentalsLoading ? (
                    <p>Loading rentals...</p>
                ) : rentalsError ? (
                    <p className="error-message">{rentalsError}</p>
                ) : recentRentals.length > 0 ? (
                    <ul>
                        {recentRentals.map((rental) => (
                            <li key={rental._id}>
                                {rental.vehicle?.model || 'Unknown Vehicle'} - 
                                {new Date(rental.startDate).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recent rentals found</p>
                )}
            </div>
            <div className="quick-access">
                <h3>Quick Access</h3>
                <ul>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/manage-rentals">Manage Rentals</Link></li>
                    {/* Add more quick access links as needed */}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
