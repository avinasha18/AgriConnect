// dashboardController.js

import { Crop } from '../models/Crop.js';
import { Farmer,Feedback } from '../models/User.js';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import twilio from 'twilio'
const genAI = new GoogleGenerativeAI('AIzaSyCaLGMi6zxrhDRHTdARy_oqgvTP6vojJhk');
import config from '../config.js';
export const getDashboardData = async (req, res) => {
  try {
    const farmerId = req.params.farmerId;
    const { latitude, longitude, language } = req.query;
    const farmer = await Farmer.findById(farmerId).populate('crops');
    console.log(farmer)
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Fetch weather data
    const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=8486f0f9386945cc97f154711241410&q=${latitude},${longitude}&days=3`);
    const weatherData = weatherResponse.data;

    // Process farming days data
    const farmingDays = farmer.farmingDays.map(day => ({
      date: day.date,
      activities: day.activities,
    }));

    // Process crop yield data
    const cropYieldData = farmer.crops.map(crop => ({
      name: crop.name,
      current: crop.currentYield,
      target: crop.targetYield,
    }));

    // Calculate sustainability score (simplified example)
    const sustainabilityScore = farmer.sustainabilityScore;

    // Fetch AI suggestions
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Given the following farm data, provide 3 brief suggestions for improving farm sustainability and crop yield. Respond in ${language}:
      Crops: ${farmer.crops.map(c => c.name).join(', ')}
      Farm Size: ${farmer.farmSize} acres
      Current Sustainability Score: ${sustainabilityScore}`;
    const result = await model.generateContent(prompt);
    const aiSuggestions = result.response.text().split('\n').filter(s => s.trim() !== '');

    res.json({
      farmerName: farmer.name,
      weatherData,
      farmingDays,
      cropYieldData,
      sustainabilityScore,
      farmingHabits: farmer.farmingHabits,
      aiSuggestions,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error.message);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};
export const updateFarmingDay = async (req, res) => {
  try {
    const { farmerId, date, activities } = req.body;

    console.log('Received Date:', date);
    console.log('Parsed Date:', new Date(date));
    console.log('Farmer ID:', farmerId);

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Fetch the farmer by ID
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    console.log('Farmer fetched successfully:', farmer);

    // Check if farmingDays exists and is an array
    if (!Array.isArray(farmer.farmingDays)) {
      return res.status(500).json({ message: 'farmingDays field is missing or not an array' });
    }

    console.log('Farmer Farming Days:', farmer.farmingDays);

    // Find the existing day by comparing only the date (ignoring time)
    const existingDayIndex = farmer.farmingDays.findIndex(day => 
      day.date.toISOString().split('T')[0] === parsedDate.toISOString().split('T')[0]
    );

    if (existingDayIndex !== -1) {
      // Update activities for the existing day
      farmer.farmingDays[existingDayIndex].activities = activities;
    } else {
      // Add a new farming day with the parsed date and activities
      farmer.farmingDays.push({ date: parsedDate, activities });
    }

    // Save the updated farmer document
    await farmer.save();
    res.json({ message: 'Farming day updated successfully', updatedFarmingDays: farmer.farmingDays });

  } catch (error) {
    console.error('Error updating farming day:', error.message);
    res.status(500).json({ message: 'Error updating farming day' });
  }
};

export const updateCropYield = async (req, res) => {
  try {
    const { cropId, currentYield } = req.body;
    const crop = await Crop.findById(cropId);

    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    crop.currentYield = currentYield;
    await crop.save();

    res.json({ message: 'Crop yield updated successfully' });
  } catch (error) {
    console.error('Error updating crop yield:', error);
    res.status(500).json({ message: 'Error updating crop yield' });
  }
};



const accountSid = process.env.SID;
const authToken = process.env.AUTH;
const client = twilio(accountSid, authToken);

export const sendNotification = async (req, res) => {
  const { userId, weatherData } = req.body;

  try {
    const farmer = await Farmer.findById(userId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const message = `
    వాతావరణం డేటా:
    ఉష్ణోగ్రత: ${weatherData.current.temp_c}°C
    తేమ: ${weatherData.current.humidity}%
    వర్షపాతం: ${weatherData.current.precip_mm}mm

    దయచేసి ఫీడ్‌బ్యాక్ ఇవ్వండి: http://localhost:5173/voice-input-form/${userId}
  `;

    const fixedphone = `+${91}${farmer.phone}`
    await client.messages.create({
      body: message,
      from: process.env.NUMBER,
      to: fixedphone,
    });

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
};


export const createFeedback = async (req, res) => {
  const { farmerId, farmerName, cropType, cropYield, review } = req.body;

  try {
    const newFeedback = new Feedback({
      farmerId,
      farmerName,
      cropType,
      cropYield,
      review,
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
};

export const getFeedback = async (req, res) => {
  const { farmerId } = req.params;

  try {
    const feedback = await Feedback.find({ farmerId });
    res.status(200).json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve feedback' });
  }
};
