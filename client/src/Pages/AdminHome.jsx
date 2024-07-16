import React, { useContext, useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { Context } from "../main";
import axios from "axios";

const AdminHome = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/doctors",
          { withCredentials: true }
        );
        console.log(response.data);
        if (response.data.success) {
          setIsAuthenticated(true);
          setDoctors(response.data.data);
        } else {
          console.log("Failed to fetch doctors: ", response.data.message);
        }
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchDoctors();
  }, []);

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

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/patient",
          { withCredentials: true }
        );
        console.log(response.data);
        if (response.data.success) {
          setIsAuthenticated(true);
          setPatients(response.data.data);
        } else {
          console.log("Failed to fetch patients: ", response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/admin/",
          { withCredentials: true }
        );
        console.log(response.data);
        if (response.data.success) {
          setIsAuthenticated(true);
          setAdmins(response.data.data);
        } else {
          console.log("Failed to fetch admins: ", response.data.message);
        }
      } catch (error) {
        console.log(error.response?.data?.message || "Failed to fetch admins");
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  const { firstName, lastName } = JSON.parse(localStorage.getItem("admin"));

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full pt-8 pr-8 pl-14 ml-8">
        <div className="w-full bg-sky-100 h-fit rounded-2xl p-5 flex flex-col items-center mb-5">
          <h1 className="text-4xl font-semibold mb-8">
            Hi, {firstName + " " + lastName}
          </h1>
          <div className="flex w-full gap-10 mb-4">
            <div className="w-1/2 bg-[#FA7070] rounded-xl p-8 font-semibold text-2xl flex justify-between">
              <h1>Total No. Of Admins:</h1>
              <h1>{admins.length}</h1>
            </div>
            <div className="w-1/2 bg-[#FA7070] rounded-xl p-8 font-semibold text-2xl flex justify-between">
              <h1>Total No. Of Doctors :</h1>
              <h1>{doctors.length}</h1>
            </div>
            <div className="w-1/2 bg-[#FA7070] rounded-xl p-8 font-semibold text-2xl flex justify-between">
              <h1>Total No. Of Patients:</h1>
              <h1>{patients.length}</h1>
            </div>
            <div className="w-1/2 bg-[#FA7070] rounded-xl p-8 font-semibold text-2xl flex justify-between">
              <h1>Total No. Of Appointments :</h1>
              <h1>{appointments.length}</h1>
            </div>
          </div>
        </div>

        <div className="w-full bg-[#FA7070] h-fit rounded-2xl p-5 flex flex-col items-center mb-5">
          <h1 className="text-2xl font-bold mb-4 text-center">
            List Of All Admins
          </h1>
          <div className="w-full max-h-80 overflow-y-scroll">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    #
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Name
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Email
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Phone
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Gender
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.length > 0 ? (
                  admins.map((admin, index) => (
                    <tr key={admin._id} className="border-b">
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">{`${admin.firstName} ${admin.lastName}`}</td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {admin.email}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {admin.phone}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {admin.gender}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-2 px-4 text-center border border-gray-300 font-bold"
                    >
                      No admins found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full bg-[#FA7070] h-fit rounded-2xl p-5 flex flex-col items-center mb-5">
          <h1 className="text-2xl font-bold mb-4 text-center">
            List Of All Doctors
          </h1>
          <div className="w-full max-h-80 overflow-y-scroll">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    #
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Name
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Email
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Phone
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Gender
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    DOB
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    NIC
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Doctor Department
                  </th>
                </tr>
              </thead>
              <tbody>
                {doctors.length > 0 ? (
                  doctors.map((doctor, index) => (
                    <tr key={doctor._id} className="border-b">
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">{`${doctor.firstName} ${doctor.lastName}`}</td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {doctor.email}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {doctor.phone}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {doctor.gender}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {doctor.dob}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {doctor.nic}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {doctor.doctorDepartment}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="py-2 px-4 text-center border border-gray-300 font-bold"
                    >
                      No doctors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full bg-[#FA7070] h-fit rounded-2xl p-5 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4 text-center">
            List Of All Patients
          </h1>
          <div className="w-full max-h-80 overflow-y-scroll">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    #
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Name
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Email
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Phone
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Gender
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    DOB
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    NIC
                  </th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? (
                  patients.map((patient, index) => (
                    <tr key={patient._id} className="border-b">
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">{`${patient.firstName} ${patient.lastName}`}</td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {patient.email}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {patient.phone}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {patient.gender}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {patient.dob}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {patient.nic}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-2 px-4 text-center border border-gray-300 font-bold"
                    >
                      No patients found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 w-full bg-[#FA7070] h-fit rounded-2xl p-5 flex flex-col items-center mb-5">
          <h1 className="text-2xl font-bold mb-4 text-center">
            List Of All Appointments
          </h1>
          <div className="w-full max-h-80 overflow-y-scroll">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    #
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Name
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Email
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Phone
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    DOB
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Gender
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Appointment Date
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Department
                  </th>
                  <th className="py-2 px-4 text-center border border-gray-300">
                    Doctor
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appointment, index) => (
                    <tr key={appointment._id} className="border-b">
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {index + 1}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {`${appointment.firstName} ${appointment.lastName}`}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {appointment.email}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {appointment.phone}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {new Date(appointment.dob).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {appointment.gender}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {new Date(
                          appointment.appointment_date
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {appointment.department}
                      </td>
                      <td className="py-2 px-4 text-center border border-gray-300 font-bold">
                        {`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="py-2 px-4 text-center border border-gray-300 font-bold"
                    >
                      No appointments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
