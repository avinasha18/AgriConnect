import { Farmer } from "../models/User.js";

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