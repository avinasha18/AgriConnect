import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { Crop } from '../models/Crop.js';
import { Farmer } from '../models/User.js';

const router = express.Router();

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Get all crops
router.get('/', async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching crops' });
  }
});

// Create new crop with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { type, soilType, plantingDate, expectedHarvestDate, season, averageYield, N, P, K, temperature, humidity, moistPercent, ph, rainfall, farmerID } = req.body;
    const newCrop = new Crop({
      type,
      soilType,
      plantingDate,
      expectedHarvestDate,
      season,
      averageYield,
      N,
      P,
      K,
      farmer: farmerID,
      temperature,
      humidity,
      moistPercent,
      ph,
      rainfall,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await newCrop.save();

    const farmer = await Farmer.findById(farmerID);

    if(!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    farmer.crops.push(newCrop._id);
    farmer.save();

    res.status(201).json(newCrop);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: 'Error saving crop', error });
  }
});

// Update crop
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updatedCrop = await Crop.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
      },
      { new: true }
    );
    res.json(updatedCrop);
  } catch (error) {
    res.status(400).json({ message: 'Error updating crop', error });
  }
});

// Delete crop
router.delete('/:id', async (req, res) => {
  try {
    await Crop.findByIdAndDelete(req.params.id);
    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting crop', error });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the farmer by ID and populate the crops array
    const crop = await Crop.findById(id)

    if (!crop) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farmer and crops', error });
  }
});

export default router;
