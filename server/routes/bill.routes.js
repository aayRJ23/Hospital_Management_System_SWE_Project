// server/routes/bill.routes.js
import express from "express";
import {
  createBill,
  getBillByAppointmentId,
  getAllBills,
  markBillAsPaid,
} from "../controllers/bill.controllers.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin creates bill
router.post("/create", isAdminAuthenticated, createBill);

// Admin views all bills
router.get("/all", isAdminAuthenticated, getAllBills);

// Patient/Admin fetches a specific bill by appointment
router.get("/:appointmentId", isPatientAuthenticated, getBillByAppointmentId);

// Patient pays a bill
router.put("/pay/:billId", isPatientAuthenticated, markBillAsPaid);

export default router;