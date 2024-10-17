import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CropRecommendationSystem = () => {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      setResult(response.data);
      setShowForm(false);
    } catch (error) {
      console.error('Error making prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationData = async () => {
    setLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      const weatherData = await fetchWeatherData(latitude, longitude);

      const { temp_c, humidity, precip_mm } = weatherData;

      setFormData(prevState => ({
        ...prevState,
        temperature: temp_c,
        humidity,
        N: 90,
        P: 42,
        K: 43,
        ph: 7.038096361,
        rainfall: precip_mm,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=8486f0f9386945cc97f154711241410&q=${latitude},${longitude}`);
    return response.data.current;
  };

  const nutrientChartData = {
    labels: ['Nitrogen', 'Phosphorus', 'Potassium'],
    datasets: [
      {
        data: [
          result?.cropInfo?.optimalConditions?.N || 0,
          result?.cropInfo?.optimalConditions?.P || 0,
          result?.cropInfo?.optimalConditions?.K || 0,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-blue-500 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute left-[300px] w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="rgba(255,255,255,0.1)" fillOpacity="1" d="M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div> */}
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl max-w-2xl w-full relative z-10"
          >
            <h1 className="text-4xl font-bold text-green-800 mb-6">Crop Recommendation System</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="relative">
                    <input
                      type="number"
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className="peer w-full px-3 py-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-green-600 placeholder-transparent"
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      required
                    />
                    <label
                      htmlFor={key}
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Getting Recommendation
                  </span>
                ) : (
                  'Get Recommendation'
                )}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl max-w-4xl w-full relative z-10"
          >
            <h2 className="text-4xl font-bold text-green-800 mb-6">Recommendation Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Recommended Crop</h3>
                <p className="text-3xl font-bold text-green-600">{result.recommendedCrop}</p>
                <div className="mt-8">
                  <h3 className="text-2xl font-semibold mb-4">Optimal Conditions</h3>
                  <ul className="space-y-2">
                    {Object.entries(result.cropInfo.optimalConditions).map(([key, value]) => (
                      <li key={key} className="flex items-center">
                        <span className="font-semibold mr-2">{key}:</span>
                        <span>{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Nutrient Balance</h3>
                <div className="w-full h-64">
                  <Doughnut data={nutrientChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4">Best Practices</h3>
              <ul className="list-disc list-inside space-y-2">
                {result.cropInfo.bestPractices.map((practice, index) => (
                  <li key={index}>{practice}</li>
                ))}
              </ul>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="mt-8 bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              Back to Form
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* <div className="absolute bottom-0 left-[300px] w-full overflow-hidden">
        <svg className="relative block w-full h-[150px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-green-600 opacity-25"></path>
        </svg>
      </div> */}
    </div>
  );
};

export default CropRecommendationSystem;