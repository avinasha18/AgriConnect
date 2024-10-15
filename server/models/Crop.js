const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  averageYield: {
    type: Number,
    required: true,
  },
  growingConditions: {
    soilType: {
      type: String,
    },
    temperature: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
    },
    rainfall: {
      type: Number,
    },
  },
  pests: [{
    type: String,
  }],
  diseases: [{
    type: String,
  }],
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
  },
  status: {
    type: String,
    enum: ['cultivating', 'completed', 'sold'], // Status of the crop
    default: 'cultivating',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Crop = mongoose.model('Crop', CropSchema);
