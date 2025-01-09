import React, { useState, useEffect } from 'react';
import authService from '../services/authService';

const { updateUserProfile, getUserProfile } = authService;

const Profile = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const userProfile = await getUserProfile();
            setProfile(userProfile);
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateUserProfile(profile);
        alert('Profile updated successfully!');
    };

    return (
        <div>
            <h2>Profile Management</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={profile.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={profile.email} onChange={handleChange} required />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
