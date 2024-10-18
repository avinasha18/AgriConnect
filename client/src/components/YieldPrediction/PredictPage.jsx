import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PredictPage = () => {
    const location = useLocation();
    const inputData = location.state || {};  // Get the data passed from previous page
    const [cropDetails, setCropDetails] = useState({});
    const [predictionInput, setPredictionInput] = useState({
        State_Name: inputData.location || '',
        District_Name: 'ANANTAPUR',
        Crop_Year: 2022,
        Season: '',
        Crop: '',
        Temperature: inputData.weatherData?.temp_c || 0,
        Humidity: inputData.weatherData?.humidity || 0,
        Soil_Moisture: 0,
        Area: inputData.farmSize || 0,
    });

    const [predictionResult, setPredictionResult] = useState(null);  // State to hold prediction result
    const [error, setError] = useState(null);  // State to handle errors
    const [loading, setLoading] = useState(true);  // State to show loading

    // Function to fetch crop details from the backend
    const getCropDetails = async () => {
        try {
            const cropData = await axios.get(`http://localhost:5000/crops/${inputData.crop}`);
            setCropDetails(cropData.data);  // Set the crop details state

            // Update the prediction input with crop data (e.g., season, soil moisture)
            setPredictionInput(prevInput => ({
                ...prevInput,
                Crop: cropData.data.type,
                Season: cropData.data.season,
                Soil_Moisture: cropData.data.moistPercent,
            }));
        } catch (error) {
            console.error('Error fetching crop details:', error);
            setError('Failed to fetch crop details.');
            setLoading(false);
        }
    };

    console.log(predictionInput)
    // Function to get yield predictions
    const getYieldPredictions = async () => {
        try {
            // Ensure that necessary fields are filled before making API call
            if (predictionInput.State_Name && predictionInput.Crop) {
                const response = await axios.post('http://127.0.0.1:5000/yield-predict', predictionInput);

                // Update the state with the response data
                setPredictionResult(response.data);
                setLoading(false);
            } else {
                setError('Missing required data for yield prediction.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching yield predictions:', error);
            setError('Failed to fetch yield predictions.');
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch crop details first
        if (inputData.crop) {
            getCropDetails();
        }
    }, [inputData.crop]);  // Trigger when crop changes

    useEffect(() => {
        // Once crop details are fetched, proceed to get yield predictions
        if (cropDetails) {
            getYieldPredictions();
        }
    }, [cropDetails]);  // Trigger when crop details are available

    // Function to parse the suggestion data
    const parseSuggestions = (suggestions) => {
        return suggestions
            .split('\n')
            .filter(line => !line.startsWith('##'))  // Ignore lines with '##'
            .map((line, index) => {
                if (line.startsWith('*')) {
                    return <p key={index}><strong>{line.substring(1).trim()}</strong></p>;  // Render bold text, removing the '*' symbol
                }
                return <p key={index}>{line}</p>;  // Render normal text
            });
    };


    return (
        <div className="container mx-auto p-36">

            {loading && <p>Loading predictions...</p>}  {/* Show loading while waiting for response */}

            {predictionResult && cropDetails && (
                <>
                    <div className="bg-white border rounded-lg shadow flex flex-col gap-10 p-6">
                        <p><strong className='text-2xl'>Predicted Yield : </strong> <span className='text-3xl font-medium'>{predictionResult.Predicted_Production} kg/ha</span></p>
                        <div>
                            <p className="font-extrabold text-4xl text-green-500">{cropDetails.type}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mt-6">Suggestions:</h3>
                        <div>{parseSuggestions(predictionResult.suggestions)}</div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PredictPage;
