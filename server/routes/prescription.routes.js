import express from "express";
import { postPrescription, getPrescription } from "../controllers/prescription.controllers.js";
import { isDoctorAuthenticated } from "../middlewares/auth.middleware.js"; // Assuming you have this middleware for user authentication

const router = express.Router();

router.post("/postPrescribe", postPrescription);
router.get("/getPrescribe/:appointmentId", getPrescription);

export default router;
