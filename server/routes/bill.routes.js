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

// Middleware that allows either admin or patient to access a route
const isAdminOrPatientAuthenticated = (req, res, next) => {
  // Try admin token first
  const adminToken = req.cookies.adminToken;
  const patientToken = req.cookies.patientToken;

  if (adminToken) {
    return isAdminAuthenticated(req, res, next);
  } else if (patientToken) {
    return isPatientAuthenticated(req, res, next);
  } else {
    return res.status(401).json({ message: "Not authenticated" });
  }
};

// Admin creates bill
router.post("/create", isAdminAuthenticated, createBill);

// Admin views all bills
router.get("/all", isAdminAuthenticated, getAllBills);

// Patient OR Admin fetches a specific bill by appointment
router.get("/:appointmentId", isAdminOrPatientAuthenticated, getBillByAppointmentId);

// Patient pays a bill
router.put("/pay/:billId", isPatientAuthenticated, markBillAsPaid);

export default router;