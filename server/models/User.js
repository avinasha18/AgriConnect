import mongoose from "mongoose";
import bcrypt from "bcrypt"

const FarmerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number],
    },
    farmSize: { type: Number, required: true },
    crops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crop' }],
    experience: { type: Number, required: true },
    pin: { type: String, required: true },
    farmingDays: [{
      date: { type: Date },
      activities: [{
        name: { type: String },
        hours: { type: Number },
      }],
    }],
    sustainabilityScore: { type: Number, default: 0 },
    farmingHabits: [{
      name: { type: String },
      completedSessions: { type: Number, default: 0 },
      totalSessions: { type: Number },
    }],
    createdAt: { type: Date, default: Date.now },
  });

  const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    preferredProducts: [{ type: String }],
    purchaseHistory: [{
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
      date: { type: Date, default: Date.now },
    }],
    createdAt: { type: Date, default: Date.now },
  });
export const Customer = mongoose.model('Customer', CustomerSchema);
FarmerSchema.index({ location: '2dsphere' });

export const Farmer = mongoose.model('Farmer', FarmerSchema);
