import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const FertilizerData = () => {

  const [loading, setLoading] = useState(false);

  const fetchLocationData = async () => {
    setLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      const weatherData = await fetchWeatherData(latitude, longitude);

      console.log(weatherData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=8486f0f9386945cc97f154711241410&q=${latitude},${longitude}`);
    return response;
  };
  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={fetchLocationData}
        className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out mb-4"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Fetching Location Data
          </span>
        ) : (
          'Use Current Location'
        )}
      </motion.button>
    </div>
  )
}

export default FertilizerData
