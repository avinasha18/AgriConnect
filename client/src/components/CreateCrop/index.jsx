import React, { useState } from 'react';
import axios from 'axios';

const CreateCrop = () => {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        season: '',
        averageYield: '',
        growingConditions: '',
        farmerId: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/crops', formData);
            alert('Crop created successfully!');
            console.log(response.data);
        } catch (error) {
            alert('Error creating crop');
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Type:</label>
                <input type="text" name="type" value={formData.type} onChange={handleChange} required />
            </div>
            <div>
                <label>Season:</label>
                <input type="text" name="season" value={formData.season} onChange={handleChange} required />
            </div>
            <div>
                <label>Average Yield:</label>
                <input type="text" name="averageYield" value={formData.averageYield} onChange={handleChange} required />
            </div>
            <div>
                <label>Growing Conditions:</label>
                <input type="text" name="growingConditions" value={formData.growingConditions} onChange={handleChange} required />
            </div>
            <div>
                <label>Farmer ID:</label>
                <input type="text" name="farmerId" value={formData.farmerId} onChange={handleChange} required />
            </div>
            <button type="submit">Create Crop</button>
        </form>
    );
};

export default CreateCrop;
