import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import farmerAnimation from './farmerAnimation.json'; // Replace with your Lottie animation file
import { User, Phone, MapPin, Leaf, Calendar, Lock, Edit, PlusCircle, BarChart } from 'lucide-react';

const Profile = () => {
    const [farmer, setFarmer] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newCrop, setNewCrop] = useState('');
    const [editedFarmer, setEditedFarmer] = useState({
        name: '',
        phone: '',
        location: '',
        farmSize: '',
        experience: '',
        pin: '',
        crops: [],
    });

    const farmerID = localStorage.getItem('userId');

    useEffect(() => {
        const fetchFarmerProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/farmers/profile/${farmerID}`);
                setFarmer(response.data);
                setEditedFarmer(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFarmerProfile();
    }, []);

    const handleInputChange = (e) => {
        setEditedFarmer({ ...editedFarmer, [e.target.name]: e.target.value });
    };

    const handleAddCrop = async () => {
        if (newCrop) {
            try {
                const cropData = {
                    name: newCrop,
                    type: "Grain",
                    season: "Winter",
                    averageYield: 50,
                    growingConditions: {
                        soilType: "Loamy",
                        temperature: { min: 10, max: 30 },
                        rainfall: 120,
                    },
                    farmerId: farmer._id
                };

                const response = await axios.post(`http://localhost:5000/crops/${farmer._id}`, cropData);
                const createdCrop = response.data;

                setEditedFarmer((prevFarmer) => ({
                    ...prevFarmer,
                    crops: [...prevFarmer.crops, createdCrop.name],
                }));

                setNewCrop('');
            } catch (error) {
                console.error("Error adding crop:", error);
            }
        }
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:5000/farmers/profile/${farmerID}`, editedFarmer);
            setFarmer(editedFarmer);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (!farmer) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-col'>
            <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded fixed right-10"
                onClick={() => setIsEditing(true)}
            >
                <p className='flex flex-row'><Edit className="mr-2" /> Edit Profile</p>
            </button>
            <div className="flex flex-col items-center justify-center gap-10 bg-white">
                {/* Farmer Profile Information */}
                {!isEditing ? (
                    <div className='w-full'>
                        <div className='bg-black flex flex-row text-white p-10 gap-10'>
                            <div className="flex items-center justify-center mb-6 z-20 fixed left-1/4 border-8 border-gray-100 rounded-xl">
                                <Lottie animationData={farmerAnimation} loop={true} className="w-48 h-48" />
                            </div>
                            <div className='flex flex-col px-[22rem] pt-20'>
                                <p className='text-2xl font-semibold'>{farmer.name}</p>
                                <p className='text-lg'>{farmer.location}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full p-20">
                            {/* Crops List */}
                            <div className="col-span-2">
                                <h3 className="text-lg font-semibold">Crops</h3>
                                {farmer.crops && farmer.crops.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                                        {farmer.crops.map((crop, index) => (
                                            <div
                                                key={index}
                                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 hover:scale-105 transform"
                                            >
                                                <div className="flex flex-col items-start gap-2">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                                                        <Leaf className="mr-2 text-green-500" /> {crop.name} {/* Access crop.name */}
                                                    </h3>
                                                    <p className="text-gray-600 flex items-center">
                                                        <BarChart className="mr-2 text-gray-500" size={18} />
                                                        Type: {crop.type} {/* Access crop.type */}
                                                    </p>

                                                    <p className="text-gray-600 flex items-center">
                                                        <Calendar className="mr-2 text-gray-500" size={18} /> Season: {crop.season} {/* Access crop.season */}
                                                    </p>
                                                    <p className="text-gray-600 flex items-center">
                                                        <Lock className="mr-2 text-gray-500" size={18} /> Status: {crop.status} {/* Access crop.status */}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                ) : (
                                    <p className="text-gray-700">No crops added.</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        {/* Edit Form */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-semibold mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editedFarmer.name}
                                    onChange={handleInputChange}
                                    className="border p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 w-96 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-semibold mb-2">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={editedFarmer.phone}
                                    onChange={handleInputChange}
                                    className="border p-3 rounded bg-gray-100 focus:outline-none focus:ring-2  w-96 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-semibold mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={editedFarmer.location}
                                    onChange={handleInputChange}
                                    className="border p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 w-96 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-semibold mb-2">Farm Size (acres)</label>
                                <input
                                    type="text"
                                    name="farmSize"
                                    value={editedFarmer.farmSize}
                                    onChange={handleInputChange}
                                    className="border p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 w-96 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-semibold mb-2">Experience (years)</label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={editedFarmer.experience}
                                    onChange={handleInputChange}
                                    className="border p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 w-96 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-semibold mb-2">PIN</label>
                                <input
                                    type="text"
                                    name="pin"
                                    value={editedFarmer.pin}
                                    onChange={handleInputChange}
                                    className="border p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 w-96 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Add Crop Section */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold">Add Crops</h3>
                            <div className="flex mt-4">
                                <input
                                    type="text"
                                    value={newCrop}
                                    onChange={(e) => setNewCrop(e.target.value)}
                                    placeholder="Enter crop name"
                                    className="border p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 w-96 focus:ring-blue-500 flex-grow"
                                />
                                <button
                                    className="ml-2 bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={handleAddCrop}
                                >
                                    <PlusCircle className="mr-2" /> Add Crop
                                </button>
                            </div>

                            {/* Display added crops */}
                            <ul className="mt-4">
                                {editedFarmer?.crops?.map((crop, index) => (
                                    <li key={index} className="text-gray-700">{crop}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Save Changes */}
                        <button
                            className="mt-6 bg-green-500 text-white px-4 py-2 rounded"
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
