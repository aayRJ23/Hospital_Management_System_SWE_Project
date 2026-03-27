import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navbar } from "../Components/Navbar";
import "./AppStatus.css";
import Prescribe from "./Prescribe.jsx";
import { useNavigate } from "react-router-dom";

const DoctorHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigateTo = useNavigate();

  // ✅ FIX: Safe guard — if doctor not in localStorage, redirect to login instead of crashing
  const doctorRaw = localStorage.getItem("doctor");
  if (!doctorRaw) {
    navigateTo("/logindoctor");
    return null;
  }
  const {
    firstName,
    lastName,
    doctorDepartment,
    email,
    phone,
    gender,
    nic,
    dob,
    avatar,
    _id,
    doctorConsultationFee,
  } = JSON.parse(doctorRaw);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/appointments/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:8000/api/v1/appointments/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status } : appt
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handlePrescribe = (appointment) => {
    if (appointment.status === "Accepted") {
      setSelectedAppointment(appointment);
    } else {
      toast.error("Please accept the appointment before prescribing.");
    }
  };

  const handleCheckPatient = async (appointment) => {
    if (
      appointment.status === "Accepted" &&
      appointment.patientChecked === "No"
    ) {
      try {
        await axios.put(
          `http://localhost:8000/api/v1/appointments/check/${appointment._id}`,
          { patientChecked: "Yes" },
          { withCredentials: true }
        );
        setAppointments((prev) =>
          prev.map((appt) =>
            appt._id === appointment._id
              ? { ...appt, patientChecked: "Yes" }
              : appt
          )
        );
        toast.success("Patient is checked successfully.");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to check patient");
      }
    } else {
      toast.error("Please accept the appointment before checking.");
    }
  };

  const handleClosePrescribe = () => {
    setSelectedAppointment(null);
  };

  const docAppointments = appointments.filter(
    (appointment) => appointment.doctorId === _id
  );

  return (
    <div className="w-full h-screen bg-gray-200">
      <Navbar />
      <div className="mt-20 pt-10 px-10">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* ✅ FIX: avatar may be undefined if doctor was registered without one — added safe fallback */}
              <img
                className="w-28 h-28 rounded-full border-2 border-emerald-300"
                src={avatar?.url || "/profile.png"}
                alt="Doctor Avatar"
              />
              <div className="ml-6">
                <h1 className="text-3xl font-semibold">
                  Dr. {firstName} {lastName}
                </h1>
                <p className="text-xl">{doctorDepartment}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Phone:</strong> {phone}</p>
                <p><strong>Gender:</strong> {gender}</p>
                <p><strong>NIC:</strong> {nic}</p>
                <p><strong>DOB:</strong> {dob}</p>
                <p><strong>Doctor ID:</strong> {_id}</p>
                <p><strong>Consultation Fee:</strong> ₹{doctorConsultationFee}</p>
              </div>
            </div>
            <div className="bg-[#FA7070] p-4 rounded-lg text-white text-2xl font-semibold">
              Appointments Scheduled: {docAppointments.length}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <h1 className="ml-10 font-semibold text-2xl">Appointment Details:</h1>
          <table className="w-full mt-4 bg-white shadow-md rounded-lg">
            <thead className="bg-[#FA7070] text-white">
              <tr>
                <th className="py-2 px-4 pl-6">#</th>
                <th className="py-2 px-4">Patient</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Appointment Status</th>
                <th className="py-2 px-4">Prescribe</th>
                <th className="py-2 px-4">Checking</th>
              </tr>
            </thead>
            <tbody>
              {docAppointments.length > 0 ? (
                docAppointments.map((appointment, index) => (
                  <tr
                    key={appointment._id}
                    className="border-b border-gray-200 font-bold"
                  >
                    <td className="py-4 px-4 pl-6 text-center rounded-l-lg">{index + 1}</td>
                    <td className="py-4 px-4 text-center rounded-l-lg">
                      {appointment.firstName} {appointment.lastName}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {appointment.appointment_date.substring(0, 10)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <select
                        id="statusup"
                        className={
                          appointment.status === "Pending"
                            ? "value-pending"
                            : appointment.status === "Accepted"
                            ? "value-accepted"
                            : "value-rejected"
                        }
                        value={appointment.status}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pending" className="value-pending">Pending</option>
                        <option value="Accepted" className="value-accepted">Accepted</option>
                        <option value="Rejected" className="value-rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-center rounded-r-lg">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-full"
                        onClick={() => handlePrescribe(appointment)}
                      >
                        Prescribe Patient
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center rounded-r-lg">
                      <button
                        className={`px-4 py-2 rounded-full text-white min-w-[180px] transition-all duration-300 ${
                          appointment.patientChecked === "Yes"
                            ? "bg-blue-700 cursor-not-allowed"
                            : "bg-blue-400"
                        }`}
                        onClick={() => handleCheckPatient(appointment)}
                        disabled={appointment.patientChecked === "Yes"}
                      >
                        {appointment.patientChecked === "Yes"
                          ? "Patient Is Checked"
                          : "Check Patient"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">
                    No Appointments Scheduled
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedAppointment && (
        <Prescribe
          appointment={selectedAppointment}
          onClose={handleClosePrescribe}
        />
      )}
    </div>
  );
};

export default DoctorHome;