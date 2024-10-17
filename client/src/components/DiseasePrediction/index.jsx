import React, { useState } from 'react';
import { UilUpload, UilSpinnerAlt, UilCheckCircle, UilExclamationCircle } from '@iconscout/react-unicons';
import { motion } from 'framer-motion';
import Stepper from './Stepper';
import cropImage from '../../assets/crop2.jpg';
import axios from 'axios';

const CropDiseaseDetection = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Instructions',
    'Upload Image',
    'Results'
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data)
      setResult(response.data);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error predicting disease:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div
      className="flex h-full min-h-screen justify-center items-center overflow-y-auto bg-[#7cd77c] p-8"
      style={{
        backgroundImage: `url(${cropImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden bg-slate-50 text-black"
      >
        <div className="p-8 ">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Crop Disease Detection</h1>
          <Stepper steps={steps} currentStep={currentStep} />

          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Instructions</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium mb-2 text-gray-700">Do's</h3>
                  <ul className="list-disc pl-5">
                    <li>Take a clear picture of the plant.</li>
                    <li>Ensure the image is well-lit.</li>
                    <li>Include the entire plant in the frame.</li>
                  </ul>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-medium mb-2 text-gray-700">Don'ts</h3>
                  <ul className="list-disc pl-5">
                    <li>Avoid blurry images.</li>
                    <li>Do not include other objects in the frame.</li>
                    <li>Avoid taking pictures in low light.</li>
                  </ul>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
              >
                Next
              </motion.button>
            </div>
          )}

          {currentStep === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300 ease-in-out">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UilUpload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
              {preview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <img src={preview} alt="Preview" className="max-w-full h-auto rounded-lg shadow-md" />
                </motion.div>
              )}
              <div className="flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={prevStep}
                  className="bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                  disabled={!file || loading}
                >
                  {loading ? (
                    <UilSpinnerAlt className="animate-spin h-5 w-5 mr-3 inline-block" />
                  ) : (
                    'Analyze Crop'
                  )}
                </motion.button>
              </div>
            </form>
          )}

          {currentStep === 2 && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Analysis Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-700">Disease Information</h3>
                  <p><span className="font-semibold">Disease:</span> {result.diseaseName}</p>
                  <p><span className="font-semibold">Causes:</span> {result.causes}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-700">Symptoms</h3>
                  <p>{result.symptoms}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-700">Suggested Actions</h3>
                  <ul className="list-disc pl-5">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-700">Recommended Fertilizers</h3>
                  <ul className="list-disc pl-5">
                    {result.fertilizers.map((fertilizer, index) => (
                      <li key={index}>{fertilizer}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevStep}
                className="mt-6 w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
              >
                Back
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CropDiseaseDetection;
