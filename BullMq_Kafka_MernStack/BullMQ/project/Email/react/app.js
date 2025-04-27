import axios from 'axios';
import React, { useState } from 'react';

const AddEmailJob = () => {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/jobs/add-email-job', {
                email,
                subject,
                body,
            });
            alert('Email job added successfully!');
        } catch (err) {
            console.error('Error adding job:', err);
            alert('Failed to add email job.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
            />
            <textarea
                placeholder="Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
            />
            <button type="submit">Add Job</button>
        </form>
    );
};

export default AddEmailJob;
