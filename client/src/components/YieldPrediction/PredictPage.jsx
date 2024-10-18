import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Lottie from 'react-lottie';
import loadingAnimation from './Loading.json';
import analysisAnimation from './AI.json';
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { Progress } from "./Progress";
import { Badge } from "./Badge";
import { Droplet, Thermometer, Cloud, Calendar, Leaf, Map, Ruler } from 'lucide-react';

const PredictPage = () => {
    const location = useLocation();
    const inputData = location.state || {};
    const [cropDetails, setCropDetails] = useState({});
    const [loadingStage, setLoadingStage] = useState('initial');
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

    const [predictionResult, setPredictionResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const getLottieOptions = (animationData) => ({
        loop: true,
        autoplay: true,
        animationData,
        rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
    });

    const getCropDetails = async () => {
        try {
            const cropData = await axios.get(`http://localhost:5000/crops/${inputData.crop}`);
            setCropDetails(cropData.data);
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

    const getYieldPredictions = async () => {
        try {
            if (predictionInput.State_Name && predictionInput.Crop) {
                setLoadingStage('analysis');
                const response = await axios.post('http://127.0.0.1:5000/yield-predict', predictionInput);
                setTimeout(() => {
                    setPredictionResult(response.data);
                    setLoading(false);
                }, 5000);
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
        if (inputData.crop) {
            getCropDetails();
        }
    }, [inputData.crop]);

    useEffect(() => {
        if (cropDetails) {
            getYieldPredictions();
        }
    }, [cropDetails]);

    const parseSuggestions = (suggestions) => {
        return suggestions
            .split('\n')
            .filter(line => !line.startsWith('##'))
            .map((line, index) => (
                <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={line.startsWith('*') ? "font-bold mb-2" : "mb-2"}
                >
                    {line.startsWith('*') ? line.substring(1).trim() : line}
                </motion.p>
            ));
    };

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-50 to-blue-50"
            >
                <Lottie options={getLottieOptions(loadingStage === 'initial' ? loadingAnimation : analysisAnimation)} height={300} width={300} />
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl mt-4 text-green-800"
                >
                    {loadingStage === 'initial' ? 'Loading crop details...' : 'Analyzing and predicting yield...'}
                </motion.p>
            </motion.div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="container mx-auto p-8 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen"
            >
                {predictionResult && cropDetails && !loading && (
                    <>
                        <motion.h1
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl font-bold text-green-800 mb-8 text-center"
                        >
                            Yield Prediction for {cropDetails.type}
                        </motion.h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-green-700">Crop Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center">
                                            <Leaf className="h-5 w-5 text-green-500 mr-2" />
                                            <span>Type: {cropDetails.type}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="h-5 w-5 text-orange-500 mr-2" />
                                            <span>Season: {cropDetails.season}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Map className="h-5 w-5 text-blue-500 mr-2" />
                                            <span>Soil Type: {cropDetails.soilType}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Ruler className="h-5 w-5 text-purple-500 mr-2" />
                                            <span>Average Yield: {cropDetails.averageYield} kg/ha</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            <motion.div
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl text-blue-700">Prediction Result</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-4xl font-bold text-blue-600 mb-4">
                                            {predictionResult.Predicted_Production} kg/ha
                                        </div>
                                        <Progress value={(predictionResult.Predicted_Production / cropDetails.averageYield) * 100} className="h-2 mb-2" />
                                        <p className="text-sm text-gray-600">Compared to average yield</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-8"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl text-purple-700">Suggestions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {parseSuggestions(predictionResult.suggestions)}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default PredictPage;