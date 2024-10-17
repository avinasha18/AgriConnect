import React, { useState } from 'react';
import { UilChartLine, UilSpinnerAlt, UilCheckCircle } from '@iconscout/react-unicons';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from './../../hooks/languageContext';

const CropYieldPrediction = () => {
  const [formData, setFormData] = useState({
    cropType: '',
    area: '',
    soilType: '',
    fertilizer: '',
    rainfall: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { language } = useLanguage();

  const texts = {
    en: {
      title: 'Crop Yield Prediction',
      cropType: 'Crop Type',
      area: 'Area (in hectares)',
      soilType: 'Soil Type',
      fertilizer: 'Fertilizer Used',
      rainfall: 'Average Rainfall (mm)',
      predictYield: 'Predict Yield',
      predictionResults: 'Prediction Results',
      predictedYield: 'Predicted Yield',
      profitability: 'Profitability',
      yieldTrend: 'Yield Trend',
      recommendations: 'Recommendations',
    },
    hi: {
      title: 'फसल उत्पादन भविष्यवाणी',
      cropType: 'फसल का प्रकार',
      area: 'क्षेत्र (हेक्टेयर में)',
      soilType: 'मिट्टी का प्रकार',
      fertilizer: 'उपयोग किया गया उर्वरक',
      rainfall: 'औसत वर्षा (मिमी)',
      predictYield: 'उत्पादन भविष्यवाणी करें',
      predictionResults: 'भविष्यवाणी परिणाम',
      predictedYield: 'भविष्यवाणी उत्पादन',
      profitability: 'लाभदायकता',
      yieldTrend: 'उत्पादन रुझान',
      recommendations: 'सिफारिशें',
    },
    te: {
      title: 'పంట ఉత్పత్తి పూర్వాంజ్ఞానం',
      cropType: 'పంట రకం',
      area: 'ప్రాంతం (హెక్టార్లలో)',
      soilType: 'మట్టి రకం',
      fertilizer: 'ఉపయోగించిన ఎరువు',
      rainfall: 'సగటు వర్షపాతం (మి.మీ)',
      predictYield: 'ఉత్పత్తి పూర్వాంజ్ఞానం',
      predictionResults: 'పూర్వాంజ్ఞానం ఫలితాలు',
      predictedYield: 'పూర్వాంజ్ఞానం ఉత్పత్తి',
      profitability: 'లాభాలు',
      yieldTrend: 'ఉత్పత్తి ప్రవణత',
      recommendations: 'సిఫార్సులు',
    },
  };

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
      predictedYield: 4500,
      yieldTrend: [
        { month: 'Jan', yield: 3800 },
        { month: 'Feb', yield: 4000 },
        { month: 'Mar', yield: 4200 },
        { month: 'Apr', yield: 4500 },
        { month: 'May', yield: 4700 },
        { month: 'Jun', yield: 4500 },
      ],
      profitability: 'High',
      recommendations: [
        'Consider increasing fertilizer application by 10%',
        'Monitor rainfall closely and adjust irrigation accordingly',
        'Implement crop rotation to improve soil health',
      ],
    });
  };

  return (
    <div className="flex min-h-screen bg-white items-center p-8 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto  rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-8 bg-gradient-to-br from-green-100 via-yellow-50 to-green-100 ">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{texts[language].title}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-1">{texts[language].cropType}</label>
                <select
                  id="cropType"
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">{texts[language].cropType}</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="corn">Corn</option>
                  <option value="soybean">Soybean</option>
                </select>
              </div>
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">{texts[language].area}</label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="soilType" className="block text-sm font-medium text-gray-700 mb-1">{texts[language].soilType}</label>
                <select
                  id="soilType"
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">{texts[language].soilType}</option>
                  <option value="loamy">Loamy</option>
                  <option value="sandy">Sandy</option>
                  <option value="clay">Clay</option>
                  <option value="silt">Silt</option>
                </select>
              </div>
              <div>
                <label htmlFor="fertilizer" className="block text-sm font-medium text-gray-700 mb-1">{texts[language].fertilizer}</label>
                <input
                  type="text"
                  id="fertilizer"
                  name="fertilizer"
                  value={formData.fertilizer}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="rainfall" className="block text-sm font-medium text-gray-700 mb-1">{texts[language].rainfall}</label>
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
                texts[language].predictYield
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
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">{texts[language].predictionResults}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-700">{texts[language].predictedYield}</h3>
                  <p className="text-3xl font-bold text-green-600">{result.predictedYield} kg/ha</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-700">{texts[language].profitability}</h3>
                  <p className="text-xl font-semibold text-blue-600">{result.profitability}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2 text-gray-700">{texts[language].yieldTrend}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={result.yieldTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="yield" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2 text-gray-700">{texts[language].recommendations}</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((recommendation, index) => (
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

export default CropYieldPrediction;
