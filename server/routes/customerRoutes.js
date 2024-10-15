import express from "express"
import { createCustomer, getCustomerHistory } from "../controllers/customerController"

const router = express.Router();

router.post('/', createCustomer);
router.get('/:customerId/history', getCustomerHistory);

export default router;