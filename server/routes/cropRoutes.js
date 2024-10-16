// cropRoutes.js
import express from 'express';
import auth from '../middleware/auth.js';
import { createCropAndAssignToFarmer, updateCropStatus, getAvailableCrops } from '../controllers/cropControllers.js';

const router = express.Router();


router.post('/:farmerID', createCropAndAssignToFarmer);
router.put('/status', updateCropStatus);
router.get('/available', getAvailableCrops);

export default router;
