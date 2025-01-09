import axios from 'axios';

export const rentCar = async (carId, rentalDetails) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`http://localhost:5000/api/rentals/rent`, {
        carId,
        ...rentalDetails
    }, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data; // Assuming the response contains rental confirmation details
};

export const getRecentRentals = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get("http://localhost:5000/api/rentals/recent", { // Corrected endpoint
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.rentals || []; // Return rentals or an empty array if not found
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch rentals' };
    }
};
// Add these functions to the existing file

export const searchVehicles = async (criteria) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get('http://localhost:5000/api/vehicles/search', {
            params: criteria,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to search vehicles' };
    }
};

export const bookVehicle = async (vehicleId, startDate, endDate) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post('http://localhost:5000/api/rentals/book', 
            {
                vehicleId,
                startDate,
                endDate
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to book vehicle' };
    }
};
