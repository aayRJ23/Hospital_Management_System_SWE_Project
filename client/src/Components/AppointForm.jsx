import React, { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdPerson, MdEmail, MdPhone, MdFingerprint, MdCake, MdLocationOn, MdEvent, MdWc } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";

const AppointForm = ({ data, onClose }) => {
  if (!data) return null;
  console.log(data);

  const docfirst = data.firstName;
  const doclast = data.lastName;
  const dept = data.doctorDepartment;
  console.log(docfirst, doclast, dept);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

  const handleAppointment = async (e) => {
    e.preventDefault();
    try {
      const hasVisitedBool = Boolean(hasVisited);
      const response = await axios.post(
        "http://localhost:8000/api/v1/appoinments/post",
        {
          firstName,
          lastName,
          email,
          phone,
          nic,
          dob,
          gender,
          appointment_date: appointmentDate,
          department: dept,
          doctor_firstName: docfirst,
          doctor_lastName: doclast,
          hasVisited: hasVisitedBool,
          address,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      clearFields();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const clearFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setNic("");
    setDob("");
    setGender("");
    setAppointmentDate("");
    setAddress("");
    setHasVisited(false);
  };

  return (
    <div className="mt-5 fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center overflow-y-auto">
  <div className="w-2/3 flex flex-col border border-black rounded-2xl bg-white p-6 max-h-screen overflow-y-auto">
        <button onClick={onClose} className="place-self-end mb-3">
          <IoMdCloseCircleOutline size={30} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="font-semibold text-2xl mb-3">Schedule Your Appointment</h1>
          <form className="w-full flex flex-col justify-center items-center" onSubmit={handleAppointment}>
            <div className="w-full flex flex-col md:flex-row justify-between mb-6">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <label className="text-blue-800 mb-2 flex items-center">
                  <MdPerson className="mr-2" /> First Name
                </label>
                <input
                  className="w-full h-12 bg-zinc-100 rounded-lg px-4 border border-gray-300 transform transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <label className="text-blue-800 mb-2 flex items-center">
                  <MdPerson className="mr-2" /> Last Name
                </label>
                <input
                  className="w-full h-12 bg-zinc-100 rounded-lg px-4 border border-gray-300 transform transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row justify-between mb-6">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <label className="text-blue-800 mb-2 flex items-center">
                  <MdEmail className="mr-2" /> Email
                </label>
                <input
                  className="w-full h-12 bg-zinc-100 rounded-lg px-4 border border-gray-300 transform transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <label className="text-blue-800 mb-2 flex items-center">
                  <MdPhone className="mr-2" /> Phone No
                </label>
                <input
                  className="w-full h-12 bg-zinc-100 rounded-lg px-4 border border-gray-300 transform transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  type="number"
                  placeholder="Phone No"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row justify-between mb-6">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <label className="text-blue-800 mb-2 flex items-center">
                  <MdFingerprint className="mr-2" /> Aadhar No.
                </label>
                <input
                  className="w-full h-12 bg-zinc-100 rounded-lg px-4 border border-gray-300 transform transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Aadhar No."
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <label className="text-blue-800 mb-2 flex items-center">
                  <MdCake className="mr-2" /> Dob
                </label>
                <input
                  className="w-full h-12 bg-zinc-100 rounded-lg px-4 border border-gray-300 transform transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="Dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row justify-between mb-6">
              <div className="w-full md:w-1/2 px-2 mb-4 md:mb-0">
                <label className="text-blue-800 mb-2 flex items-center">
                  <MdWc className="mr-2" /> Gender
                </label>
                <select
                  className="w-full h-12 bg-zinc-100 rounded-lg px-4 border border-gray-300 transform transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  name="selectedGender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option className="w-fit" value="">
                    Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Prefer not to say</option>
                </select>
              </div>
              <div className="w-full md:w-1/2 px-2">
                <label className="text-blue-800 mb-2 flex items-center">
                  <MdEvent className="mr-2" /> Appointment Date
                </label>
                <input
                  className="w-full h-12 bg-zinc-100 rounded-lg px-4 border border-gray-300 transform transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                  type="date"
                  placeholder="Appointment date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full px-2 mb-6">
              <label className="text-blue-800 mb-2 flex items-center">
                <MdLocationOn className="mr-2" /> Address
              </label>
              <textarea
                className="w-full bg-zinc-100 rounded-lg px-4 py-2 border border-gray-300 transform transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              />
            </div>
            <div className="w-full px-2 flex items-center mb-6">
              <p className="text-blue-800 mr-4">Have you visited before?</p>
              <input
                type="checkbox"
                checked={hasVisited}
                onChange={(e) => setHasVisited(e.target.checked)}
              />
            </div>
            <div className="flex w-full justify-center space-x-4">
              <button
                type="button"
                className="w-32 h-12 bg-gradient-to-r from-red-500 to-pink-400 text-white rounded-lg font-semibold transform transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-l"
                onClick={clearFields}
              >
                Clear
              </button>
              <button
                type="submit"
                className="w-32 h-12 bg-gradient-to-r from-green-500 to-blue-400 text-white rounded-lg font-semibold transform transition-transform duration-300 hover:scale-105 hover:bg-gradient-to-l"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointForm;
