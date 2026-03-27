import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorHandler from "./error.middlewares.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAdminAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) return next(new ErrorHandler("Admin is not authenticated", 401));

  // ✅ FIX: Use jwt.verify() instead of jwt.decode() to actually validate the token signature
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  if (req.user.role !== "Admin") {
    return next(
      new ErrorHandler(
        `${req.user.role} is not authorized for this resource!`,
        403
      )
    );
  }
  next();
});

export const isPatientAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies.patientToken;
  if (!token) return next(new ErrorHandler("Patient is not authenticated", 401));

  // ✅ FIX: Use jwt.verify() instead of jwt.decode()
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  if (req.user.role !== "Patient") {
    return next(
      new ErrorHandler(
        `${req.user.role} is not authorized for this resource!`,
        403
      )
    );
  }
  next();
});

export const isDoctorAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies.doctorToken;
  // ✅ FIX: Error message was incorrectly saying "Patient" — fixed to "Doctor"
  if (!token) return next(new ErrorHandler("Doctor is not authenticated", 401));

  // ✅ FIX: Use jwt.verify() instead of jwt.decode()
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  if (req.user.role !== "Doctor") {
    return next(
      new ErrorHandler(
        `${req.user.role} is not authorized for this resource!`,
        403
      )
    );
  }
  next();
});