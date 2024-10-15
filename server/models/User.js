import mongoose from "mongoose";
import bcrypt from "bcrypt"

const FarmerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    farmSize: {
        type: Number, // Size of the farm in acres or hectares
        required: true,
    },
    crops: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop', // Assuming you have a Product model
    }],
    experience: {
        type: Number, // Years of farming experience
        required: true,
    },
    pin: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

FarmerSchema.pre('save', async function(next) {
    if (this.isModified('pin')) {
        const salt = await bcrypt.genSalt(10);
        this.pin = await bcrypt.hash(this.pin, salt);
    }
    next();
});

const CustomerSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
  },
  phone: {
      type: String,
      required: true,
  },
  location: {
      type: String,
      required: true,
  },
  preferredProducts: [{
      type: String, // List of preferred products
  }],
  purchaseHistory: [{
      productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Crop',
      },
      date: {
          type: Date,
          default: Date.now,
      },
  }],
  createdAt: {
      type: Date,
      default: Date.now,
  },
});

export const Customer = mongoose.model('Customer', CustomerSchema);

export const Farmer = mongoose.model('Farmer', FarmerSchema);
