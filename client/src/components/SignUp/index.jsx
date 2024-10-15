import React, { useState } from 'react';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        location: '',
        farmSize: '',
        experience: '',
        pin: '',
        confirmPin: '',
    });

    const [currentPage, setCurrentPage] = useState(1);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleNext = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevious = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission, send formData to backend
        console.log(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
            <div className="bg-white/30 backdrop-blur-lg shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Farmer Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    {currentPage === 1 && (
                        <>
                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="phone">
                                    Phone Number
                                </label>
                                <input
                                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="location">
                                    Location
                                </label>
                                <input
                                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    id="location"
                                    name="location"
                                    type="text"
                                    placeholder="Enter your location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg w-full"
                                    type="button"
                                    onClick={handleNext}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                    {currentPage === 2 && (
                        <>
                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="farmSize">
                                    Farm Size (in acres/hectares)
                                </label>
                                <input
                                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    id="farmSize"
                                    name="farmSize"
                                    type="number"
                                    placeholder="Enter your farm size"
                                    value={formData.farmSize}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="experience">
                                    Farming Experience (Years)
                                </label>
                                <input
                                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    placeholder="Enter years of experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                                    type="button"
                                    onClick={handlePrevious}
                                >
                                    Previous
                                </button>
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                                    type="button"
                                    onClick={handleNext}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                    {currentPage === 3 && (
                        <>
                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="pin">
                                    Set New MPIN
                                </label>
                                <div className="flex justify-between">
                                    {Array(6)
                                        .fill('')
                                        .map((_, index) => (
                                            <input
                                                key={index}
                                                className="w-12 h-12 text-center text-black border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-2xl"
                                                type="password"
                                                name="pin"
                                                maxLength={1}
                                                value={formData.pin[index] || ''}
                                                onChange={(e) =>
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        pin: prevData.pin.substring(0, index) + e.target.value,
                                                    }))
                                                }
                                                required
                                            />
                                        ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="confirmPin">
                                    Re-enter New MPIN
                                </label>
                                <div className="flex justify-between">
                                    {Array(6)
                                        .fill('')
                                        .map((_, index) => (
                                            <input
                                                key={index}
                                                className="w-12 h-12 text-center text-black border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-2xl"
                                                type="password"
                                                name="confirmPin"
                                                maxLength={1}
                                                value={formData.confirmPin[index] || ''}
                                                onChange={(e) =>
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        confirmPin: prevData.confirmPin.substring(0, index) + e.target.value,
                                                    }))
                                                }
                                                required
                                            />
                                        ))}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                                    type="button"
                                    onClick={handlePrevious}
                                >
                                    Previous
                                </button>
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                                    type="submit"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SignUp;
