import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'lottie-react';
import farmerAnimation from './farmerAnimation.json'; // Replace with your Lottie animation file
import { User, Phone, MapPin, Leaf, Calendar, Lock, Edit, PlusCircle } from 'lucide-react';

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

    const farmerID = localStorage.getItem('userId')

    useEffect(() => {
        const fetchFarmerProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/farmers/profile/${farmerID}`); // Pass farmerID in the URL
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
                    name: newCrop, // You may want to collect additional details for the crop
                    type: "Grain", // Example placeholder, replace with actual crop details
                    season: "Winter",
                    averageYield: 50,
                    growingConditions: {
                        soilType: "Loamy",
                        temperature: { min: 10, max: 30 },
                        rainfall: 120,
                    },
                    farmerId: farmer._id
                };

                // Send request to backend to create crop and associate it with the farmer
                const response = await axios.post(`http://localhost:5000/crops/${farmer._id}`, cropData);
                const createdCrop = response.data;

                // Update farmer's crop list with the new crop
                setEditedFarmer((prevFarmer) => ({
                    ...prevFarmer,
                    crops: [...prevFarmer.crops, createdCrop.name], // Assuming 'name' is what you display
                }));

                setNewCrop(''); // Clear the input field after adding
            } catch (error) {
                console.error("Error adding crop:", error);
            }
        }
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:5000/farmers/profile/${farmerID}`, editedFarmer); // PUT request to update farmer's profile
            setFarmer(editedFarmer); // Update state with edited farmer profile
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (!farmer) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-col p-10'>
            <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded fixed right-10"
                onClick={() => setIsEditing(true)}
            >
                <p className='flex flex-row'><Edit className="mr-2" /> Edit Profile</p>
            </button>
            <div className="max-w-4xl flex flex-col items-center justify-center mx-auto p-16 gap-10 bg-white">

                <div className="flex items-center justify-center mb-6">
                    <Lottie animationData={farmerAnimation} loop={true} className="w-60 h-60" />
                </div>

                {/* Farmer Profile Information */}
                {!isEditing ? (
                    <div className='w-full'>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
                            <div className="flex items-center w-60">
                                <User className="mr-3 text-gray-600" />
                                <div className="flex flex-row items-center gap-2">
                                    <h3 className="text-lg font-semibold">Name</h3>
                                    <p className="text-gray-700">{farmer.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center w-60">
                                <Phone className="mr-3 text-gray-600" />
                                <div className="flex flex-row items-center gap-2">
                                    <h3 className="text-lg font-semibold">Phone</h3>
                                    <p className="text-gray-700">{farmer.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center w-60">
                                <MapPin className="mr-3 text-gray-600" />
                                <div className="flex flex-row items-center gap-2">
                                    <h3 className="text-lg font-semibold">Location</h3>
                                    <p className="text-gray-700">{farmer.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center w-60">
                                <Leaf className="mr-3 text-gray-600" />
                                <div className="flex flex-row items-center gap-2">
                                    <h3 className="text-lg font-semibold">Farm Size</h3>
                                    <p className="text-gray-7 w-6000">{farmer.farmSize} acres</p>
                                </div>
                            </div>
                            <div className="flex items-center w-60">
                                <Calendar className="mr-3 text-gray-600" />
                                <div className="flex flex-row items-center gap-2">
                                    <h3 className="text-lg font-semibold">Experience</h3>
                                    <p className="text-gray-700">{farmer.experience} years</p>
                                </div>
                            </div>

                            {/* Crops List */}
                            <div className="col-span-2">
                                <h3 className="text-lg font-semibold">Crops</h3>
                                {farmer.crops && farmer.crops.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                                        {farmer.crops.map((crop, index) => (
                                            <div
                                                key={index}
                                                className="bg-white rounded-lg shadow-lg pt-4 pl-4 px-10 py-10 transition-transform transform hover:scale-105"
                                            >
                                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{crop.name}</h3>
                                                <p className="text-gray-600">{crop.type}</p>
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
