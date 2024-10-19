import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, Building, ShoppingCart, Sprout, Maximize } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const MarketPrediction = () => {
    const location = useLocation();
    const inputData = location.state || '';
    const [marketData, setMarketData] = useState({
        State: "Andhra Pradesh",
        District: "Chittoor",
        Market: "Chittoor Market",
        Crop: "Paddy",
        area: 1,
        Date_of_Sale: "",
        Sale_Year: 0,
        Sale_Month: 0,
        Sale_Day: 0,
        prediction: [0]
    });

    const [cropDetails, setCropDetails] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedMarket, setSelectedMarket] = useState(marketData.Market);
    const [saleDate, setSaleDate] = useState('');
    const [showMarketInfo, setShowMarketInfo] = useState(false);

    const getCropDetails = async () => {
        try {
            const cropData = await axios.get(`http://localhost:5000/crops/${inputData.crop}`);
            setCropDetails(cropData.data);
        } catch (error) {
            console.error('Error fetching crop details:', error);
            setError('Failed to fetch crop details.');
        }
    };

    useEffect(() => {
        getCropDetails();
    }, []);

    const markets = ['Anantapur Market', 'Eluru Market', 'Guntur Market', 'Kadapa Market', 'Kurnool Market', 'Rajahmundry Market', 'Chittoor Market', 'Vijayawada Market'];

    const handleMarketChange = (e) => {
        const selected = e.target.value;
        setSelectedMarket(selected);
        setMarketData((prev) => ({ ...prev, Market: selected }));
    };

    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        setSaleDate(e.target.value);
        setMarketData((prev) => ({
            ...prev,
            Date_of_Sale: e.target.value,
            Sale_Year: selectedDate.getFullYear(),
            Sale_Month: selectedDate.getMonth() + 1,
            Sale_Day: selectedDate.getDate()
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedMarketData = {
            ...marketData,
            Crop: cropDetails.type,
            area: inputData.area
        };

        console.log(updatedMarketData)

        try {
            const response = await axios.post('http://127.0.0.1:5000/market-predict', updatedMarketData);
            setMarketData((prev) => ({
                ...prev,
                prediction: response.data.prediction
            }));
            setShowMarketInfo(true);
        } catch (error) {
            console.error('Error fetching market prediction:', error);
            setError('Failed to fetch market prediction.');
        }
    };

    const chartData = [
        { name: 'Jan', value: 2000 },
        { name: 'Feb', value: 2200 },
        { name: 'Mar', value: 2100 },
        { name: 'Apr', value: 2400 },
        { name: 'May', value: 2300 },
        { name: 'Jun', value: 2500 },
        { name: 'Jul', value: 2700 },
        { name: 'Aug', value: 2600 },
        { name: 'Sep', value: 2800 },
        { name: 'Oct', value: marketData.prediction[0] }  // Displaying the predicted value
    ];

    return (
        <div className="p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen pb-20">
            <motion.h1 className="text-3xl font-bold text-center mb-8 text-green-800">Crop Market Dashboard</motion.h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-green-700">Market Selection</h2>
                    <label className="block mb-4">
                        <span className="text-gray-700">Select Market</span>
                        <select value={selectedMarket} onChange={handleMarketChange} className="block w-full mt-1 p-2 border border-gray-300 rounded-lg">
                            {markets.map((market) => (
                                <option key={market} value={market}>{market}</option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="text-gray-700">Sale Date</span>
                        <input type="date" value={saleDate} onChange={handleDateChange} className="block w-full mt-1 p-2 border border-gray-300 rounded-lg" />
                    </label>

                    <button type="submit" className="w-full mt-4 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">Submit</button>
                </motion.div>

                <AnimatePresence>
                    {showMarketInfo && (
                        <motion.div
                            className="bg-white rounded-lg shadow-lg p-6 overflow-hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.h2
                                className="text-xl font-semibold mb-4 text-green-700"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                Market Information
                            </motion.h2>
                            <InfoItem icon={<MapPin size={20} />} label="State" value={marketData.State} />
                            <InfoItem icon={<Building size={20} />} label="District" value={marketData.District} />
                            <InfoItem icon={<ShoppingCart size={20} />} label="Market" value={marketData.Market} />
                            <InfoItem icon={<Sprout size={20} />} label="Crop" value={marketData.Crop} />
                            <InfoItem icon={<Maximize size={20} />} label="Area" value={`${marketData.area} hectare`} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>

            {/* Chart for prediction */}
            {showMarketInfo && (
                <motion.div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-green-700">Price Prediction</h2>
                    <div className="h-64 w-full">
                        <ResponsiveContainer>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#4CAF50" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <motion.div 
        className="flex items-center mb-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
    >
        <motion.div 
            className="mr-3 text-green-600"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.3 }}
        >
            {icon}
        </motion.div>
        <div>
            <span className="font-medium text-gray-700">{label}:</span>
            <motion.span 
                className="ml-2 text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                {value}
            </motion.span>
        </div>
    </motion.div>
);

export default MarketPrediction;
