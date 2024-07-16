import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true
  },
  remarks: {
    type: String,
    required: [true, "Remarks must be provided!"]
  },
  prescription: {
    type: String,
    default: "No Prescription Provided"
  },
  medicineRecommendation: {
    type: String,
    default: "No Medicine Required"
  },
  testReferral: {
    type: String,
    default: "No Test Referral"
  },
  additionalNote: {
    type: String,
    default: "No Additional Notes"
  }
});

export const Prescription = mongoose.model("Prescription", prescriptionSchema);
