import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// 3D Crop Model
const CropModel = ({ cropType }) => {
  const [rotation, setRotation] = useState([0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => [prev[0], prev[1] + 0.01, prev[2]]);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <mesh rotation={rotation}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={cropType === 'fruit' ? 'red' : 'green'} />
    </mesh>
  );
};

const MyCrops = () => {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [isEditingCrop, setIsEditingCrop] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    plantingDate: '',
    expectedHarvestDate: '',
    season: '',
    averageYield: '',
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
    image: null,
  });

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await axios.get('http://localhost:5000/crops');
      setCrops(response.data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach(key => formDataToSubmit.append(key, formData[key]));

      if (isEditingCrop) {
        await axios.put(`http://localhost:5000/crops/${selectedCrop._id}`, formDataToSubmit);
      } else {
        await axios.post('http://localhost:5000/crops', formDataToSubmit);
      }
      fetchCrops();
      setIsAddingCrop(false);
      setIsEditingCrop(false);
      setSelectedCrop(null);
    } catch (error) {
      console.error('Error saving crop:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/crops/${id}`);
      fetchCrops();
    } catch (error) {
      console.error('Error deleting crop:', error);
    }
  };

  const handleEdit = (crop) => {
    setSelectedCrop(crop);
    setFormData(crop);
    setIsEditingCrop(true);
  };

  const nutrientChartData = {
    labels: ['Nitrogen', 'Phosphorus', 'Potassium'],
    datasets: [
      {
        data: [formData.N, formData.P, formData.K],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const steps = ['General Info', 'Environmental Data', 'Nutrients & Image'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-blue-500 p-8">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-white mb-8 text-center"
      >
        My Crops
      </motion.h1>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsAddingCrop(true)}
        className="mb-8 bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out"
      >
        Add New Crop
      </motion.button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {crops && crops.map((crop) => (
            <motion.div
              key={crop._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{crop.name}</h2>
                <p className="text-gray-600 mb-4">Type: {crop.type}</p>
                <p className="text-gray-600 mb-4">Planting Date: {new Date(crop.plantingDate).toLocaleDateString()}</p>
                <p className="text-gray-600 mb-4">Expected Harvest: {new Date(crop.expectedHarvestDate).toLocaleDateString()}</p>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(crop)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(crop._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="h-64 bg-gray-100">
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                  <Suspense fallback={null}>
                    <CropModel cropType={crop.type} />
                  </Suspense>
                  <OrbitControls />
                </Canvas>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {(isAddingCrop || isEditingCrop) && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white p-8 rounded-xl shadow-2xl max-w-[900px] w-full"
            >
              <div className="mb-6">
                {steps.map((label, index) => (
                  <span
                    key={label}
                    className={`inline-block px-3 py-1 mr-2 rounded-full ${
                      index === step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {step === 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-green-600 outline-none"
                        placeholder="Crop Name"
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-green-600 outline-none"
                        placeholder="Crop Type"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="date"
                        id="plantingDate"
                        name="plantingDate"
                        value={formData.plantingDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-green-600 outline-none"
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        id="expectedHarvestDate"
                        placeholder='Expected harvest Date'
                        name="expectedHarvestDate"
                        value={formData.expectedHarvestDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-green-600 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      id="season"
                      name="season"
                      value={formData.season}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-green-600 outline-none"
                      placeholder="Season"
                      required
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="number"
                        id="temperature"
                        name="temperature"
                        value={formData.temperature}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-green-600 outline-none"
                        placeholder="Temperature (°C)"
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        id="humidity"
                        name="humidity"
                        value={formData.humidity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-green-600 outline-none"
                        placeholder="Humidity (%)"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="number"
                        id="ph"
                        name="ph"
                        value={formData.ph}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-green-600 outline-none"
                        placeholder="Soil pH"
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        id="rainfall"
                        name="rainfall"
                        value={formData.rainfall}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-green-600 outline-none"
                        placeholder="Rainfall (mm)"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      id="averageYield"
                      name="averageYield"
                      value={formData.averageYield}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-green-600 outline-none"
                      placeholder="Average Yield (kg/ha)"
                      required
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 h-[500px]">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="number"
                        id="N"
                        name="N"
                        value={formData.N}
                        onChange={handleInputChange}
                        className="peer w-full px-3 py-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-green-600 placeholder-transparent"
                        placeholder="Nitrogen (N)"
                        required
                      />
                      <label
                        htmlFor="N"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all"
                      >
                        Nitrogen (N)
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        id="P"
                        name="P"
                        value={formData.P}
                        onChange={handleInputChange}
                        className="peer w-full px-3 py-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-green-600 placeholder-transparent"
                        placeholder="Phosphorus (P)"
                        required
                      />
                      <label
                        htmlFor="P"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all"
                      >
                        Phosphorus (P)
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        id="K"
                        name="K"
                        value={formData.K}
                        onChange={handleInputChange}
                        className="peer w-full px-3 py-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-green-600 placeholder-transparent"
                        placeholder="Potassium (K)"
                        required
                      />
                      <label
                        htmlFor="K"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all"
                      >
                        Potassium (K)
                      </label>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleInputChange}
                      className="peer w-full px-3 py-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none placeholder-transparent"
                    />
                    <label
                      htmlFor="image"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all"
                    >
                      Upload Crop Image
                    </label>
                  </div>
                  <div style={{ height: '200px', width: '200px' }}>
                    <Doughnut data={nutrientChartData} />
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(prev => Math.max(prev - 1, 0))}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    if (step < steps.length - 1) {
                      setStep(prev => prev + 1);
                    } else {
                      handleSubmit(e);
                    }
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                >
                  {step < steps.length - 1 ? 'Next' : 'Submit'}
                </button>
              </div>

            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
};

export default MyCrops;
