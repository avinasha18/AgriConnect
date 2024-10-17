// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config.js';
import authRoutes from './routes/authRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import farmerRoutes from "./routes/farmerRoutes.js";
import customerRoutes from "./routes/customerRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(config.MONGODB_URI, {})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('', authRoutes);
app.use('/crops', cropRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/farmers', farmerRoutes);
app.use('/customers', customerRoutes);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

export default app;