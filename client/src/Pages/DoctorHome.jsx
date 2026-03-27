// client/src/Pages/DoctorHome.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navbar } from "../Components/Navbar";
import "./AppStatus.css";
import Prescribe from "./Prescribe.jsx";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../Components/NotificationBell";

const DoctorHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Video call scheduling popup state
  const [videoPopupAppointment, setVideoPopupAppointment] = useState(null);
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [schedulingLoading, setSchedulingLoading] = useState(false);

  const navigateTo = useNavigate();

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

  useEffect(() => {
    fetchAppointments();
  }, []);

  // When doctor changes status to Accepted -> open video scheduling popup
  const handleUpdateStatus = async (appointmentId, status, appointment) => {
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

      if (status === "Accepted") {
        const appt = appointments.find((a) => a._id === appointmentId) || appointment;
        const defaultDate = appt?.appointment_date
          ? appt.appointment_date.substring(0, 10)
          : new Date().toISOString().substring(0, 10);
        setSchedDate(defaultDate);
        setSchedTime("10:00");
        setVideoPopupAppointment({ ...appt, _id: appointmentId, status: "Accepted" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleScheduleVideoCall = async () => {
    if (!schedDate || !schedTime) {
      toast.error("Please select both date and time.");
      return;
    }
    setSchedulingLoading(true);
    try {
      await axios.put(
        `http://localhost:8000/api/v1/appointments/schedule-video/${videoPopupAppointment._id}`,
        { scheduledDate: schedDate, scheduledTime: schedTime },
        { withCredentials: true }
      );
      toast.success("Video call scheduled! Link generated successfully.");
      setVideoPopupAppointment(null);
      await fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to schedule video call");
    } finally {
      setSchedulingLoading(false);
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
    if (appointment.status === "Accepted" && appointment.patientChecked === "No") {
      try {
        await axios.put(
          `http://localhost:8000/api/v1/appointments/check/${appointment._id}`,
          { patientChecked: "Yes" },
          { withCredentials: true }
        );
        setAppointments((prev) =>
          prev.map((appt) =>
            appt._id === appointment._id ? { ...appt, patientChecked: "Yes" } : appt
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

  const handleClosePrescribe = () => setSelectedAppointment(null);

  const docAppointments = appointments.filter(
    (appointment) => appointment.doctorId === _id
  );

  return (
    <div className="w-full min-h-screen bg-gray-200">
      <Navbar />

      {/* ── Notification Bell fixed top-right (above Navbar's z-index range) ── */}
      <div className="fixed top-4 right-4 z-50">
        <NotificationBell />
      </div>

      <div className="mt-20 pt-10 px-10">
        {/* Doctor Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
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
                <p><strong>Consultation Fee:</strong> Rs.{doctorConsultationFee}</p>
              </div>
            </div>
            <div className="bg-[#FA7070] p-4 rounded-lg text-white text-2xl font-semibold">
              Appointments Scheduled: {docAppointments.length}
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="mt-10 pb-10">
          <h1 className="ml-2 font-semibold text-2xl mb-4">Appointment Details:</h1>
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg text-sm">
              <thead className="bg-[#FA7070] text-white">
                <tr>
                  <th className="py-3 px-3 text-center whitespace-nowrap">#</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap">Patient</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap">Date</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap">Appointment Status</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap">Scheduled Date</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap">Scheduled Time</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap">Video Call</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap">Prescribe</th>
                  <th className="py-3 px-3 text-center whitespace-nowrap">Checking</th>
                </tr>
              </thead>
              <tbody>
                {docAppointments.length > 0 ? (
                  docAppointments.map((appointment, index) => (
                    <tr
                      key={appointment._id}
                      className="border-b border-gray-200 font-bold"
                    >
                      <td className="py-4 px-3 text-center">{index + 1}</td>
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        {appointment.firstName} {appointment.lastName}
                      </td>
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        {appointment.appointment_date.substring(0, 10)}
                      </td>
                      <td className="py-4 px-3 text-center">
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
                            handleUpdateStatus(appointment._id, e.target.value, appointment)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        {appointment.scheduledDate ? (
                          <span className="text-green-700">{appointment.scheduledDate}</span>
                        ) : (
                          <span className="text-gray-400 font-normal italic text-xs">Not Scheduled</span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-center whitespace-nowrap">
                        {appointment.scheduledTime ? (
                          <span className="text-green-700">{appointment.scheduledTime}</span>
                        ) : (
                          <span className="text-gray-400 font-normal italic text-xs">Not Scheduled</span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-center">
                        {appointment.videoCallLink ? (
                          <a
                            href={`/video-call?room=${encodeURIComponent(appointment.videoCallLink)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition-all duration-300 text-xs whitespace-nowrap"
                          >
                            Join Video Call
                          </a>
                        ) : appointment.status === "Accepted" ? (
                          <button
                            onClick={() => {
                              const defaultDate = appointment.appointment_date
                                ? appointment.appointment_date.substring(0, 10)
                                : new Date().toISOString().substring(0, 10);
                              setSchedDate(defaultDate);
                              setSchedTime("10:00");
                              setVideoPopupAppointment(appointment);
                            }}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full transition-all duration-300 text-xs whitespace-nowrap"
                          >
                            Schedule Call
                          </button>
                        ) : (
                          <span className="text-gray-400 font-normal italic text-xs whitespace-nowrap">No Link Generated</span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-center">
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded-full whitespace-nowrap text-xs"
                          onClick={() => handlePrescribe(appointment)}
                        >
                          Prescribe Patient
                        </button>
                      </td>
                      <td className="py-4 px-3 text-center">
                        <button
                          className={`px-4 py-2 rounded-full text-white whitespace-nowrap text-xs transition-all duration-300 ${
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
                    <td colSpan="9" className="py-4 text-center text-gray-500">
                      No Appointments Scheduled
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Prescribe Modal */}
      {selectedAppointment && (
        <Prescribe
          appointment={selectedAppointment}
          onClose={handleClosePrescribe}
        />
      )}

      {/* Video Call Scheduling Popup */}
      {videoPopupAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setVideoPopupAppointment(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold leading-none"
            >
              &times;
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-purple-100 p-3 rounded-full text-2xl">📹</div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Schedule Video Consultation</h2>
                <p className="text-sm text-gray-500">
                  Patient: {videoPopupAppointment.firstName} {videoPopupAppointment.lastName}
                </p>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-5 text-sm text-purple-700">
              A unique Jitsi video call link will be auto-generated and visible to both you and the patient after you confirm.
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Consultation Date
              </label>
              <input
                type="date"
                value={schedDate}
                onChange={(e) => setSchedDate(e.target.value)}
                min={new Date().toISOString().substring(0, 10)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                Default set to appointment date: {videoPopupAppointment.appointment_date?.substring(0, 10)}
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Consultation Time
              </label>
              <input
                type="time"
                value={schedTime}
                onChange={(e) => setSchedTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setVideoPopupAppointment(null)}
                className="flex-1 border border-gray-300 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-100 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleVideoCall}
                disabled={schedulingLoading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white px-4 py-2 rounded-full transition font-semibold"
              >
                {schedulingLoading ? "Generating..." : "Generate & Save Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorHome;