import React, { useState } from 'react';
import { UilUpload, UilSpinnerAlt, UilCheckCircle, UilExclamationCircle } from '@iconscout/react-unicons';
import { motion } from 'framer-motion';

const CropDiseaseDetection = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setResult({
      plantName: "Tomato",
      disease: "Late Blight",
      causes: "Fungal infection caused by Phytophthora infestans",
      symptoms: "Dark brown spots on leaves, stems, and fruits",
      suggestions: [
        "Remove and destroy infected plant parts",
        "Apply fungicide as per expert recommendation",
        "Improve air circulation around plants"
      ],
      fertilizers: ["Copper-based fungicide", "Organic compost tea"]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br overflow-y-auto from-green-100 via-yellow-50 to-green-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Crop Disease Detection</h1>
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
              disabled={!file || loading}
            >
              {loading ? (
                <UilSpinnerAlt className="animate-spin h-5 w-5 mr-3 inline-block" />
              ) : (
                'Analyze Crop'
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
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Analysis Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-700">Plant Information</h3>
                  <p><span className="font-semibold">Name:</span> {result.plantName}</p>
                  <p><span className="font-semibold">Disease:</span> {result.disease}</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-700">Causes</h3>
                  <p>{result.causes}</p>
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
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CropDiseaseDetection;