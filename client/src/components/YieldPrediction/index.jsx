import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Progress } from "./Progress";
import { Badge } from "./Badge";
import { Droplet, Thermometer, Cloud, Calendar } from 'lucide-react';

const YieldPrediction = () => {
  const [crops, setCrops] = useState([]);
  const [farmer, setFarmer] = useState(null);
  const [error, setError] = useState(null);
  const farmerID = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmerProfile = async () => {
        if (farmerID) {
            try {
                const response = await axios.get(`http://localhost:5000/farmers/profile/${farmerID}`);
                setCrops(response.data.crops)
                setFarmer(response.data);
            } catch (error) {
                console.error(error);
                setError('Failed to fetch farmer profile.');
            }
        } else {
            setError('No farmer ID found in local storage.');
        }
    };

    fetchFarmerProfile();
}, [farmerID, crops]);

  const calculateProgress = (currentYield, averageYield) => {
    return (currentYield / averageYield) * 100;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setError(null);
            try {
              const data = await fetchWeatherData(latitude, longitude);
              resolve({ region: data.location.region, weatherData: data.current });
            } catch (error) {
              setError('Failed to fetch weather data.');
              reject(error);
            }
          },
          (err) => {
            setError('Unable to retrieve your location.');
            reject(err);
          }
        );
      } else {
        setError('Geolocation is not supported by your browser.');
        reject(new Error('Geolocation not supported.'));
      }
    });
  };

  const fetchWeatherData = async (latitude, longitude) => {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=8486f0f9386945cc97f154711241410&q=${latitude},${longitude}`
    );
    return response.data;
  };

  const goToPredictPage = (id, region, weatherData) => {
    navigate('/yield-predict/', {
      state: {
        crop: id,
        location: region,
        weatherData: weatherData,
        farmSize: (farmer.farmSize * 0.404686)
      }
    });
  };

  const cropCard = async (id) => {
    try {
      const { region, weatherData } = await getLocation();
      goToPredictPage(id, region, weatherData);
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen"
    >
      <motion.h1
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className='w-full px-20 py-10 kanit-regular text-4xl text-green-700 text-center'
      >
        Yield Prediction
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-10">
        {crops.map((crop, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden cursor-pointer"
            onClick={()=>{cropCard(crop._id)}}>
              <CardHeader className="bg-green-100 flex flex-row justify-between">
                <CardTitle className="text-2xl font-bold text-green-800">{crop.type}</CardTitle>
                <Badge variant="outline" className="bg-green-200 text-green-800">
                  {crop.season}
                </Badge>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Yield Progress</span>
                      <span className="text-sm font-medium">{crop.currentYield}/{crop.averageYield} kg/ha</span>
                    </div>
                    <Progress value={calculateProgress(crop.currentYield, crop.averageYield)} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Droplet className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-sm">Humidity: {crop.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <Thermometer className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-sm">Temp: {crop.temperature}°C</span>
                    </div>
                    <div className="flex items-center">
                      <Cloud className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-sm">Rainfall: {crop.rainfall} mm</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-purple-600 mr-2">pH</span>
                      <span className="text-sm">{crop.ph}</span>
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-sm font-medium">Planted:</span>
                      </div>
                      <span className="text-sm">{formatDate(crop.plantingDate)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-orange-600 mr-2" />
                        <span className="text-sm font-medium">Expected Harvest:</span>
                      </div>
                      <span className="text-sm">{formatDate(crop.expectedHarvestDate)}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline" className={`${crop.status === 'cultivating' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default YieldPrediction;
