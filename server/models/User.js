const mongoose = require('mongoose');

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
    createdAt: {
        type: Date,
        default: Date.now,
    },
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
