import React, { useState, useEffect } from 'react';
import { UilSpinnerAlt, UilCheckCircle, UilWater, UilBrightnessLow } from '@iconscout/react-unicons';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const CropRecommendationSystem = () => {
  const [formData, setFormData] = useState({
    N: '', // Default value for Bhimavaram
    P: '', // Default value for Bhimavaram
    K: '', // Default value for Bhimavaram
    temperature: '',
    humidity: '',
    ph: '', // Default pH value
    rainfall: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('form');

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
      setActiveTab('result');
    } catch (error) {
      console.error('Error making prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=8486f0f9386945cc97f154711241410&q=${latitude},${longitude}`);
    console.log(response.data);
    return response.data.current;
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
      console.log(temp_c, humidity, precip_mm);

      setFormData(prevState => ({
        ...prevState,
        temperature: temp_c,
        humidity,
        N: 20,
        P: 15,
        K: 10,
        ph: 7, // Default pH value
        rainfall: precip_mm,
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const nutrientChartData = {
    labels: ['Nitrogen', 'Phosphorus', 'Potassium'],
    datasets: [
      {
        data: [
          result?.nutrientBalance?.nitrogen || 0,
          result?.nutrientBalance?.phosphorus || 0,
          result?.nutrientBalance?.potassium || 0,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="flex min-h-screen w-full justify-center items-center bg-[#7cd77c] p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Crop Recommendation System</h1>
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'form' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Input Data
            </button>
            <button
              onClick={() => setActiveTab('result')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'result' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Recommendation Results
            </button>
          </div>
          {activeTab === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="nitrogen" className="block text-sm font-medium text-gray-700 mb-1">Nitrogen (N)</label>
                  <input
                    type="number"
                    id="nitrogen"
                    name="nitrogen"
                    value={formData.nitrogen}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phosphorus" className="block text-sm font-medium text-gray-700 mb-1">Phosphorus (P)</label>
                  <input
                    type="number"
                    id="phosphorus"
                    name="phosphorus"
                    value={formData.phosphorus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="potassium" className="block text-sm font-medium text-gray-700 mb-1">Potassium (K)</label>
                  <input
                    type="number"
                    id="potassium"
                    name="potassium"
                    value={formData.potassium}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                  <input
                    type="number"
                    id="temperature"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="humidity" className="block text-sm font-medium text-gray-700 mb-1">Humidity (%)</label>
                  <input
                    type="number"
                    id="humidity"
                    name="humidity"
                    value={formData.humidity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="ph" className="block text-sm font-medium text-gray-700 mb-1">pH</label>
                  <input
                    type="number"
                    id="ph"
                    name="ph"
                    value={formData.ph}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rainfall" className="block text-sm font-medium text-gray-700 mb-1">Rainfall (mm)</label>
                  <input
                    type="number"
                    id="rainfall"
                    name="rainfall"
                    value={formData.rainfall}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={fetchLocationData}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out mb-4"
                disabled={loading}
              >
                {loading ? (
                  <UilSpinnerAlt className="animate-spin h-5 w-5 mr-3 inline-block" />
                ) : (
                  'Fetch Data Based on Location'
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                disabled={loading}
              >
                {loading ? (
                  <UilSpinnerAlt className="animate-spin h-5 w-5 mr-3 inline-block" />
                ) : (
                  'Get Recommendation'
                )}
              </motion.button>
            </form>
          )}
          {activeTab === 'result' && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recommendation Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-700">Recommended Crop</h3>
                  <p className="text-3xl font-bold text-green-600 flex items-center">
                    <UilSpinnerAlt className="mr-2" />
                    {result.recommendedCrop}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-700">Soil Health</h3>
                  <p className="text-xl font-semibold text-blue-600">Good</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-700">Nutrient Balance</h3>
                  <div className="w-48 h-48 mx-auto">
                    <Doughnut data={nutrientChartData} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-700">Water Requirement</h3>
                  <p className="text-xl font-semibold text-blue-600 flex items-center">
                    <UilWater className="mr-2" />
                    High
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-700">Climate Condition</h3>
                  <p className="text-xl font-semibold text-blue-600 flex items-center">
                    <UilBrightnessLow className="mr-2" />
                    Suitable
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2 text-gray-700">Additional Recommendations</h3>
                <ul className="space-y-2">
                  {[
                    'Consider using organic fertilizers to improve soil health',
                    'Implement proper irrigation techniques to conserve water',
                    'Monitor pH levels regularly and adjust if necessary',
                  ].map((recommendation, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="flex items-start"
                    >
                      <UilCheckCircle className="flex-shrink-0 w-5 h-5 text-green-500 mt-1 mr-2" />
                      <span>{recommendation}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CropRecommendationSystem;
