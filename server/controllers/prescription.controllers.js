// server/controllers/prescription.controllers.js
import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorHandler from "../middlewares/error.middlewares.js";
import { Prescription } from "../models/prescription.model.js";
import { Appointment } from "../models/appointment.model.js";
import { createAndSendNotification } from "./notification.controllers.js";

const postPrescription = asyncHandler(async (req, res, next) => {
  const {
    appointmentId,
    remarks,
    prescription,
    medicineRecommendation,
    testReferral,
    additionalNote,
  } = req.body;

  if (!remarks) {
    return next(new ErrorHandler("Remarks must be provided!", 400));
  }

  const savedPrescription = await Prescription.findOneAndUpdate(
    { appointmentId },
    {
      appointmentId,
      remarks,
      prescription: prescription || "No Prescription Provided",
      medicineRecommendation: medicineRecommendation || "No Medicine Required",
      testReferral: testReferral || "No Test Referral",
      additionalNote: additionalNote || "No Additional Notes",
    },
    { upsert: true, new: true, runValidators: true }
  );

  // Find appointment to get patient & doctor info
  const appointment = await Appointment.findById(appointmentId);
  if (appointment) {
    const doctorName = `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`;
    const apptDate = new Date(appointment.appointment_date).toDateString();

    // → Notify Patient
    await createAndSendNotification({
      recipientId: appointment.patientId,
      recipientRole: "Patient",
      type: "PRESCRIPTION_RECEIVED",
      title: "Prescription Received 💊",
      message: `${doctorName} has submitted your prescription for the appointment on ${apptDate}.`,
      meta: {
        appointmentId: appointment._id,
        doctorName,
        department: appointment.department,
        appointmentDate: apptDate,
        remarks,
        prescription: prescription || "No Prescription Provided",
        medicineRecommendation: medicineRecommendation || "No Medicine Required",
        testReferral: testReferral || "No Test Referral",
      },
    });
  }

  res.status(200).json({
    success: true,
    message: "Prescription saved successfully!",
    prescription: savedPrescription,
  });
});

const getPrescription = asyncHandler(async (req, res, next) => {
  const { appointmentId } = req.params;
  const prescription = await Prescription.findOne({ appointmentId });
  if (!prescription) {
    return next(new ErrorHandler("No prescription found for this appointment ID", 404));
  }
  res.status(200).json(prescription);
});

export { postPrescription, getPrescription };