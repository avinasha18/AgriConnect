// authRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Farmer, Customer } from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, phone, experience, pin, location, farmSize } = req.body;

    console.log('Registration Request Body:', req.body);

    // Validate required fields
    if (!name || !phone || !pin || !location || !farmSize) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await Farmer.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the PIN

    const hashedPin = await bcrypt.hash(pin, 10);
    console.log('Hashed PIN:', hashedPin);

    // Create a new user
    const newUser = new Farmer({
      name,
      phone,
      pin: hashedPin,
      experience,
      location,
      farmSize
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token and user ID
    res.status(201).json({ token, userId: newUser._id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/customers/register', async (req, res) => {
  try {
    const { name, phone, location, pin, } = req.body;

    console.log('Registration Request Body:', req.body);

    // Validate required fields
    if (!name || !phone || !pin || !location ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await Customer.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the PIN

    const hashedPin = await bcrypt.hash(pin, 10);
    console.log('Hashed PIN:', hashedPin);

    // Create a new user
    const newUser = new Customer({
      name,
      phone,
      pin: hashedPin,
      location,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token and user ID
    res.status(201).json({ token, userId: newUser._id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, pin } = req.body;

    console.log('Login Request Body:', req.body);

    if (!phone || !pin) {
      return res.status(400).json({ message: 'Phone and PIN are required' });
    }

    const user = await Farmer.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(pin, user.pin);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/customers/login', async (req, res) => {
  try {
    const { phone, pin } = req.body;

    console.log('Login Request Body:', req.body);

    if (!phone || !pin) {
      return res.status(400).json({ message: 'Phone and PIN are required' });
    }

    const user = await Customer.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(pin, user.pin);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;