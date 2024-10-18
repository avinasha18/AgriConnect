import mongoose from "mongoose";

const CropSchema = new mongoose.Schema({
  type: { type: String, required: true },
  season: { type: String, required: true },
  averageYield: { type: Number, required: true },
  soilType: { type: String },
  moistPercent: { type: Number },
  pests: [{ type: String }],
  diseases: [{ type: String }],
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
  status: {
    type: String,
    enum: ['cultivating', 'completed', 'sold'],
    default: 'cultivating',
  },
  image: { type: String },
  description: { type: String },
  plantingDate: { type: Date },
  harvestDate: { type: Date },
  currentYield: { type: Number, default: 0 },
  targetYield: { type: Number },
  expectedHarvestDate: { type: Date },
  N: { type: Number },
  P: { type: Number },
  K: { type: Number },
  temperature: { type: Number },
  humidity: { type: Number },
  ph: { type: Number },
  rainfall: { type: Number },
  createdAt: { type: Date, default: Date.now },
});




export const Crop = mongoose.model('Crop', CropSchema);
