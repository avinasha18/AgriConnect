import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure to import axios

const YieldPrediction = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null); // State to hold weather data
  const [farmer, setFarmer] = useState(null); // State to hold farmer profile

  const farmerID = localStorage.getItem('userId');

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

  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords; // Destructure coords
          setLocation({ latitude, longitude });
          setError(null); // Clear any previous error

          // Fetch weather data using the retrieved location
          try {
            const data = await fetchWeatherData(latitude, longitude);
            setWeatherData(data); // Update weather data state
          } catch (error) {
            setError('Failed to fetch weather data.'); // Handle fetching errors
          }
        },
        (err) => {
          setError('Unable to retrieve your location.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=8486f0f9386945cc97f154711241410&q=${latitude},${longitude}`
    );
    console.log(response.data.location); // Keep this for debugging
    return response.data.current;
  };

  return (
    <div className="flex flex-col items-center p-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={getLocation}
      >
        Get Current Location
      </button>

      {location.latitude && location.longitude ? (
        <div className="mt-4 text-center">
          <p className="text-lg font-medium">Your Location:</p>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      ) : (
        error && <p className="mt-4 text-red-500">{error}</p>
      )}

      {weatherData && (
        <div className="mt-4 text-center">
          <p className="text-lg font-medium">Current Weather:</p>
          <p>Temperature: {weatherData.temp_c} °C</p>
          <p>Condition: {weatherData.condition.text}</p>
        </div>
      )}

      {farmer && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {farmer.crops.map((crop, index) => (
            <div key={index} className="bg-white border rounded shadow p-4">
              <h3 className="font-bold text-lg">{crop.type}</h3>
              <p><strong>Season:</strong> {crop.season}</p>
              <p><strong>Average Yield:</strong> {crop.averageYield} kg/ha</p>
              <p><strong>Soil Type:</strong> {crop.soilType}</p>
              <p><strong>Status:</strong> {crop.status}</p>
              <p><strong>Expected Harvest Date:</strong> {new Date(crop.expectedHarvestDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default YieldPrediction;
