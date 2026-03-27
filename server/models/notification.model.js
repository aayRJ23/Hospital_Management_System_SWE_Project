// server/models/notification.model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientRole: {
      type: String,
      enum: ["Patient", "Doctor", "Admin"],
      required: true,
    },
    type: {
      type: String,
      enum: [
        "APPOINTMENT_BOOKED",       // → Doctor, Admin
        "APPOINTMENT_ACCEPTED",     // → Patient
        "APPOINTMENT_REJECTED",     // → Patient
        "APPOINTMENT_PENDING",      // → Patient (reset)
        "VIDEO_CALL_SCHEDULED",     // → Patient
        "PRESCRIPTION_RECEIVED",    // → Patient
        "BILL_GENERATED",           // → Patient
        "BILL_PAID",                // → Admin, Doctor
        "PATIENT_CHECKED",          // → Admin
        "APPOINTMENT_DELETED",      // → Patient, Admin
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // Extra details (appointment info, doctor name, etc.) stored as flexible object
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);