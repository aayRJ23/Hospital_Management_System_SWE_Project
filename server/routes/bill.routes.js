import express from 'express';
// ✅ FIX: Updated import name from getAllAppointments to getAllBills (renamed in bill.controllers.js)
import { createBill, getBillByAppointmentId, getAllBills } from '../controllers/bill.controllers.js';

const router = express.Router();

// Route to create a new bill
router.post('/createBill', createBill);

// Route to get a bill by appointment ID
router.get('/getBill/:appointmentId', getBillByAppointmentId);

// Route to get all bills
router.get('/getAllBills', getAllBills);

export default router;