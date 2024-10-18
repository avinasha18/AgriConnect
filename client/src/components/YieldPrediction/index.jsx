import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to import axios
import { useNavigate } from "react-router-dom"
import { FaRegSnowflake, FaCloudSunRain } from "react-icons/fa";
import { IoMdSunny } from "react-icons/io";
import { GrValidate } from "react-icons/gr";
import { BiLogoSpringBoot } from "react-icons/bi";
import Lottie from 'react-lottie';
import analysisAnimation from './AI.json';

const YieldPrediction = () => {
  const [error, setError] = useState(null);
  const [farmer, setFarmer] = useState(null); // State to hold farmer profile
  const navigate = useNavigate();

  const farmerID = localStorage.getItem('userId');

  const capitalize = (str) => {
    return str.replace(/\b\w/g, (l) => l.toUpperCase());
  };

  useEffect(() => {
    const fetchFarmerProfile = async () => {
      if (farmerID) { // Check if farmerID is valid
        try {
          const response = await axios.get(`http://localhost:5000/farmers/profile/${farmerID}`);
          setFarmer(response.data);
        } catch (error) {
          console.error(error);
          setError('Failed to fetch farmer profile.'); // Handle errors for farmer profile fetching
        }
      } else {
        setError('No farmer ID found in local storage.');
      }
    };

    fetchFarmerProfile();
  }, [farmerID]);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setError(null);

            // Fetch weather data using the retrieved location
            try {
              const data = await fetchWeatherData(latitude, longitude);
              console.log(data.current)
              resolve({ region: data.location.region, weatherData: data.current });   // Resolve with both region and weather data
            } catch (error) {
              setError('Failed to fetch weather data.');
              reject(error);  // Reject on error
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



  const fetchWeatherData = async (latitude, longitude) => {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=8486f0f9386945cc97f154711241410&q=${latitude},${longitude}`
    );
    return response.data;
  };

  const cropCard = async (id) => {
    try {
      const { region, weatherData } = await getLocation();  // Get both region and weather data
      goToPredictPage(id, region, weatherData);             // Pass both region and weather data
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">

      <h1 className='flex-start w-full px-20 py-10 tracking-wider font-extrabold text-3xl'>Yield Prediction</h1>
      {farmer && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {farmer.crops.map((crop, index) => (
            <div key={index} className="bg-white border rounded-3xl w-[22rem] shadow p-7 cursor-pointer"
              onClick={() => { cropCard(crop._id) }}
            >
              <div className='flex flex-row items-center justify-between mb-8'>
                <h3 className="font-extrabold text-4xl text-green-500">{crop.type}</h3>
                <WeatherIcon season={crop.season} /> {/* Pass season as a prop */}
              </div>
              <div className='flex flex-col gap-2'>
                <p><strong>Average Yield:</strong> {crop.averageYield} kg/ha</p>
                <p><strong>Soil Type:</strong> {crop.soilType}</p>
                <p><strong>Status:</strong> {capitalize(crop.status)}</p>
                <p className='text-xl font-semibold'>{new Date(crop.expectedHarvestDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const WeatherIcon = ({ season }) => {  // Destructure the season prop here
  switch (season) {
    case 'Kharif':
      return <FaCloudSunRain />;
    case 'Rabi':
      return <FaRegSnowflake />;
    case 'Autumn':
      return <BiLogoSpringBoot />;
    case 'Summer':
      return <IoMdSunny />;
    case 'Winter':
      return <FaRegSnowflake className='text-3xl text-blue-400 brightness-125 ' />;
    case 'Whole Year':
      return <GrValidate />;
    default:
      return null;
  }
};

export default YieldPrediction;
