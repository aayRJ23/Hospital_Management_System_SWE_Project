import { Bill } from "../models/bill.model.js";
import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";
import { createAndSendNotification } from "./notification.controllers.js";

const getAdminIds = async () => {
  const admins = await User.find({ role: "Admin" }).select("_id");
  return admins.map((a) => a._id);
};

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
    extraCharges,
    gst,
    total,
  } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    const patient = await User.findById(patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const doctor = await User.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

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
      convenienceCharge: convenienceCharge || 0,
      extraCharges: extraCharges || [],
      GST: gst,
      totalAmount: total,
      billingDate,
      address,
      dob,
      nic,
      gender,
    });

    await bill.save();

    appointment.paymentStatus = "Unpaid";
    await appointment.save();

    const formattedDate = new Date(appointmentDate).toDateString();

    const meta = {
      billId: bill._id,
      appointmentId,
      patientName,
      doctorName,
      department,
      appointmentDate: formattedDate,
      totalAmount: total,
      billingDate,
    };

    await createAndSendNotification({
      recipientId: patientId,
      recipientRole: "Patient",
      type: "BILL_GENERATED",
      title: "Bill Generated 🧾",
      message: `A bill of ₹${total} has been generated for your appointment with ${doctorName} on ${formattedDate}. Please complete payment.`,
      meta,
    });

    res.status(201).json({ message: "Bill created successfully", bill });
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getBillByAppointmentId = async (req, res) => {
  const { appointmentId } = req.params;
  try {
    const bill = await Bill.findOne({ appointmentId });
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.status(200).json(bill);
  } catch (error) {
    console.error("Error fetching bill:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate("patientId").populate("doctorId");
    res.status(200).json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markBillAsPaid = async (req, res) => {
  const { billId } = req.params;
  try {
    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    bill.paymentStatus = "Paid";
    await bill.save();

    const appointment = await Appointment.findById(bill.appointmentId);
    if (appointment) {
      appointment.paymentStatus = "Paid";
      await appointment.save();
    }

    const formattedDate = new Date(bill.appointmentDate).toDateString();

    const meta = {
      billId: bill._id,
      appointmentId: bill.appointmentId,
      patientName: bill.patientName,
      doctorName: bill.doctorName,
      department: bill.department,
      appointmentDate: formattedDate,
      totalAmount: bill.totalAmount,
    };

    const adminIds = await getAdminIds();
    for (const adminId of adminIds) {
      await createAndSendNotification({
        recipientId: adminId,
        recipientRole: "Admin",
        type: "BILL_PAID",
        title: "Bill Paid 💰",
        message: `${bill.patientName} has paid ₹${bill.totalAmount} for the appointment with ${bill.doctorName} on ${formattedDate}.`,
        meta,
      });
    }

    await createAndSendNotification({
      recipientId: bill.doctorId,
      recipientRole: "Doctor",
      type: "BILL_PAID",
      title: "Patient Bill Paid 💰",
      message: `${bill.patientName} has paid ₹${bill.totalAmount} for their appointment with you on ${formattedDate}.`,
      meta,
    });

    res.status(200).json({ message: "Bill marked as paid", bill });
  } catch (error) {
    console.error("Error marking bill as paid:", error);
    res.status(500).json({ message: "Server error" });
  }
};
