import { Crop } from "../models/Crop.js"
import { Farmer } from "../models/User.js"; // Assuming you have a Farmer model

export const createCropAndAssignToFarmer = async (req, res) => {
    const { name, type, season, averageYield, growingConditions, farmerId } = req.body;

    try {
        // Create new crop
        const newCrop = new Crop({
            name,
            type,
            season,
            averageYield,
            growingConditions,
            farmer: farmerId, // Associate the crop with the farmer
        });

        const crop = await newCrop.save();

        // Find the farmer and update their crop list
        const farmer = await Farmer.findById(farmerId);
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }

        farmer.crops.push(crop._id); // Add the crop ID to the farmer's crop list
        await farmer.save(); // Save the updated farmer document

        res.status(201).json(crop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


export const updateCropStatus = async (req, res) => {
    const { cropId, status } = req.body;

    try {
        const crop = await Crop.findByIdAndUpdate(cropId, { status }, { new: true });
        res.json(crop);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAvailableCrops = async (req, res) => {
    try {
        const crops = await Crop.find({ status: 'completed' }).populate('farmer', 'name phone location');
        res.json(crops);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};