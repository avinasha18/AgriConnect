import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AvailableCrops = () => {
    const [crops, setCrops] = useState([]);

    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const response = await axios.get('/api/crops/available');
                setCrops(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCrops();
    }, []);

    return (
        <div>
            <h2>Available Crops</h2>
            <ul>
                {crops.map(crop => (
                    <li key={crop._id}>
                        <h3>{crop.name}</h3>
                        <p>Type: {crop.type}</p>
                        <p>Season: {crop.season}</p>
                        <p>Average Yield: {crop.averageYield}</p>
                        <p>Growing Conditions: {crop.growingConditions}</p>
                        <p>Farmer: {crop.farmer.name}</p>
                        <p>Farmer Phone: {crop.farmer.phone}</p>
                        <p>Farmer Location: {crop.farmer.location}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AvailableCrops;
