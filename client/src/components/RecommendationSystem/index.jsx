import React, { useState } from 'react';
import {  UilSpinnerAlt, UilCheckCircle, UilWater, UilBrightnessLow } from '@iconscout/react-unicons';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CropRecommendationSystem = () => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

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
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setResult({
      recommendedCrop: 'Rice',
      soilHealth: 'Good',
      nutrientBalance: {
        nitrogen: 40,
        phosphorus: 30,
        potassium: 30,
      },
      waterRequirement: 'High',
      climateCondition: 'Suitable',
      additionalRecommendations: [
        'Consider using organic fertilizers to improve soil health',
        'Implement proper irrigation techniques to conserve water',
        'Monitor pH levels regularly and adjust if necessary',
      ],
    });
  };

  const nutrientChartData = {
    labels: ['Nitrogen', 'Phosphorus', 'Potassium'],
    datasets: [
      {
        data: [
          result?.nutrientBalance.nitrogen || 0,
          result?.nutrientBalance.phosphorus || 0,
          result?.nutrientBalance.potassium || 0,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="min-h-screen flex items-center bg-gradient-to-br from-green-100 via-yellow-50 to-green-100 p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto  rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Crop Recommendation System</h1>
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

          {result && (
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
                  <p className="text-xl font-semibold text-blue-600">{result.soilHealth}</p>
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
                    {result.waterRequirement}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-700">Climate Condition</h3>
                  <p className="text-xl font-semibold text-blue-600 flex items-center">
                    <UilBrightnessLow className="mr-2" />
                    {result.climateCondition}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2 text-gray-700">Additional Recommendations</h3>
                <ul className="space-y-2">
                  {result.additionalRecommendations.map((recommendation, index) => (
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