import { Bill } from "../models/bill.model.js";
import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";

// Controller for creating and saving a bill
export const createBill = async (req, res) => {
  const {
    appointmentId,
    appointmentDate,
    billingDate,
    doctorId,
    doctorName,
    department,
    patientName,
    patientId,
    email,
    dob,
    phone,
    nic,
    gender,
    address,
    consultationFee,
    convenienceCharge,
    gst,
    total,
  } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const bill = new Bill({
      appointmentId,
      patientId,
      patientName,
      patientEmail: email,
      patientPhone: phone,
      doctorId,
      doctorName,
      appointmentDate,
      department,
      consultationFee,
      convenienceFee: convenienceCharge,
      GST: gst,
      totalAmount: total,
      billingDate,
      address,
      dob,
      nic,
      gender,
    });

    await bill.save();

    // Update the appointment's paymentStatus to 'Unpaid'
    appointment.paymentStatus = "Unpaid";
    await appointment.save();

    res.status(201).json({ message: "Bill created successfully", bill });
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller for fetching a bill by appointment ID
export const getBillByAppointmentId = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const bill = await Bill.findOne({ appointmentId });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json(bill);
  } catch (error) {
    console.error("Error fetching bill:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ FIX: Renamed from "getAllAppointments" to "getAllBills" — the old name was misleading
// and could conflict with the appointment controller's export of the same name.
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate("patientId").populate("doctorId");
    res.status(200).json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: "Server error" });
  }
};