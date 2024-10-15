// cropRoutes.js
import express from 'express';
import auth from '../middleware/auth.js';
import { createCrop, updateCropStatus, getAvailableCrops } from '../controllers/cropControllers.js';

const router = express.Router();


router.post('/', createCrop);
router.put('/status', updateCropStatus);
router.get('/available', getAvailableCrops);

export default router;
