import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload,
  CheckCircleOutline,
  ErrorOutline,
  BugReport,
  Recommend,
  LocalFlorist,
  Grass,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'react-lottie';
import axios from 'axios';
import cropImage from '../../assets/orange.jpg'
// Import your Lottie animation JSON files
import uploadAnimation from './uploading.json';
import analysisAnimation from '../RecommendationSystem/AI.json';
import successAnimation from './success.json';

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

const CropDiseaseDetection = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const steps = ['Instructions', 'Upload Image', 'Results'];

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
      const response = await axios.post('http://127.0.0.1:8000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error predicting disease:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setCurrentStep((prevStep) => prevStep + 1);
  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1);
  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const TabPanel = ({ children, value, index }) => (
    <AnimatePresence mode="wait">
      {value === index && (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-400 to-blue-500 p-8"
        style={{
          // backgroundImage: `url(${cropImage})`,
          background : 'white',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Card className="max-w-4xl w-full mx-auto rounded-xl shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            <Typography variant="h3" component="h1" className="text-green-800 mb-6">
              Crop Disease Detection
            </Typography>

            <Stepper activeStep={currentStep} alternativeLabel className="mb-8">
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="instructions"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h5" className="mb-4">Instructions</Typography>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" className="mb-2">Do's</Typography>
                          <List>
                            <ListItem>
                              <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                              <ListItemText primary="Take a clear picture of the plant" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                              <ListItemText primary="Ensure the image is well-lit" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                              <ListItemText primary="Include the entire plant in the frame" />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" className="mb-2">Don'ts</Typography>
                          <List>
                            <ListItem>
                              <ListItemIcon><ErrorOutline color="error" /></ListItemIcon>
                              <ListItemText primary="Avoid blurry images" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon><ErrorOutline color="error" /></ListItemIcon>
                              <ListItemText primary="Do not include other objects in the frame" />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon><ErrorOutline color="error" /></ListItemIcon>
                              <ListItemText primary="Avoid taking pictures in low light" />
                            </ListItem>
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  <Box className="mt-6">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={nextStep}
                      fullWidth
                    >
                      Next
                    </Button>
                  </Box>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h5" className="mb-4">Upload Image</Typography>
                  <Box className="mb-4">
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="raised-button-file"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="raised-button-file">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUpload />}
                        fullWidth
                      >
                        Choose File
                      </Button>
                    </label>
                  </Box>
                  {preview ? (
                    <Box className="mb-4 flex items-center justify-center">
                      <img src={preview} alt="Preview" className="w-[300px] h-[300px] rounded-lg shadow-md" />
                    </Box>
                  ) : (
                    <Box className="mb-4 flex justify-center">
                      <Lottie
                        options={{
                          loop: true,
                          autoplay: true,
                          animationData: uploadAnimation,
                        }}
                        height={200}
                        width={200}
                      />
                    </Box>
                  )}
                  <Box className="flex justify-between">
                    <Button variant="outlined" onClick={prevStep}>
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={!file || loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Analyze Crop'}
                    </Button>
                  </Box>
                </motion.div>
              )}

              {currentStep === 2 && result && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h5" className="mb-4">Analysis Results</Typography>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs value={activeTab} onChange={handleTabChange} aria-label="disease analysis tabs">
                      <Tab label="Disease Info" icon={<BugReport />} iconPosition="start" />
                      <Tab label="Symptoms" icon={<LocalFlorist />} iconPosition="start" />
                      <Tab label="Treatment" icon={<Recommend />} iconPosition="start" />
                    </Tabs>
                  </Box>

                  <TabPanel value={activeTab} index={0}>
                    <Typography variant="h6" className="mb-2">Disease Information</Typography>
                    <List>
                      <ListItem>
                        <ListItemIcon><BugReport color="error" /></ListItemIcon>
                        <ListItemText primary="Disease" secondary={result.diseaseName} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><Grass color="primary" /></ListItemIcon>
                        <ListItemText primary="Causes" secondary={result.causes} />
                      </ListItem>
                    </List>
                  </TabPanel>

                  <TabPanel value={activeTab} index={1}>
                    <Typography variant="h6" className="mb-2">Symptoms</Typography>
                    <Typography variant="body1">{result.symptoms}</Typography>
                  </TabPanel>

                  <TabPanel value={activeTab} index={2}>
                    <Typography variant="h6" className="mb-2">Suggested Actions</Typography>
                    <List>
                      {result.suggestions.map((suggestion, index) => (
                        <ListItem key={index}>
                          <ListItemIcon><CheckCircleOutline color="primary" /></ListItemIcon>
                          <ListItemText primary={suggestion} />
                        </ListItem>
                      ))}
                    </List>
                    <Typography variant="h6" className="mt-4 mb-2">Recommended Fertilizers</Typography>
                    <List>
                      {result.fertilizers.map((fertilizer, index) => (
                        <ListItem key={index}>
                          <ListItemIcon><Recommend color="secondary" /></ListItemIcon>
                          <ListItemText primary={fertilizer} />
                        </ListItem>
                      ))}
                    </List>
                  </TabPanel>

                  <Box className="mt-6">
                    <Button variant="contained" color="primary" onClick={prevStep} fullWidth>
                      Back to Upload
                    </Button>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default CropDiseaseDetection;