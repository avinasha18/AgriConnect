import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { setToken } from '../../services/authSlice';
import { FiPhone, FiLock, FiArrowRight, FiUser } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState(Array(6).fill(''));
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handlePinChange = (e, index) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value)) {
            let newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            if (index < 5 && value) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (index > 0 && !pin[index]) {
                inputRefs.current[index - 1].focus();
            } else {
                let newPin = [...pin];
                newPin[index] = '';
                setPin(newPin);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const enteredPin = pin.join('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/login', { phone, pin: enteredPin });
            const { token, userId } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            dispatch(setToken(token));
            toast.success('Login successful!');
            setTimeout(() => navigate('/crops'), 2000);
        } catch (error) {
            if(step == 2) {
                console.error('Error logging in:', error);
                toast.error('Invalid credentials. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (step === 2 && inputRefs.current[0]) {
            inputRefs.current[0].focus(); // Focus the first input element if it exists
        }
    }, [step]);


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

    const inputVariants = {
        focus: { scale: 1.05, boxShadow: "0px 0px 8px rgba(124, 58, 237, 0.5)", transition: { duration: 0.2 } },
        blur: { scale: 1, boxShadow: "none", transition: { duration: 0.2 } },
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white font-sans">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
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
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <motion.div
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 100 }}
                            >
                                <div className="mb-6 relative">
                                    <FiPhone className="absolute top-3 left-3 text-black" />
                                    <motion.input
                                        whileFocus="focus"
                                        animate="blur"
                                        variants={inputVariants}
                                        className="w-full pl-10 pr-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-300"
                                        id="phone"
                                        name="phone"
                                        type="text"
                                        placeholder="Enter your phone number"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        required
                                    />
                                </div>
                                <motion.button
                                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setStep(2)}
                                >
                                    Next <FiArrowRight className="ml-2" />
                                </motion.button>
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 100 }}
                            >
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pin">
                                        Enter 6-digit MPIN
                                    </label>
                                    <div className="flex justify-between items-center">
                                        <FiLock className="text-gray-400 mr-2" />
                                        {Array(6)
                                            .fill('')
                                            .map((_, index) => (
                                                <motion.input
                                                    key={index}
                                                    ref={(el) => (inputRefs.current[index] = el)} // Assign ref to the element
                                                    whileFocus="focus"
                                                    animate="blur"
                                                    variants={inputVariants}
                                                    className="w-10 h-12 text-center text-gray-700 border-b-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 text-xl transition duration-300"
                                                    type="password"
                                                    maxLength={1}
                                                    value={pin[index]}
                                                    onChange={(e) => handlePinChange(e, index)}
                                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                                />
                                            ))}

                                    </div>
                                </div>
                                <motion.button
                                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                    ) : (
                                        <>
                                            Login <FiArrowRight className="ml-2" />
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        )}
                    </form>
                    <motion.p
                        className="text-gray-600 text-center mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Don't have an account?{' '}
                        <motion.a
                            href="/signup"
                            className="text-violet-600 font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Sign Up
                        </motion.a>
                    </motion.p>
                </motion.div>
            </AnimatePresence>
            <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default Login;