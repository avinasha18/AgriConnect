import mongoose from "mongoose";

const CropSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  season: { type: String, required: true },
  averageYield: { type: Number, required: true },
  cropType: { type: String },
  growingConditions: {
    soilType: { type: String },
    temperature: {
      min: { type: Number },
      max: { type: Number },
    },
    rainfall: { type: Number },
  },
  pests: [{ type: String }],
  diseases: [{ type: String }],
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
  status: {
    type: String,
    enum: ['cultivating', 'completed', 'sold'],
    default: 'cultivating',
  },
  image: { type: String }, // URL to the crop image
  description: { type: String },
  plantingDate: { type: Date },
  harvestDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const Crop = mongoose.model('Crop', CropSchema);
