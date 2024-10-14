// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  farmSize: { type: Number, required: true },
  mainCrops: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);