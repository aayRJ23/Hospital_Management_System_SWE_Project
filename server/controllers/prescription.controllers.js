import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorHandler from "../middlewares/error.middlewares.js";
import { Prescription } from "../models/prescription.model.js";

const postPrescription = asyncHandler(async (req, res, next) => {
  const { appointmentId, remarks, prescription, medicineRecommendation, testReferral, additionalNote } = req.body;

  if (!remarks) {
    return next(new ErrorHandler("Remarks must be provided!", 400));
  }

  // Use upsert so re-submitting updates the existing prescription instead of creating a duplicate
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