import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import locationAnimation from './location.json';
import weatherAnimation from './weather.json';
import soilAnimation from './soil.json';
import analysisAnimation from './AI.json';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#2196f3',
    },
  },
});

const CropRecommendationSystem = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [showManualForm, setShowManualForm] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadingStage('analysis');
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      setRecommendedCrops(response.data.cropInfos.filter(crop => crop.cropName && crop.description));
      setStep(2);
    } catch (error) {
      console.error('Error making prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationData = async () => {
    setLoading(true);
    setLoadingStage('location');
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;

      setLoadingStage('weather');
      const weatherData = await fetchWeatherData(latitude, longitude);
      const { temp_c, humidity, precip_mm } = weatherData;

      setLoadingStage('soil');
      // Simulate fetching soil data (replace with actual API call if available)
      await new Promise(resolve => setTimeout(resolve, 2000));

      setFormData(prevState => ({
        ...prevState,
        temperature: temp_c,
        humidity,
        N: 90,
        P: 42,
        K: 43,
        ph: 7.038096361,
        rainfall: precip_mm,
      }));

      setStep(1);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=8486f0f9386945cc97f154711241410&q=${latitude},${longitude}`);
    return response.data.current;
  };

  const getLoadingAnimation = () => {
    switch (loadingStage) {
      case 'location':
        return locationAnimation;
      case 'weather':
        return weatherAnimation;
      case 'soil':
        return soilAnimation;
      case 'analysis':
        return analysisAnimation;
      default:
        return null;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              Crop Recommendation System
            </Typography>
            <Typography variant="body1" gutterBottom>
              Let's start by fetching your soil and weather data from your location.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchLocationData}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              Fetch Location Data
            </Button>
           
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              Data Successfully Fetched
            </Typography>
            <Typography variant="body1" gutterBottom>
              We've gathered your location data. You can now get recommendations or edit the data manually.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ mr: 2, mt: 2 }}
            >
              Get Recommendations
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowManualForm(true)}
              sx={{ mt: 2 }}
            >
              Edit Data Manually
            </Button>
            {showManualForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    {Object.entries(formData).map(([key, value]) => (
                      <Grid item xs={12} sm={6} key={key}>
                        <TextField
                          fullWidth
                          label={key.charAt(0).toUpperCase() + key.slice(1)}
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                          type="number"
                          variant="outlined"
                          required
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{ mt: 3 }}
                  >
                    Get Recommendation
                  </Button>
                </form>
              </motion.div>
            )}
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h5" component="h2" gutterBottom color="primary">
              Recommended Crops
            </Typography>
            <Grid container spacing={3}>
              {recommendedCrops.map((crop, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/crop/${crop.cropName.toLowerCase()}`, { state: { crop } })}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          pt: '56.25%',
                          backgroundColor: crop.imageUrl ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        image={crop.imageUrl}
                      >
                        {!crop.imageUrl && (
                          <Typography variant="h5" color="text.secondary">
                            {crop.cropName}
                          </Typography>
                        )}
                      </CardMedia>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {crop.cropName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {crop.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
        }}
      >
        <Card sx={{ maxWidth: 800, width: '100%', p: 4, borderRadius: 4 }}>
          <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Fetch Data</StepLabel>
            </Step>
            <Step>
              <StepLabel>Review Data</StepLabel>
            </Step>
            <Step>
              <StepLabel>Get Recommendations</StepLabel>
            </Step>
          </Stepper>

          {renderStep()}
        </Card>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                zIndex: 9999,
              }}
            >
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: getLoadingAnimation(),
                }}
                height={200}
                width={200}
              />
              <Typography variant="h6" color="white" mt={2}>
                {loadingStage === 'location' && 'Fetching your coordinates...'}
                {loadingStage === 'weather' && 'Fetching weather data...'}
                {loadingStage === 'soil' && 'Fetching soil data...'}
                {loadingStage === 'analysis' && 'Analyzing your data...'}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </ThemeProvider>
  )
}
export default CropRecommendationSystem