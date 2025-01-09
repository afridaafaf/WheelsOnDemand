import React, { useState, useEffect } from "react";
import axios from 'axios';

const AvailableCars = () => {
    const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchVehicles = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get("http://localhost:5000/api/vehicles", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setVehicles(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Error fetching vehicles");
            }
        };

        fetchVehicles();
    }, []);

    if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

    return (
        <div>
            <h3>Available Cars for Rent</h3>
            <ul>
                {vehicles.map(vehicle => (
                    <li key={vehicle._id}>
                        {vehicle.model} - {vehicle.licensePlate} - {vehicle.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AvailableCars;
