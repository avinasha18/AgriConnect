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
                setEditedFarmer(response.data); // Sync edited state with fetched data
            } catch (error) {
                console.error(error);
            }
        };

        fetchFarmerProfile();
    }, [farmerID]);

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

                // Updating full crop data into the farmer object
                setEditedFarmer((prevFarmer) => ({
                    ...prevFarmer,
                    crops: [...prevFarmer.crops, createdCrop], // Store the entire crop object
                }));

                setNewCrop(''); // Clear the input field
            } catch (error) {
                console.error("Error adding crop:", error);
            }
        }
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:5000/farmers/profile/${farmerID}`, editedFarmer);
            setFarmer(editedFarmer); // Reflect changes in the farmer state
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
            <div className="flex flex-col items-center justify-center gap-10 bg-white">
                <div className='w-full'>
                    <div className='bg-black flex flex-row text-white p-10 pb-0 gap-10'>
                        <div className="flex items-center justify-center ml-20 -mb-5 z-20 border-8 border-gray-100 rounded-xl">
                            <Lottie animationData={farmerAnimation} loop={true} className="w-44 h-44" />
                        </div>
                        <div className='flex flex-col pt-20'>
                            <p className='text-2xl font-semibold'>{farmer.name}</p>
                            <p className='text-lg'>{farmer.location}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full p-20">
                        <div className="col-span-2">
                            <h3 className="text-lg font-semibold">Crops</h3>
                            {Array.isArray(farmer.crops) && farmer.crops.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                                    {farmer.crops.map((crop, index) => (
                                        crop && ( // Ensure the crop object is valid
                                            <div
                                                key={index}
                                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 hover:scale-105 transform"
                                            >
                                                <div className="flex flex-col items-start gap-2">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                                                        <Leaf className="mr-2 text-green-500" /> {crop.name || 'Unknown Crop'} {/* Default to 'Unknown Crop' if name is missing */}
                                                    </h3>
                                                    <p className="text-gray-600 flex items-center">
                                                        <BarChart className="mr-2 text-gray-500" size={18} />
                                                        Type: {crop.type || 'N/A'} {/* Default to 'N/A' if type is missing */}
                                                    </p>
                                                    <p className="text-gray-600 flex items-center">
                                                        <Calendar className="mr-2 text-gray-500" size={18} /> Season: {crop.season || 'Unknown'} {/* Default to 'Unknown' if season is missing */}
                                                    </p>
                                                    <p className="text-gray-600 flex items-center">
                                                        <Lock className="mr-2 text-gray-500" size={18} /> Status: {crop.status || 'Active'} {/* Default to 'Active' if not provided */}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-700">No crops added.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
