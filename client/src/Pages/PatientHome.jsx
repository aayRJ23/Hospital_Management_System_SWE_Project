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
  const navigateTo = useNavigate();

  // ✅ FIX: Safe guard — if patient not in localStorage, redirect to login instead of crashing
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
    <div className="w-full h-screen bg-gray-100">
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
      <div className="pl-8 pr-8 mt-20 pt-5">
        <h1 className="ml-10 font-semibold text-2xl">Appointment Details:</h1>
        <table className="w-full mt-4 bg-white shadow-md rounded-lg">
          <thead className="bg-[#FA7070] text-white">
            <tr>
              <th className="py-2 border-r border-gray-300">#</th>
              <th className="py-2 border-r border-gray-300">Patient Name</th>
              <th className="py-2 border-r border-gray-300">Appointment Date</th>
              <th className="py-2 border-r border-gray-300">Appointment Status</th>
              <th className="py-2 border-r border-gray-300">Doctor Name</th>
              <th className="py-2 border-r border-gray-300">Doctor Department</th>
              <th className="py-2 border-r border-gray-300">Prescription</th>
              <th className="py-2 border-r border-gray-300">Billing & Payment</th>
            </tr>
          </thead>
          <tbody>
            {patAppointments.length > 0 ? (
              patAppointments.map((appointment, index) => (
                <tr key={appointment._id} className="border-b border-gray-200">
                  <td className="py-2 pl-5 text-center font-bold rounded-l-lg border-r border-gray-300">{index + 1}</td>
                  <td className="py-2 text-center font-bold border-r border-gray-300">
                    {appointment.firstName} {appointment.lastName}
                  </td>
                  <td className="py-2 text-center font-bold border-r border-gray-300">
                    {appointment.appointment_date.substring(0, 10)}
                  </td>
                  <td className="py-2 text-center font-bold border-r border-gray-300">{appointment.status}</td>
                  <td className="py-2 text-center font-bold border-r border-gray-300">
                    {appointment.doctor.firstName} {appointment.doctor.lastName}
                  </td>
                  <td className="py-2 text-center font-bold border-r border-gray-300">{appointment.department}</td>
                  <td className="py-2 text-center font-bold rounded-r-lg flex justify-around">
                    {appointment.status === "Pending" && (
                      <button
                        onClick={() => handleCancel(appointment._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
                      >
                        Cancel Appointment
                      </button>
                    )}
                    {appointment.status === "Accepted" && (
                      <button
                        onClick={() => handleGetPrescription(appointment)}
                        className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
                      >
                        Check Prescription
                      </button>
                    )}
                    {appointment.status === "Rejected" && (
                      <button
                        className="bg-red-200 text-red-500 px-4 py-2 rounded-full cursor-not-allowed"
                        disabled
                      >
                        Rejected by Doctor
                      </button>
                    )}
                  </td>
                  <td className="py-2 text-center font-bold border-r border-gray-300">
                    {appointment.paymentStatus === "BillNotSend" && (
                      <button className="bg-gray-400 text-white px-4 py-2 rounded-full cursor-not-allowed" disabled>
                        Bill Not Available
                      </button>
                    )}
                    {appointment.paymentStatus === "Unpaid" && (
                      <div className="flex justify-around">
                        <button
                          onClick={() => handleViewBill(appointment)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
                        >
                          View Bill
                        </button>
                        <button
                          onClick={() => handlePayBill(appointment)}
                          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
                        >
                          Pay Now
                        </button>
                      </div>
                    )}
                    {appointment.paymentStatus === "Paid" && (
                      <div className="flex justify-around">
                        <button
                          onClick={() => handleViewBill(appointment)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
                        >
                          View Bill
                        </button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-full cursor-not-allowed" disabled>
                          Paid
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-500">
                  No Appointments Scheduled
                </td>
              </tr>
            )}
          </tbody>
        </table>
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