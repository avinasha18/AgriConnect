// models/Crop.js
import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropType: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  listedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Crop', cropSchema);