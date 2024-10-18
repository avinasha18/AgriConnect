import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Tabs,
  Tab,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Grass,
  WbSunny,
  Thermostat,
  WaterDrop,
  Landscape,
  CalendarToday,
  Info,
} from '@mui/icons-material';

import orangeImg from '../../assets/orange.jpg';
import papaya from '../../assets/papaya.jpg';
import mungbeans from '../../assets/mungbeans.jpg';
import coconut from '../../assets/coconut.jpg';
import wheat from '../../assets/wheat.jpg';
import rice from '../../assets/rice.jpg';
import maize from '../../assets/maize.jpg';
import coffee from '../../assets/coffee.jpg';
import kidneybeans from '../../assets/kidneybeans.jpg';
import jute from '../../assets/jute.jpg';
import muskmelon from '../../assets/muskmelon.jpg'
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

// Map crop names to their images
const cropImages = {
  orange: orangeImg,
  papaya: papaya,
  mungbeans: mungbeans,
  coconut: coconut,
  wheat: wheat,
  rice: rice,
  maize: maize,
  coffee: coffee,
  kidneybeans: kidneybeans,
  jute: jute,
  muskmelon : muskmelon,
};

const DetailView = () => {
  const location = useLocation();
  const { crop } = location.state || {};
  const [activeTab, setActiveTab] = useState(0);
  console.log(crop);

  if (!crop) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-400 to-blue-500">
        <Typography variant="h4" className="text-white">Crop not found</Typography>
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const nutrientData = [
    { name: 'Nutrients', N: crop?.nutrientRequiments?.N, P: crop?.nutrientRequiments?.P, K: crop?.nutrientRequiments?.K },
  ];
  console.log(nutrientData);

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

  // Select the image based on the crop name, use a default image if not found
  const selectedImage = cropImages[crop.cropName] || orangeImg;

  return (
    <ThemeProvider theme={theme}>
      <Box className="min-h-screen bg-white p-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-4xl mx-auto overflow-hidden rounded-xl shadow-2xl">
            <CardMedia
              component="img"
              height="200"
              image={selectedImage}
              alt={crop.cropName}
              className="object-cover h-[250px]"
            />
            <CardContent className="p-6">
              <Typography variant="h3" component="h1" className="text-green-800 mb-4">
                {crop.cropName}
              </Typography>
              <Chip icon={<Grass />} label={crop.type || 'N/A'} className="mr-2 mb-2" color="primary" />
              <Chip icon={<CalendarToday />} label={crop.season || 'N/A'} className="mr-2 mb-2" color="secondary" />

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 4 }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="crop details tabs">
                  <Tab label="General Info" icon={<Info />} iconPosition="start" />
                  <Tab label="Growing Conditions" icon={<WbSunny />} iconPosition="start" />
                  <Tab label="Nutrient Requirements" icon={<Landscape />} iconPosition="start" />
                </Tabs>
              </Box>

              <TabPanel value={activeTab} index={0}>
                <Box className="mt-4">
                  <Typography variant="h5" className="mb-2">Description</Typography>
                  <Typography variant="body1">{crop.description || 'No description available.'}</Typography>

                  <Divider className="my-4" />

                  <Typography variant="h5" className="mb-2">Additional Information</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon><CalendarToday /></ListItemIcon>
                      <ListItemText primary="Growing Season" secondary={crop.season || 'N/A'} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><Grass /></ListItemIcon>
                      <ListItemText primary="Crop Type" secondary={crop.type || 'N/A'} />
                    </ListItem>
                  </List>
                </Box>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Box className="mt-4">
                  <Typography variant="h5" className="mb-2">Optimal Growing Conditions</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <List>
                        <ListItem>
                          <ListItemIcon><Landscape /></ListItemIcon>
                          <ListItemText primary="Soil Type" secondary={crop.optimalConditions.soil || 'N/A'} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><WbSunny /></ListItemIcon>
                          <ListItemText primary="Sunlight" secondary={crop.optimalConditions.sunlight || 'N/A'} />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <List>
                        <ListItem>
                          <ListItemIcon><Thermostat /></ListItemIcon>
                          <ListItemText primary="Temperature" secondary={crop.optimalConditions.temperature || 'N/A'} />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon><WaterDrop /></ListItemIcon>
                          <ListItemText primary="Water Requirements" secondary={crop.optimalConditions.water || 'N/A'} />
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Box className="mt-4">
                  <Typography variant="h5" className="mb-4">Nutrient Requirements</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={nutrientData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="N" fill="#82ca9d" name="Nitrogen" />
                      <Bar dataKey="P" fill="#8884d8" name="Phosphorus" />
                      <Bar dataKey="K" fill="#ffc658" name="Potassium" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

export default DetailView;
