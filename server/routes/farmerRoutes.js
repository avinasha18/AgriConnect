import express from "express"
import { createFarmer, farmerDetails, updateFarmerProfile } from "../controllers/farmerControllers.js"

const router = express.Router();

router.post('/', createFarmer);
router.get('/profile/:farmerID', farmerDetails);
router.put('/profile/:farmerID', updateFarmerProfile);

export default router;