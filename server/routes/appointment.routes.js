import express from "express"
import {postAppointment,getAllAppointments,updateAppointmentStatus,deleteAppointment,updateCheckStatus} from "../controllers/appointment.controllers.js";
import {isAdminAuthenticated, isPatientAuthenticated, isDoctorAuthenticated} from "../middlewares/auth.middleware.js";

const router=express.Router();

router.post("/post", isPatientAuthenticated ,postAppointment);
router.get("/getall", getAllAppointments);
router.put("/update/:id", updateAppointmentStatus);
router.put('/check/:id', updateCheckStatus);
router.delete("/delete/:id", deleteAppointment);


export default router;