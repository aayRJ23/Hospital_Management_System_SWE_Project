import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navbar } from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import Describe from "./Describe.jsx";
import ReceiveBill from "../Components/ReceiveBill.jsx";
import PayBillPortal from "../Components/PayBillPortal";

const PatientHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewBillAppointment, setViewBillAppointment] = useState(null);
  const [payBillAppointment, setPayBillAppointment] = useState(null);
  // Track which appointmentIds have a prescription submitted by doctor
  const [prescriptionExists, setPrescriptionExists] = useState({});
  const navigateTo = useNavigate();

  const patientRaw = localStorage.getItem("patient");
  if (!patientRaw) {
    navigateTo("/login");
    return null;
  }
  const { firstName, lastName, email, phone, gender, nic, dob, _id } =
    JSON.parse(patientRaw);

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

  // Once appointments load, check prescription existence for each Accepted appointment
  useEffect(() => {
    const checkPrescriptions = async () => {
      const patAppts = appointments.filter(
        (a) => a.patientId === _id && a.status === "Accepted"
      );
      const results = {};
      await Promise.all(
        patAppts.map(async (appt) => {
          try {
            await axios.get(
              `http://localhost:8000/api/v1/prescribe/getPrescribe/${appt._id}`,
              { withCredentials: true }
            );
            results[appt._id] = true; // prescription exists
          } catch {
            results[appt._id] = false; // no prescription yet
          }
        })
      );
      setPrescriptionExists(results);
    };

    if (appointments.length > 0) {
      checkPrescriptions();
    }
  }, [appointments]);

  const patAppointments = appointments.filter(
    (appointment) => appointment.patientId === _id
  );

  const handleCancel = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/appointments/delete/${id}`,
        { withCredentials: true }
      );
      setAppointments(appointments.filter((appt) => appt._id !== id));
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel the appointment");
    }
  };

  const handleGetPrescription = (appointment) => setSelectedAppointment(appointment);
  const handleViewBill = (appointment) => setViewBillAppointment(appointment);
  const handlePayBill = (appointment) => setPayBillAppointment(appointment);
  const handleCloseDescribe = () => setSelectedAppointment(null);
  const handleCloseViewBill = () => setViewBillAppointment(null);
  const handleClosePayBill = () => setPayBillAppointment(null);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Navbar />
      <div className="mt-20 pt-10 h-28 flex justify-around px-60">
        <div className="w-2/5 font-semibold text-3xl flex gap-5 items-center bg-white border border-black rounded-lg p-10 pt-20 pb-20">
          <div className="h-full flex flex-col justify-center text-sm">
            <h1 className="text-2xl">Hi, {firstName + " " + lastName}</h1>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Gender: </strong>{gender}</p>
            <p><strong>NIC:</strong> {nic}</p>
            <p><strong>DOB:</strong> {dob}</p>
            <p><strong>Patient ID: </strong>{_id}</p>
          </div>
        </div>
        <div className="w-1/3 flex h-full bg-[#FA7070] px-4 font-semibold text-2xl rounded-3xl items-center justify-center text-white">
          Appointments Scheduled: {patAppointments.length}
        </div>
      </div>

      <div className="pl-8 pr-8 mt-20 pt-5 pb-10">
        <h1 className="ml-10 font-semibold text-2xl mb-4">Appointment Details:</h1>
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg text-sm">
            <thead className="bg-[#FA7070] text-white">
              <tr>
                <th className="py-2 px-3 border-r border-red-400 whitespace-nowrap">#</th>
                <th className="py-2 px-3 border-r border-red-400 whitespace-nowrap">Patient Name</th>
                <th className="py-2 px-3 border-r border-red-400 whitespace-nowrap">Appointment Date</th>
                <th className="py-2 px-3 border-r border-red-400 whitespace-nowrap">Appointment Status</th>
                <th className="py-2 px-3 border-r border-red-400 whitespace-nowrap">Doctor Name</th>
                <th className="py-2 px-3 border-r border-red-400 whitespace-nowrap">Doctor Department</th>
                <th className="py-2 px-3 border-r border-red-400 whitespace-nowrap">Scheduled Date</th>
                <th className="py-2 px-3 border-r border-red-400 whitespace-nowrap">Scheduled Time</th>
                <th className="py-2 px-3 border-r border-red-400 whitespace-nowrap">Video Call</th>
                <th className="py-2 px-3 border-r border-red-400 whitespace-nowrap">Prescription</th>
                <th className="py-2 px-3 whitespace-nowrap">Billing & Payment</th>
              </tr>
            </thead>
            <tbody>
              {patAppointments.length > 0 ? (
                patAppointments.map((appointment, index) => (
                  <tr key={appointment._id} className="border-b border-gray-200">
                    {/* # */}
                    <td className="py-2 px-3 text-center font-bold border-r border-gray-200">{index + 1}</td>

                    {/* Patient Name */}
                    <td className="py-2 px-3 text-center font-bold border-r border-gray-200 whitespace-nowrap">
                      {appointment.firstName} {appointment.lastName}
                    </td>

                    {/* Appointment Date */}
                    <td className="py-2 px-3 text-center font-bold border-r border-gray-200 whitespace-nowrap">
                      {appointment.appointment_date.substring(0, 10)}
                    </td>

                    {/* Status */}
                    <td className="py-2 px-3 text-center font-bold border-r border-gray-200">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs ${
                          appointment.status === "Accepted"
                            ? "bg-green-500"
                            : appointment.status === "Rejected"
                            ? "bg-red-500"
                            : "bg-yellow-400"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    {/* Doctor Name */}
                    <td className="py-2 px-3 text-center font-bold border-r border-gray-200 whitespace-nowrap">
                      {appointment.doctor.firstName} {appointment.doctor.lastName}
                    </td>

                    {/* Doctor Department */}
                    <td className="py-2 px-3 text-center font-bold border-r border-gray-200 whitespace-nowrap">
                      {appointment.department}
                    </td>

                    {/* Scheduled Date */}
                    <td className="py-2 px-3 text-center font-bold border-r border-gray-200 whitespace-nowrap">
                      {appointment.scheduledDate ? (
                        <span className="text-green-700">{appointment.scheduledDate}</span>
                      ) : (
                        <span className="text-gray-400 font-normal italic text-xs">Not Scheduled</span>
                      )}
                    </td>

                    {/* Scheduled Time */}
                    <td className="py-2 px-3 text-center font-bold border-r border-gray-200 whitespace-nowrap">
                      {appointment.scheduledTime ? (
                        <span className="text-green-700">{appointment.scheduledTime}</span>
                      ) : (
                        <span className="text-gray-400 font-normal italic text-xs">Not Scheduled</span>
                      )}
                    </td>

                    {/* Video Call */}
                    <td className="py-2 px-3 text-center font-bold border-r border-gray-200">
                      {appointment.videoCallLink ? (
                        <a
                          href={`/video-call?room=${encodeURIComponent(appointment.videoCallLink)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-full transition-all duration-300 text-xs whitespace-nowrap"
                        >
                          Join Video Call
                        </a>
                      ) : (
                        <span className="text-gray-400 font-normal italic text-xs whitespace-nowrap">No Link Yet</span>
                      )}
                    </td>

                    {/* Prescription */}
                    <td className="py-2 px-3 text-center font-bold border-r border-gray-200">
                      {appointment.status === "Pending" && (
                        <button
                          onClick={() => handleCancel(appointment._id)}
                          className="bg-red-500 text-white px-4 py-1.5 rounded-full hover:bg-red-600 transition duration-300 text-xs whitespace-nowrap"
                        >
                          Cancel Appointment
                        </button>
                      )}
                      {appointment.status === "Accepted" && (
                        prescriptionExists[appointment._id] === true ? (
                          // Prescription submitted by doctor — allow viewing
                          <button
                            onClick={() => handleGetPrescription(appointment)}
                            className="bg-green-500 text-white px-4 py-1.5 rounded-full hover:bg-green-600 transition duration-300 text-xs whitespace-nowrap"
                          >
                            Check Prescription
                          </button>
                        ) : (
                          // No prescription yet — show disabled button
                          <button
                            disabled
                            className="bg-gray-300 text-gray-500 px-4 py-1.5 rounded-full cursor-not-allowed text-xs whitespace-nowrap"
                            title="Doctor has not submitted a prescription yet"
                          >
                            Not Prescribed Yet
                          </button>
                        )
                      )}
                      {appointment.status === "Rejected" && (
                        <button
                          className="bg-red-200 text-red-500 px-4 py-1.5 rounded-full cursor-not-allowed text-xs whitespace-nowrap"
                          disabled
                        >
                          Rejected by Doctor
                        </button>
                      )}
                    </td>

                    {/* Billing & Payment */}
                    <td className="py-2 px-3 text-center font-bold">
                      {appointment.paymentStatus === "BillNotSend" && (
                        <button className="bg-gray-400 text-white px-4 py-1.5 rounded-full cursor-not-allowed text-xs whitespace-nowrap" disabled>
                          Bill Not Available
                        </button>
                      )}
                      {appointment.paymentStatus === "Unpaid" && (
                        <div className="flex flex-col gap-2 items-center">
                          <button
                            onClick={() => handleViewBill(appointment)}
                            className="bg-blue-500 text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition duration-300 text-xs whitespace-nowrap"
                          >
                            View Bill
                          </button>
                          <button
                            onClick={() => handlePayBill(appointment)}
                            className="bg-red-500 text-white px-4 py-1.5 rounded-full hover:bg-red-600 transition duration-300 text-xs whitespace-nowrap"
                          >
                            Pay Now
                          </button>
                        </div>
                      )}
                      {appointment.paymentStatus === "Paid" && (
                        <div className="flex flex-col gap-2 items-center">
                          <button
                            onClick={() => handleViewBill(appointment)}
                            className="bg-blue-500 text-white px-4 py-1.5 rounded-full hover:bg-blue-600 transition duration-300 text-xs whitespace-nowrap"
                          >
                            View Bill
                          </button>
                          <button className="bg-green-500 text-white px-4 py-1.5 rounded-full cursor-not-allowed text-xs whitespace-nowrap" disabled>
                            Paid
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="py-4 text-center text-gray-500">
                    No Appointments Scheduled
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAppointment && (
        <Describe appointment={selectedAppointment} onClose={handleCloseDescribe} />
      )}
      {viewBillAppointment && (
        <ReceiveBill appointment={viewBillAppointment} closePopup={handleCloseViewBill} />
      )}
      {payBillAppointment && (
        <PayBillPortal appointment={payBillAppointment} closePopup={handleClosePayBill} />
      )}
    </div>
  );
};

export default PatientHome;