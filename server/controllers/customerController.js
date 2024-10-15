import { Customer } from "../models/User";

export const createCustomer = async (req, res) => {
    const { name, phone, location, preferredProducts } = req.body;

    const newCustomer = new Customer({
        name,
        phone,
        location,
        preferredProducts,
    });

    try {
        const customer = await newCustomer.save();
        res.status(201).json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getCustomerHistory = async (req, res) => {
    const { customerId } = req.params;

    try {
        const customer = await Customer.findById(customerId).populate('purchaseHistory.productId');
        res.json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};