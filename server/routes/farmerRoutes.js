import express from "express"
import { createFarmer } from "../controllers/farmerControllers"

const router = express.Router();

router.post('/', createFarmer);

export default router;