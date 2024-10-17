import express from "express"

import {updateCropYield,updateFarmingDay,getDashboardData} from '../controllers/dashboardController.js'



const router = express.Router();
router.get('/',getDashboardData)
router.get('/:farmerId', getDashboardData);

router.put('/update',updateCropYield)
router.put('/update-farming',updateFarmingDay)
export default router;