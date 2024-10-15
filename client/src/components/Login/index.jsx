import React, { useState } from 'react';

const Login = () => {
    const [pin, setPin] = useState(Array(6).fill('')); // to store user-entered PIN
    const [errorMessage, setErrorMessage] = useState(''); // to display an error message if PIN is incorrect
    const correctPin = '123456'; // For demonstration purposes, the correct PIN can be fetched from backend.

    const handlePinChange = (e, index) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value)) {
            let newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);
        }
    };

    const handleSubmit = () => {
        const enteredPin = pin.join('');
        if (enteredPin === correctPin) {
            // Perform actions after successful login (e.g., redirect)
            alert("Login successful!");
        } else {
            setErrorMessage('Incorrect PIN. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500">
            <div className="bg-white/30 backdrop-blur-lg shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-6">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="pin">
                            Enter 6-digit MPIN
                        </label>
                        <div className="flex justify-between">
                            {Array(6)
                                .fill('')
                                .map((_, index) => (
                                    <input
                                        key={index}
                                        className="w-12 h-12 text-center text-black border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-2xl"
                                        type="password"
                                        maxLength={1}
                                        value={pin[index]}
                                        onChange={(e) => handlePinChange(e, index)}
                                    />
                                ))}
                        </div>
                        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full"
                            type="button"
                            onClick={handleSubmit}
                        >
                            Login
                        </button>
                    </div>
                </form>
                <p className="text-white text-center mt-4">
                    Don't have an account? <a href="#" className="underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
