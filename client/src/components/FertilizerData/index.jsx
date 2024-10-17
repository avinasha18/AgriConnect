import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const FertilizerData = () => {
  const [inputData, setInputData] = useState({
    Moisture: 45,
    'Soil Type': 'Loamy',
    'Crop Type': 'Sugarcane',
    Nitrogen: 12,
    Potassium: 0,
    Phosphorous: 36
  });

  const [fertilizerInfo, setFertilizerInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFertilizerData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/fertilizer-predict', inputData);
      console.log(response.data)
      setFertilizerInfo(response.data);
    } catch (err) {
      setError('Failed to fetch fertilizer data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const capitalize = (str) => {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  };

  useEffect(() => {
    fetchFertilizerData();
  }, []); // Fetch data when the component mounts

  return (
    <div className="flex flex-col items-center p-4">
      {loading && <p className="text-lg text-gray-700">Loading...</p>}
      {fertilizerInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full bg-white rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Recommended Fertilizer</h2>
          <div className="w-full my-16">
            <div className='flex flex-col w-full items-center mb-10'>
              <p className="text-gray-700 font-bold text-4xl">{fertilizerInfo.prediction_response.fertilizer.name}</p>
              <p className="text-gray-700 p-8 text-lg">{fertilizerInfo.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className='bg-white shadow-md p-4 rounded-xl'>
                <p className='text-xl font-bold mt-5 text-green-500'>Chemical Formula</p>
                <p className='text-3xl font-medium ml-32'>{fertilizerInfo.prediction_response.fertilizer.chemical_formula}</p>
              </div>

              <div className='bg-white shadow-md p-4 rounded-xl'>
                <p className='text-xl font-bold mt-5 text-green-500'>Nitrogen Percentage</p>
                <p className='text-3xl font-medium ml-60'>{fertilizerInfo.prediction_response.fertilizer.nitrogen_content}</p>
              </div>

              <div className='bg-white shadow-md py-10 px-4 rounded-xl'>
                <p className='text-xl font-bold text-green-500'>Recommended:</p>
                <p className='text-2xl font-medium ml-32'>{fertilizerInfo.prediction_response.fertilizer.application_rate.recommended_rate}</p>
              </div>

              <div className='bg-white shadow-md p-4 rounded-xl'>
                <h4 className="text-xl font-bold text-green-500 mt-4 mb-2">Storage Conditions:</h4>
                <div className='p-2'>
                  <p className="text-gray-700"><strong>Conditions:</strong> {capitalize(fertilizerInfo.prediction_response.fertilizer.storage.conditions)}</p>
                  <p className="text-gray-700"><strong>Avoid Contact:</strong> {capitalize(fertilizerInfo.prediction_response.fertilizer.storage.avoid_contact)}</p>
                </div>
              </div>

              <div className='bg-white shadow-md p-4 rounded-xl'>
                <h4 className="text-xl font-bold text-green-500 mt-4 mb-2">Safety Precautions:</h4>
                <div className='p-2'>
                  <p className="text-gray-700"><strong>Handling Precautions:</strong> {fertilizerInfo.prediction_response.fertilizer.safety.handling_precautions}</p>
                  <p className="text-gray-700"><strong>First Aid:</strong> {fertilizerInfo.prediction_response.fertilizer.safety.first_aid}</p>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      )}
    </div>
  );
};

export default FertilizerData;
