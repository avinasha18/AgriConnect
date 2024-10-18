import express from "express"

import {updateCropYield,updateFarmingDay,getDashboardData,sendNotification, createFeedback, getFeedback} from '../controllers/dashboardController.js'



const router = express.Router();
router.get('/',getDashboardData)
router.get('/:farmerId', getDashboardData);

router.post('/update',updateCropYield)
router.post('/update-farming',updateFarmingDay)

router.post('/send-notification',sendNotification)


router.post('/feedback', createFeedback);
router.get('/feedback/:farmerId', getFeedback);
export default router;