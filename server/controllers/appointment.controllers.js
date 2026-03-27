// server/controllers/appointment.controllers.js
import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorHandler from "../middlewares/error.middlewares.js";
import { Appointment } from "../models/appointment.model.js";
import { User } from "../models/user.model.js";
import { createAndSendNotification } from "./notification.controllers.js";

// ─── Helper: get all admin IDs ────────────────────────────────────────────────
const getAdminIds = async () => {
  const admins = await User.find({ role: "Admin" }).select("_id");
  return admins.map((a) => a._id);
};

// ─── POST /appointments ───────────────────────────────────────────────────────
const postAppointment = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;

  if (
    !firstName || !lastName || !email || !phone || !nic || !dob ||
    !gender || !appointment_date || !department ||
    !doctor_firstName || !doctor_lastName || !address
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });

  if (isConflict.length === 0) return next(new ErrorHandler("Doctor not found", 404));
  if (isConflict.length > 1)
    return next(new ErrorHandler("Doctors Conflict! Please Contact Through Email Or Phone!", 400));

  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;

  const appointment = await Appointment.create({
    firstName, lastName, email, phone, nic, dob, gender,
    appointment_date, department,
    doctor: { firstName: doctor_firstName, lastName: doctor_lastName },
    hasVisited, address, doctorId, patientId,
  });

  const patientName = `${firstName} ${lastName}`;
  const doctorName = `Dr. ${doctor_firstName} ${doctor_lastName}`;
  const apptDate = new Date(appointment_date).toDateString();

  const meta = {
    appointmentId: appointment._id,
    patientName,
    doctorName,
    department,
    appointmentDate: apptDate,
    patientEmail: email,
    patientPhone: phone,
  };

  // → Notify Doctor
  await createAndSendNotification({
    recipientId: doctorId,
    recipientRole: "Doctor",
    type: "APPOINTMENT_BOOKED",
    title: "New Appointment Booked",
    message: `${patientName} has booked an appointment with you on ${apptDate} for ${department}.`,
    meta,
  });

  // → Notify all Admins
  const adminIds = await getAdminIds();
  for (const adminId of adminIds) {
    await createAndSendNotification({
      recipientId: adminId,
      recipientRole: "Admin",
      type: "APPOINTMENT_BOOKED",
      title: "New Appointment Booked",
      message: `${patientName} booked an appointment with ${doctorName} on ${apptDate} (${department}).`,
      meta,
    });
  }

  res.status(200).json({
    success: true,
    message: "Appointment Sent!",
    appointment,
  });
});

// ─── GET all appointments ─────────────────────────────────────────────────────
const getAllAppointments = asyncHandler(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({ success: true, appointments });
});

// ─── PUT update appointment status ───────────────────────────────────────────
const updateAppointmentStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let appointment = await Appointment.findById(id);
  if (!appointment) return next(new ErrorHandler("Appointment not found!", 404));

  const previousStatus = appointment.status;

  appointment = await Appointment.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  const newStatus = appointment.status;

  // Only send notification if status actually changed
  if (previousStatus !== newStatus) {
    const doctorName = `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`;
    const patientName = `${appointment.firstName} ${appointment.lastName}`;
    const apptDate = new Date(appointment.appointment_date).toDateString();
    const department = appointment.department;

    const meta = {
      appointmentId: appointment._id,
      patientName,
      doctorName,
      department,
      appointmentDate: apptDate,
      status: newStatus,
      patientEmail: appointment.email,
      patientPhone: appointment.phone,
    };

    let type, title, message;

    if (newStatus === "Accepted") {
      type = "APPOINTMENT_ACCEPTED";
      title = "Appointment Accepted ✅";
      message = `Your appointment with ${doctorName} on ${apptDate} (${department}) has been accepted.`;
    } else if (newStatus === "Rejected") {
      type = "APPOINTMENT_REJECTED";
      title = "Appointment Rejected ❌";
      message = `Your appointment with ${doctorName} on ${apptDate} (${department}) has been rejected. Please rebook.`;
    } else if (newStatus === "Pending") {
      type = "APPOINTMENT_PENDING";
      title = "Appointment Status Reset";
      message = `Your appointment with ${doctorName} on ${apptDate} has been set back to Pending.`;
    }

    if (type) {
      // → Notify Patient
      await createAndSendNotification({
        recipientId: appointment.patientId,
        recipientRole: "Patient",
        type,
        title,
        message,
        meta,
      });

      // → Notify Admins
      const adminIds = await getAdminIds();
      for (const adminId of adminIds) {
        await createAndSendNotification({
          recipientId: adminId,
          recipientRole: "Admin",
          type,
          title: `Appointment ${newStatus}`,
          message: `${doctorName} ${newStatus.toLowerCase()} the appointment of ${patientName} scheduled on ${apptDate}.`,
          meta,
        });
      }
    }
  }

  res.status(200).json({
    success: true,
    message: "Appointment Status Updated!",
  });
});

