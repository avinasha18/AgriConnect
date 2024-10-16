// Import the Farmer model
import { Farmer } from "../models/User.js";

// Create farmer (already implemented)
export const createFarmer = async (req, res) => {
    const { name, phone, location, farmSize, experience } = req.body;

    const newFarmer = new Farmer({
        name,
        phone,
        location,
        farmSize,
        experience,
    });

    try {
        const farmer = await newFarmer.save();
        res.status(201).json(farmer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Fetch farmer details (already implemented)
export const farmerDetails = async (req, res) => {
    const { farmerID } = req.params;  // Use params to get the farmerID

    try {
        const farmer = await Farmer.findById(farmerID).populate('crops');  // Fetch farmer by ID
        if (!farmer) {
            return res.status(404).json({ message: "Farmer not found" });
        }
        res.status(200).json(farmer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update farmer profile
export const updateFarmerProfile = async (req, res) => {
    const { farmerID } = req.params;  // Use params to get the farmerID
    const { name, phone, location, farmSize, experience } = req.body;  // Updated data

    try {
        const updatedFarmer = await Farmer.findByIdAndUpdate(
            farmerID,
            { name, phone, location, farmSize, experience }, // Fields to update
            { new: true }  // Return the updated farmer
        );

        if (!updatedFarmer) {
            return res.status(404).json({ message: "Farmer not found" });
        }

        res.status(200).json(updatedFarmer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
