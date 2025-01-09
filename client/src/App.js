import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ManageRentals from "./pages/ManageRentals";
import PrivateRoute from "./components/PrivateRoute";  
import ManageCars from "./pages/ManageCars";  
import SearchVehicles from "./pages/SearchVehicles";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/search-vehicles" element={<PrivateRoute><SearchVehicles /></PrivateRoute>} />
        <Route path="/manage-cars" element={
          <PrivateRoute roleRequired="Car Owner">
            <ManageCars />
          </PrivateRoute>
        } />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/manage-rentals" element={<PrivateRoute><ManageRentals /></PrivateRoute>} />
        
        {/* Redirect for undefined routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};


export default App;



