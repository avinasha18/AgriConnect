// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const CropRecommendationSystem = () => {
//   const [formData, setFormData] = useState({
//     N: '',
//     P: '',
//     K: '',
//     temperature: '',
//     humidity: '',
//     ph: '',
//     rainfall: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [recommendedCrops, setRecommendedCrops] = useState([]);
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post('http://127.0.0.1:5000/predict', formData);
//       console.log(response.data.cropInfos);
//       setRecommendedCrops(response.data.cropInfos); // Ensure this is set correctly
//     } catch (error) {
//       console.error('Error making prediction:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLocationData = async () => {
//     setLoading(true);
//     try {
//       const position = await new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(resolve, reject);
//       });
//       const { latitude, longitude } = position.coords;
//       const weatherData = await fetchWeatherData(latitude, longitude);
//       const { temp_c, humidity, precip_mm } = weatherData;

//       setFormData(prevState => ({
//         ...prevState,
//         temperature: temp_c,
//         humidity,
//         N: 90,
//         P: 42,
//         K: 43,
//         ph: 7.038096361,
//         rainfall: precip_mm,
//       }));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchWeatherData = async (latitude, longitude) => {
//     const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${latitude},${longitude}`);
//     return response.data.current;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-green-400 to-blue-500 flex flex-col items-center justify-center p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white bg-opacity-90 p-8 rounded-xl shadow-2xl max-w-4xl w-full"
//       >
//         <h1 className="text-4xl font-bold text-green-800 mb-6">Crop Recommendation System</h1>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-2 gap-4">
//             {Object.entries(formData).map(([key, value]) => (
//               <div key={key} className="relative">
//                 <input
//                   type="number"
//                   id={key}
//                   name={key}
//                   value={value}
//                   onChange={handleInputChange}
//                   className="peer w-full px-3 py-2 border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-green-600 placeholder-transparent"
//                   placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
//                   required
//                 />
//                 <label
//                   htmlFor={key}
//                   className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
//                 >
//                   {key.charAt(0).toUpperCase() + key.slice(1)}
//                 </label>
//               </div>
//             ))}
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="button"
//             onClick={fetchLocationData}
//             className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out mb-4"
//             disabled={loading}
//           >
//             {loading ? 'Fetching Location Data...' : 'Use Current Location'}
//           </motion.button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="submit"
//             className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out"
//             disabled={loading}
//           >
//             {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
//           </motion.button>
//         </form>
//       </motion.div>

//       {recommendedCrops.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
//         >
//           {recommendedCrops.map((crop, index) => (
//             <motion.div
//               key={index}
//               whileHover={{ scale: 1.05 }}
//               className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
//               onClick={() => navigate(`/crop/${crop.cropName.toLowerCase()}`, { state: { crop }})} // Ensure the crop name is formatted correctly
//             >
//               <img src={crop.imageUrl} alt={crop.cropName} className="w-full h-48 object-cover" />
//               <div className="p-4">
//                 <h3 className="text-xl font-semibold mb-2">{crop.cropName}</h3>
//                 <p className="text-gray-600">{crop.description}</p>
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default CropRecommendationSystem;
