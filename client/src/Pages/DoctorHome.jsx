import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navbar } from "../Components/Navbar";
import { TicketX, TicketCheck,CircleCheckBig,CircleX } from "lucide-react";
import './AppStatus.css';
import Prescribe from "./Prescribe.jsx";

const DoctorHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:8000/api/v1/appoinments/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status } : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handlePrescribe = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleClosePrescribe = () => {
    setSelectedAppointment(null);
  };

  const { firstName, lastName, doctorDepartment, email, phoneNumber, gender, nic, dob, avatar } = JSON.parse(localStorage.getItem("doctor"));
  const doc = JSON.parse(localStorage.getItem("doctor"));

  const docAppointments = appointments.filter(appointment => appointment.doctorId === doc._id);

  return (
    <div className="w-full h-screen bg-gray-200">
      <Navbar />
      <div className="mt-20 pt-10 px-10">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                className="w-28 h-28 rounded-full border-2 border-emerald-300"
                src={avatar.url}
                alt=""
              />
              <div className="ml-6">
                <h1 className="text-3xl font-semibold">Dr. {firstName} {lastName}</h1>
                <p className="text-xl">{doctorDepartment}</p>
                <p>Email: {email}</p>
                <p>Phone: {phoneNumber}</p>
                <p>Gender: {gender}</p>
                <p>NIC: {nic}</p>
                <p>DOB: {dob}</p>
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
                <th className="py-2 px-4">Patient</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Visited</th>
                <th className="py-2 px-4">Prescribe</th>
              </tr>
            </thead>
            <tbody>
              {docAppointments.length > 0 ? (
                docAppointments.map((appointment) => (
                  <tr key={appointment._id} className="border-b border-gray-200 font-bold">
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
                        onChange={(e) => handleUpdateStatus(appointment._id, e.target.value)}
                      >
                        <option value="Pending" className="value-pending">
                          Pending
                        </option>
                        <option value="Accepted" className="value-accepted">
                          Accepted
                        </option>
                        <option value="Rejected" className="value-rejected">
                          Rejected
                        </option>
                      </select>
                    </td>
                    <td className="py-4 px-4 flex justify-center mt-2 text-center">
                      {appointment.hasVisited ? (
                        <CircleCheckBig className="green" />
                      ) : (
                        <CircleX className="red" />
                      )}
                    </td>
                    <td className="py-4 px-4 text-center rounded-r-lg">
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-full"
                        onClick={() => handlePrescribe(appointment)}
                      >
                        Prescribe
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
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
