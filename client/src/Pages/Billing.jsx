import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import GenerateBill from "../Components/GenerateBill"; // Import the GenerateBill component

const BillingSystem = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchAppointmentId, setSearchAppointmentId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // State to hold the selected appointment
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/appointments/getall",
          {
            withCredentials: true,
          }
        );
        const filteredAppointments = data.appointments.filter(
          (appointment) => appointment.patientChecked === "Yes"
        );
        setAppointments(filteredAppointments);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchAppointments();
  }, []);

  const navigateTo = useNavigate();
  const goToLogin = () => {
    navigateTo("/login");
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesName =
      searchName === "" ||
      appointment.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
      appointment.lastName.toLowerCase().includes(searchName.toLowerCase());
    const matchesAppointmentId =
      searchAppointmentId === "" ||
      appointment._id.toLowerCase().includes(searchAppointmentId.toLowerCase());

    return matchesName && matchesAppointmentId;
  });

  const handleGenerateBill = (appointment) => {
    setSelectedAppointment(appointment); // Set the selected appointment
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedAppointment(null); // Clear the selected appointment
    fetchAppointments(); // Reload the appointments to reflect changes
  };

  return (
    <div className="flex">
      <Sidebar />
      <section className="page messages p-7 w-full">
        <div className="w-full flex justify-center">
          <h1 className="font-bold text-3xl mb-5 text-center bg-red-500 text-white py-2 px-4 rounded-full">
            Billing System
          </h1>
        </div>
        <div className="flex justify-center mb-6">
          <div className="relative mx-2">
            <input
              type="text"
              className="p-2 border border-black rounded-lg w-64"
              placeholder="Search by patient's full name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          <div className="relative mx-2">
            <input
              type="text"
              className="p-2 border border-black rounded-lg w-64"
              placeholder="Search by appointment ID"
              value={searchAppointmentId}
              onChange={(e) => setSearchAppointmentId(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="doc-details p-5 ml-24 pl-14 mt-10">
          {filteredAppointments && filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment, index) => (
              <div
                key={appointment._id}
                className="w-full bg-gray-100 p-6 border border-black rounded-lg shadow-md mb-6 flex flex-col"
              >
                <div className="flex items-start mb-4 pt-3 ">
                  <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 text-lg">
                    {index + 1}
                  </div>
                  <div className=" flex-grow flex justify-between">
                    <div className="pr-4 border-r border-gray-300">
                      <h2 className="text-xl font-bold mb-2">Appointment Details</h2>
                      <p><strong>Appointment ID:</strong> {appointment._id}</p>
                      <p><strong>Appointment Date:</strong> {new Date(appointment.appointment_date).toLocaleDateString()}</p>
                      <p><strong>Department:</strong> {appointment.department}</p>
                    </div>
                    <div className="px-4 border-r border-gray-300">
                      <h2 className="text-xl font-bold mb-2">Patient Details</h2>
                      <p><strong>Patient ID:</strong> {appointment.patientId}</p>
                      <p><strong>Patient Name:</strong> {appointment.firstName} {appointment.lastName}</p>
                      <p><strong>Patient Email:</strong> {appointment.email}</p>
                      <p><strong>Patient Phone:</strong> {appointment.phone}</p>
                    </div>
                    <div className="pl-4">
                      <h2 className="text-xl font-bold mb-2">Doctor Details</h2>
                      <p><strong>Doctor ID:</strong> {appointment.doctorId}</p>
                      <p><strong>Doctor Name:</strong> {appointment.doctor.firstName} {appointment.doctor.lastName}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className={`mt-4 w-1/6 ${
                      appointment.paymentStatus === "BillNotSend"
                        ? "bg-blue-500"
                        : appointment.paymentStatus === "Unpaid"
                        ? "bg-red-500"
                        : "bg-green-500"
                    } text-white py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 min-w-[150px]`}
                    onClick={() => handleGenerateBill(appointment)}
                  >
                    {appointment.paymentStatus === "BillNotSend"
                      ? "Generate Bill"
                      : appointment.paymentStatus === "Unpaid"
                      ? "View Bill (Unpaid)"
                      : "View Bill (Paid)"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <h1 className="text-4xl font-bold text-gray-500 mb-4">
                No Checked Appointments Available
              </h1>
              <p className="text-lg text-gray-400">
                Please add some checked appointments for this Hospital.
              </p>
            </div>
          )}
        </div>
        {showPopup && (
          <GenerateBill closePopup={closePopup} appointment={selectedAppointment} />
        )}
      </section>
    </div>
  );
};

export default BillingSystem;
