// marketRoutes.js
import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/prices', auth, async (req, res) => {
  // This would typically involve calling an external API or querying a database
  // For now, we'll return mock data
  const mockPrices = [
    { crop: 'Wheat', price: 250 },
    { crop: 'Rice', price: 300 },
    { crop: 'Corn', price: 180 },
    { crop: 'Soybeans', price: 400 },
    { crop: 'Cotton', price: 70 },
  ];
  res.status(200).json(mockPrices);
});

router.get('/predictions', auth, async (req, res) => {
  // This would typically involve calling a machine learning model
  // For now, we'll return mock data
  const mockPredictions = [
    { crop: 'Wheat', currentPrice: 250, predictedPrice: 280 },
    { crop: 'Rice', currentPrice: 300, predictedPrice: 320 },
    { crop: 'Corn', currentPrice: 180, predictedPrice: 200 },
    { crop: 'Soybeans', currentPrice: 400, predictedPrice: 420 },
    { crop: 'Cotton', currentPrice: 70, predictedPrice: 75 },
  ];
  res.status(200).json(mockPredictions);
});

router.get('/recommendations', auth, async (req, res) => {
  // This would typically involve analyzing market data and user's crop information
  // For now, we'll return mock data
  const mockRecommendations = [
    'Wheat prices are expected to rise. Consider holding your stock for a few more weeks.',
    'Rice demand is steady. Current market conditions are favorable for selling.',
    'Corn prices might see a slight increase. Monitor the market closely.',
  ];
  res.status(200).json(mockRecommendations);
});

export default router;