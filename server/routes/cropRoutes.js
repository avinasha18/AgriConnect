// cropRoutes.js
import express from 'express';
import Crop from '../models/Crop.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/list', auth, async (req, res) => {
  try {
    const { cropType, quantity, price, description } = req.body;
    const newCrop = new Crop({
      farmer: req.userId,
      cropType,
      quantity,
      price,
      description
    });
    await newCrop.save();
    res.status(201).json(newCrop);
  } catch (error) {
    res.status(500).json({ message: 'Error listing crop' });
  }
});

router.get('/listings', auth, async (req, res) => {
  try {
    const listings = await Crop.find({ farmer: req.userId });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings' });
  }
});

export default router;
