import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { Navbar } from "../Components/Navbar";
import { TicketX } from "lucide-react";
import { TicketCheck } from "lucide-react";

const DoctorHome = () => {
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
  console.log(appointments);
  console.log(appointments.length);
  console.log(typeof appointments);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:8000/api/v1/appoinments/update/${appointmentId}`,
        { status }
        //{ withCredentials: true }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const { firstName, lastName } = JSON.parse(localStorage.getItem("doctor"));
  // console.log(firstName);
  const doc = JSON.parse(localStorage.getItem("doctor"));
  // console.log(doc.avatar.url);
  // console.log(appointments[0].doctor.firstName)
  // console.log(Object.values(/appointments[1]))
  // const k = Object.keys(appointments)[0];
  // console.log(appointments.k.firstName);
  const k = Object.keys(appointments);
  const b = Object.keys(appointments);
  console.log([appointments[0]].firstName);
  console.log(k);
  var c=0;
  appointments.forEach((obj)=>{
    if (obj.doctorId === doc._id){
      c++
    }
  })
  return (
    <div className="w-full h-screen bg-gradient-to-tl from-[#76dbcf]">
      <Navbar />
      <div className="h-28 flex justify-around mt-10">
        <div className="w-1/3 font-semibold text-3xl flex gap-5 items-center">
          <img
            className="w-28 h-28 rounded-full border-2 border-emerald-300"
            src={doc.avatar.url}
            alt=""
          />
          <div className="h-full flex flex-col justify-center">
            <h1>Hi, Dr. {firstName + " " + lastName}</h1>
            <h1>{doc.doctorDepartment}</h1>
          </div>
        </div>
        <div className="w-1/3  flex h-full bg-[#76dbcf] p-4 font-semibold text-2xl rounded-3xl items-center justify-center">
          Appointments Scheduled : {c}
        </div>
      </div>
      <div className="px-28 mt-10">
        <h1 className=" ml-10 font-semibold text-2xl">
          Appointment Details :{" "}
        </h1>
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Status</th>
              <th>Visited</th>
            </tr>
          </thead>
          <tbody className="">
            {k && k.length > 0 ? (
              k.map((k) => (
                <tr className="">
                  {appointments[k].doctor.firstName === firstName &&
                  appointments[k].doctor.lastName === lastName ? (
                    <>
                      <td className="name text-center rounded-l-2xl">
                        {appointments[k].firstName} {appointments[k].lastName}
                      </td>
                      <td className="date text-center">
                        {appointments[k].appointment_date.substring(0, 10)}
                      </td>
                      <td className="status text-center">
                        {/* {appointments[k].status} */}
                        <select
                          id="statusup"
                          className={
                            appointments[k].status === "Pending"
                              ? "value-pending"
                              : appointments[k].status === "Accepted"
                              ? "value-accepted"
                              : "value-rejected"
                          }
                          value={appointments[k].status}
                          onChange={(e) =>
                            handleUpdateStatus(
                              appointments[k]._id,
                              e.target.value
                            )
                          }
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
                      <td className="visited flex justify-center">
                        {appointments[k].hasVisited === true ? (
                          <TicketCheck fill="#00ff1a" className="green" />
                        ) : (
                          <TicketX fill="red" className="red" />
                        )}
                      </td>
                    </>
                  ) : (
                    <h1></h1>
                  )}
                </tr>
              ))
            ) : (
              <h1>No app</h1>
            )}

            {/* {appointments && appointments.length > 0 ? (
              Object.keys(appointments).map((key) => (
                <h1>
                  {key}
                </h1>
              ))
            ) : (
              <h1>one</h1>
            )} */}
            {/* .map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td>{appointment.appointment_date.substring(0, 10)}</td>
                  </tr>
                ))
            ) : (
              <h1>no app</h1>
            )} */}
            {/* {appointments && appointments.length > 0
              ? appointments.filter()
              : hi} */}
            {/* <tr className="">
              <td className="text-center">HI</td>
              <td className="text-center">HI</td>
              <td className="text-center">HI</td>
              <td className="text-center">HI</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorHome;
