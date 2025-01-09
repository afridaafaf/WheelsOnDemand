import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReminderPage = () => {
    const [reminders, setReminders] = useState([]);
    const [newReminder, setNewReminder] = useState('');

    useEffect(() => {
        fetchReminders();
    }, []);

    const fetchReminders = async () => {
        try {
            const response = await axios.get('/api/reminders');
            setReminders(response.data);
        } catch (error) {
            console.error('Error fetching reminders:', error);
        }
    };

    const addReminder = async () => {
        try {
            const response = await axios.post('/api/reminders', { text: newReminder });
            setReminders([...reminders, response.data]);
            setNewReminder('');
        } catch (error) {
            console.error('Error adding reminder:', error);
        }
    };

    return (
        <div>
            <h1>Reminders</h1>
            <ul>
                {reminders.map((reminder) => (
                    <li key={reminder.id}>{reminder.text}</li>
                ))}
            </ul>
            <input
                type="text"
                value={newReminder}
                onChange={(e) => setNewReminder(e.target.value)}
            />
            <button onClick={addReminder}>Add Reminder</button>
        </div>
    );
};

export default ReminderPage;