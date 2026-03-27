import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  userLogin,
  registerPatient,
  registerAdmin,
  registerDoctor,
  getAllDoctors,
  getUserDetails,
  logoutAdmin,
  logoutPatient,
  logoutDoctor,
  getAllAdmins,
  getAdminById,
  deleteAdmin,
  updateAdmin,
  updateDoctor,
  deleteDoctor,
  getAllPatients,
} from "../controllers/user.controllers.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
  isDoctorAuthenticated,
} from "../middlewares/auth.middleware.js";

const router = Router();

/*_____________________________________LOGIN ROUTE______________________________________*/
router.route("/login").post(userLogin);

/*______________________________PATIENT ROUTES_________________________________________*/
router
  .route("/patient/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerPatient);
router.get("/patient/profile", isPatientAuthenticated, getUserDetails);
router.get("/patient/logout", logoutPatient);
router.get("/patient/", isAdminAuthenticated, getAllPatients);

/*______________________________ADMIN ROUTES___________________________________________*/
router.post("/admin/register", isAdminAuthenticated, registerAdmin);
router.get("/admin/profile", isAdminAuthenticated, getUserDetails);
router.get("/admin/logout", logoutAdmin);

router.get("/admin/", isAdminAuthenticated, getAllAdmins);
router.get("/admin/:id", isAdminAuthenticated, getAdminById);
router.post("/admin/add", isAdminAuthenticated, registerAdmin);
router.put("/admin/:id", isAdminAuthenticated, updateAdmin);
router.delete("/admin/:id", isAdminAuthenticated, deleteAdmin);

/*______________________________DOCTOR ROUTES___________________________________________*/
router.get("/doctors", getAllDoctors);
router.post("/doctor/register", registerDoctor);

// ✅ FIX: "isDoctorAuthenticated || isAdminAuthenticated" was evaluated immediately as a truthy
// expression — both are function refs so || always picked the first one.
// Correct approach: use a wrapper that tries both middlewares properly.
const isDoctorOrAdminAuthenticated = (req, res, next) => {
  if (req.cookies.doctorToken) {
    return isDoctorAuthenticated(req, res, next);
  }
  return isAdminAuthenticated(req, res, next);
};

router.get("/doctor/profile", isDoctorOrAdminAuthenticated, getUserDetails);
router.get("/doctor/logout", logoutDoctor);
router.put("/doctor/:id", isAdminAuthenticated, updateDoctor);
router.delete("/doctor/:id", isAdminAuthenticated, deleteDoctor);

export default router;