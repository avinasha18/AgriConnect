import express from 'express';
import auth from '../middleware/auth.js';
import { createCropAndAssignToFarmer, updateCropStatus, getAvailableCrops } from '../controllers/cropControllers.js';
import multer from 'multer';
import { Crop } from '../models/Crop.js';

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

router.post('/:farmerID', createCropAndAssignToFarmer);
router.put('/status', updateCropStatus);
router.get('/available', getAvailableCrops);
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
    const { name, type, season, averageYield, plantingDate, harvestDate } = req.body;
    const newCrop = new Crop({
      name,
      type,
      season,
      averageYield,
      plantingDate,
      harvestDate,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await newCrop.save();
    res.status(201).json(newCrop);
  } catch (error) {
    console.log(error.message)
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

export default router;
