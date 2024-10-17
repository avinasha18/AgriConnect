import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const FertilizerData = () => {
  const location = useLocation();
  const { id } = location.state || {}; // Get the crop ID from route state

  const [inputData, setInputData] = useState({
    Moisture: 0,
    'Soil Type': '',
    'Crop Type': '',
    Nitrogen: 0,
    Potassium: 0,
    Phosphorous: 0,
  });

  const [fertilizerInfo, setFertilizerInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch the crop details based on the crop ID
  const fetchCropDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/crops/${id}`);
      const cropData = response.data;

      // Map the crop data to the inputData state
      setInputData({
        Moisture: cropData.moistPercent || 0,
        'Soil Type': cropData.soilType || '',
        'Crop Type': cropData.type || '',
        Nitrogen: cropData.N || 0,
        Potassium: cropData.K || 0,
        Phosphorous: cropData.P || 0,
      });

      console.log('Crop data:', cropData);
    } catch (err) {
      setError('Failed to fetch crop details.');
      console.error(err);
    }
  };

  // Function to fetch fertilizer data based on the inputData
  const fetchFertilizerData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/fertilizer-predict', inputData);
      setFertilizerInfo(response.data);
      console.log('Fertilizer data:', response.data);
    } catch (err) {
      setError('Failed to fetch fertilizer data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch crop details and then fertilizer data
    if (id) {
      fetchCropDetails().then(() => fetchFertilizerData());
    }
  }, [id]); // Ensure the effect runs when the crop ID changes

  // Capitalize helper function
  const capitalize = (str) => {
    return str.replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="flex flex-col items-center p-4">
      {loading && <p className="text-lg text-gray-700">Loading...</p>}
      {fertilizerInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full bg-white rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4">Recommended Fertilizer</h2>
          <div className="w-full my-16">
            <div className="flex flex-col w-full items-center mb-10">
              <p className="text-gray-700 font-bold text-4xl">{fertilizerInfo.prediction_response.fertilizer.name}</p>
              <p className="text-gray-700 p-8 text-lg">{fertilizerInfo.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white shadow-md p-4 rounded-xl">
                <p className="text-xl font-bold mt-5 text-green-500">Chemical Formula</p>
                <p className="text-3xl font-medium ml-32">{fertilizerInfo.prediction_response.fertilizer.chemical_formula}</p>
              </div>

              <div className="bg-white shadow-md p-4 rounded-xl">
                <p className="text-xl font-bold mt-5 text-green-500">Nitrogen Percentage</p>
                <p className="text-3xl font-medium ml-60">{fertilizerInfo.prediction_response.fertilizer.nitrogen_content}</p>
              </div>

              <div className="bg-white shadow-md py-10 px-4 rounded-xl">
                <p className="text-xl font-bold text-green-500">Recommended:</p>
                <p className="text-2xl font-medium ml-32">{fertilizerInfo.prediction_response.fertilizer.application_rate.recommended_rate}</p>
              </div>

              <div className="bg-white shadow-md p-4 rounded-xl">
                <h4 className="text-xl font-bold text-green-500 mt-4 mb-2">Storage Conditions:</h4>
                <div className="p-2">
                  <p className="text-gray-700">
                    <strong>Conditions:</strong> {capitalize(fertilizerInfo.prediction_response.fertilizer.storage.conditions)}
                  </p>
                  <p className="text-gray-700">
                    <strong>Avoid Contact:</strong> {capitalize(fertilizerInfo.prediction_response.fertilizer.storage.avoid_contact)}
                  </p>
                </div>
              </div>

              <div className="bg-white shadow-md p-4 rounded-xl">
                <h4 className="text-xl font-bold text-green-500 mt-4 mb-2">Safety Precautions:</h4>
                <div className="p-2">
                  <p className="text-gray-700">
                    <strong>Handling Precautions:</strong> {fertilizerInfo.prediction_response.fertilizer.safety.handling_precautions}
                  </p>
                  <p className="text-gray-700">
                    <strong>First Aid:</strong> {fertilizerInfo.prediction_response.fertilizer.safety.first_aid}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default FertilizerData;
