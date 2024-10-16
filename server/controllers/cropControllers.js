import { Crop } from "../models/Crop.js"

export const createCrop = async (req, res) => {
    const { name, type, season, averageYield, growingConditions, farmerId } = req.body;

    const newCrop = new Crop({
        name,
        type,
        season,
        averageYield,
        growingConditions,
        farmer: farmerId,
    });

    try {
        const crop = await newCrop.save();
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