// ─── DELETE appointment ───────────────────────────────────────────────────────
const deleteAppointment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) return next(new ErrorHandler("Appointment Not Found!", 404));

  const doctorName = `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`;
  const patientName = `${appointment.firstName} ${appointment.lastName}`;
  const apptDate = new Date(appointment.appointment_date).toDateString();

  const meta = {
    appointmentId: appointment._id,
    patientName,
    doctorName,
    department: appointment.department,
    appointmentDate: apptDate,
  };

  // → Notify Patient
  await createAndSendNotification({
    recipientId: appointment.patientId,
    recipientRole: "Patient",
    type: "APPOINTMENT_DELETED",
    title: "Appointment Cancelled 🗑️",
    message: `Your appointment with ${doctorName} on ${apptDate} has been cancelled by the admin.`,
    meta,
  });

  // → Notify Doctor
  await createAndSendNotification({
    recipientId: appointment.doctorId,
    recipientRole: "Doctor",
    type: "APPOINTMENT_DELETED",
    title: "Appointment Cancelled",
    message: `The appointment of ${patientName} on ${apptDate} has been cancelled by the admin.`,
    meta,
  });

  await appointment.deleteOne();
  res.status(200).json({ success: true, message: "Appointment Deleted!" });
});

// ─── PUT schedule video call ──────────────────────────────────────────────────
const scheduleVideoCall = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { scheduledDate, scheduledTime } = req.body;

  let appointment = await Appointment.findById(id);
  if (!appointment) return next(new ErrorHandler("Appointment not found!", 404));

  const roomName = `hmsconsult${id.toString().slice(-6)}${Date.now().toString().slice(-6)}`;
  const videoCallLink = `https://meet.jit.si/${roomName}`;

  appointment.videoCallLink = videoCallLink;
  appointment.scheduledDate = scheduledDate;
  appointment.scheduledTime = scheduledTime;
  await appointment.save();

  const doctorName = `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`;

  // → Notify Patient
  await createAndSendNotification({
    recipientId: appointment.patientId,
    recipientRole: "Patient",
    type: "VIDEO_CALL_SCHEDULED",
    title: "Video Call Scheduled 📹",
    message: `${doctorName} has scheduled a video call with you on ${scheduledDate} at ${scheduledTime}.`,
    meta: {
      appointmentId: appointment._id,
      doctorName,
      scheduledDate,
      scheduledTime,
      videoCallLink,
      department: appointment.department,
    },
  });

  res.status(200).json({
    success: true,
    message: "Video call scheduled successfully!",
    videoCallLink,
    scheduledDate,
    scheduledTime,
  });
});

// ─── PUT update check status (patient checked in) ────────────────────────────
const updateCheckStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let appointment = await Appointment.findById(id);
  if (!appointment) return next(new ErrorHandler("Appointment not found!", 404));

  appointment.patientChecked = req.body.patientChecked;
  await appointment.save();

  if (req.body.patientChecked === true) {
    const patientName = `${appointment.firstName} ${appointment.lastName}`;
    const doctorName = `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`;
    const apptDate = new Date(appointment.appointment_date).toDateString();

    const meta = {
      appointmentId: appointment._id,
      patientName,
      doctorName,
      department: appointment.department,
      appointmentDate: apptDate,
    };

    // → Notify Admins
    const adminIds = await getAdminIds();
    for (const adminId of adminIds) {
      await createAndSendNotification({
        recipientId: adminId,
        recipientRole: "Admin",
        type: "PATIENT_CHECKED",
        title: "Patient Checked In ✅",
        message: `${patientName} has been checked in for their appointment with ${doctorName} on ${apptDate}.`,
        meta,
      });
    }
  }

  res.status(200).json({
    success: true,
    message: "Patient is checked successfully",
  });
});

export {
  postAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  updateCheckStatus,
  scheduleVideoCall,
};