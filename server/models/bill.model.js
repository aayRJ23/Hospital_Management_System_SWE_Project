import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  patientEmail: {
    type: String,
    required: true,
  },
  patientPhone: {
    type: String,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  convenienceCharge: {
    type: Number,
    default: 60,
  },
  GST: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  dateIssued: {
    type: Date,
    default: Date.now,
  },
  billingDate: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  }
});

billSchema.index({ appointmentId: 1, patientId: 1, doctorId: 1 });

export const Bill = mongoose.model('Bill', billSchema);
