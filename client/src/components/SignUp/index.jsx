import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FiChevronRight, FiChevronLeft, FiUser, FiPhone, FiMapPin, FiCrop, FiClock, FiLock } from 'react-icons/fi';

const SignUp = () => {
    const formDataRef = useRef({
        name: '',
        phone: '',
        location: '',
        farmSize: '',
        experience: '',
        pin: '',
        confirmPin: '',
    });

    const [errors, setErrors] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    const validateForm = useCallback((page) => {
        const formData = formDataRef.current;  // Accessing formData from useRef
        const newErrors = {};
        switch (page) {
            case 1:
                if (!formData.name.trim()) newErrors.name = "Name is required";
                if (!formData.phone.trim()) newErrors.phone = "Phone is required";
                else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";
                if (!formData.location.trim()) newErrors.location = "Location is required";
                break;
            case 2:
                if (!formData.farmSize) newErrors.farmSize = "Farm size is required";
                else if (isNaN(formData.farmSize) || Number(formData.farmSize) <= 0) newErrors.farmSize = "Invalid farm size";
                if (!formData.experience) newErrors.experience = "Experience is required";
                else if (isNaN(formData.experience) || Number(formData.experience) < 0) newErrors.experience = "Invalid experience";
                break;
            case 3:
                if (!formData.pin) newErrors.pin = "PIN is required";
                else if (!/^\d{6}$/.test(formData.pin)) newErrors.pin = "PIN must be 6 digits";
                if (!formData.confirmPin) newErrors.confirmPin = "Confirm PIN is required";
                else if (formData.pin !== formData.confirmPin) newErrors.confirmPin = "PINs do not match";
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        formDataRef.current[name] = value;  // Update formData in useRef

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    }, [errors]);

    const handleNext = useCallback(() => {
        if (validateForm(currentPage)) {
            setCurrentPage(prev => prev + 1);
        }
    }, [currentPage, validateForm]);

    const handlePrevious = useCallback(() => {
        setCurrentPage(prev => prev - 1);
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (validateForm(3)) {
            try {
                const response = await axios.post('http://localhost:5000/register', formDataRef.current);  // Submit formData from useRef
                const { token, userId } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                alert('Sign up successful!');
                window.location.href = '/dashboard';
            } catch (error) {
                console.error('Error registering user:', error);
                alert('Something went wrong. Please try again.');
            }
        }
    }, [validateForm]);

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                type: "spring",
                stiffness: 100
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.3 }
        }
    };

    const pageVariants = {
        hidden: { opacity: 0, x: '100%' },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: '-100%' },
    };

    const pageTransition = {
        type: 'tween',
        ease: 'anticipate',
        duration: 0.5,
    };

    const InputField = useCallback(({ icon: Icon, name, ...props }) => (
        <div className="relative mb-6">
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-600" size={20} />
            <input
                name={name}
                defaultValue={formDataRef.current[name]}  // Set defaultValue from useRef
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-300 ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
                {...props}
            />
            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
        </div>
    ), [errors, handleChange]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-sans">
            <motion.div
                className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <motion.div
                    className="mb-8 flex justify-center"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <FiUser className="text-6xl text-violet-600" />
                </motion.div>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Farmer Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            variants={pageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={pageTransition}
                        >
                            {currentPage === 1 && (
                                <>
                                    <InputField icon={FiUser} name="name" type="text" placeholder="Enter your name" required />
                                    <InputField icon={FiPhone} name="phone" type="tel" placeholder="Enter your phone number" required />
                                    <InputField icon={FiMapPin} name="location" type="text" placeholder="Enter your location" required />
                                </>
                            )}

                            {currentPage === 2 && (
                                <>
                                    <InputField icon={FiCrop} name="farmSize" type="number" placeholder="Enter your farm size (acres/hectares)" required />
                                    <InputField icon={FiClock} name="experience" type="number" placeholder="Enter years of experience" required />
                                </>
                            )}

                            {currentPage === 3 && (
                                <>
                                    <InputField icon={FiLock} name="pin" type="password" placeholder="Set New MPIN (6 digits)" maxLength={6} required />
                                    <InputField icon={FiLock} name="confirmPin" type="password" placeholder="Re-enter New MPIN" maxLength={6} required />
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between mt-8">
                        {currentPage > 1 && (
                            <button
                                type="button"
                                className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-gray-600 focus:outline-none"
                                onClick={handlePrevious}
                            >
                                <FiChevronLeft size={24} />
                            </button>
                        )}
                        {currentPage < 3 && (
                            <button
                                type="button"
                                className="bg-violet-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-violet-600 focus:outline-none"
                                onClick={handleNext}
                            >
                                <FiChevronRight size={24} />
                            </button>
                        )}
                        {currentPage === 3 && (
                            <button
                                type="submit"
                                className="bg-violet-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-violet-600 focus:outline-none"
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default SignUp;
