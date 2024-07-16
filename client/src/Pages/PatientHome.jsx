import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { Navbar } from "../Components/Navbar";
import { TicketX, TicketCheck } from "lucide-react";

const PatientHome = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/appoinments/getall",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  const { firstName, lastName, email, phone, gender, nic, dob } = JSON.parse(localStorage.getItem("patient"));
  const pat = JSON.parse(localStorage.getItem("patient"));
  const k = Object.keys(appointments);
  const b = k;
  var c = 0;
  appointments.forEach((obj) => {
    if (obj.patientId === pat._id) {
      c++;
    }
  });

  const handleCancel = async (id) => {
    try {
      console.log(`Attempting to delete appointment with ID: ${id}`);
      const response = await axios.delete(`http://localhost:8000/api/v1/appoinments/delete/${id}`, { withCredentials: true });
      setAppointments(appointments.filter((appointment) => appointment._id !== id));
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      console.error("Error response:", error.response); // Log the full error response
      toast.error("Failed to cancel the appointment");
    }
  };

  const handleGetPrescription = (appointmentId) => {
    // Implement logic to navigate to the prescription page or fetch prescription details
    console.log(`Getting prescription for appointment ID: ${appointmentId}`);
  };

  return (
    <div className="w-full h-screen bg-gray-100">
      <Navbar />
      <div className="mt-20 pt-10 h-28 flex justify-around px-60">
        <div className=" w-1/3 font-semibold text-3xl flex gap-5 items-center bg-white border border-black rounded-lg p-10 pt-20 pb-20">
          <div className="h-full flex flex-col justify-center text-sm">
            <h1 className="text-lg">Hi, {firstName + " " + lastName}</h1>
            <p>Email: {email}</p>
            <p>Phone: {phone}</p>
            <p>Gender: {gender}</p>
            <p>NIC: {nic}</p>
            <p>DOB: {dob}</p>
          </div>
        </div>
        <div className=" w-1/3 flex h-full bg-[#FA7070] px-4 font-semibold text-2xl rounded-3xl items-center justify-center text-white">
          Appointments Scheduled: {c}
        </div>
      </div>
      <div className="px-28 mt-20 pt-5">
        <h1 className="ml-10 font-semibold text-2xl">Appointment Details:</h1>
        <table className="w-full mt-4 bg-white shadow-md rounded-lg">
          <thead className="bg-[#FA7070] text-white">
            <tr>
              <th className="py-2">Patient Name</th>
              <th className="py-2">Appointment Date</th>
              <th className="py-2">Appointment Status</th>
              <th className="py-2">Doctor Name</th>
              <th className="py-2">Doctor Department</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments && appointments.length > 0 ? (
              appointments.map((appointment) =>
                appointment.patientId === pat._id ? (
                  <tr key={appointment._id} className="border-b border-gray-200">
                    <td className="py-2 text-center font-bold rounded-l-lg">
                      {appointment.firstName} {appointment.lastName}
                    </td>
                    <td className="py-2 text-center font-bold">
                      {appointment.appointment_date.substring(0, 10)}
                    </td>
                    <td className="py-2 text-center font-bold">{appointment.status}</td>
                    <td className="py-2 text-center font-bold">
                      {appointment.doctor.firstName} {appointment.doctor.lastName}
                    </td>
                    <td className="py-2 text-center font-bold">{appointment.department}</td>
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
                          onClick={() => handleGetPrescription(appointment._id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
                        >
                          Get Prescription
                        </button>
                      )}
                    </td>
                  </tr>
                ) : null
              )
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No Appointment Scheduled
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientHome;
