import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaBirthdayCake,
  FaGenderless,
  FaLock,
  FaUserMd,
  FaUpload,
} from "react-icons/fa";

const AddDoctor = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");

  const navigateTo = useNavigate();

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
  };

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("nic", nic);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("doctorDepartment", doctorDepartment);
      formData.append("avatar", docAvatar);
      await axios
        .post("http://localhost:8000/api/v1/users/doctor/register", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/admin");
          clearForm();
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setNic("");
    setDob("");
    setGender("");
    setPassword("");
    setDoctorDepartment("");
    setDocAvatar("");
    setDocAvatarPreview("");
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full flex items-center justify-center">
        <div className="w-full pl-20 pt-7 pr-20">
          <div className="add-admin-form bg-white w-full h-fit rounded-2xl px-5 py-3 flex flex-col items-center shadow-lg">
            <h1 className="font-bold text-3xl mb-5 text-center bg-red-500 text-white py-2 px-4 rounded-full">
              Add New Doctor
            </h1>
            <div className="w-full h-fit mb-10">
              <form onSubmit={handleAddNewDoctor}>
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <FaUpload className="mr-3" />
                    <label
                      className="mr-3 font-bold"
                      style={{ minWidth: "120px" }}
                    >
                      Avatar
                    </label>
                    <input
                      className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
                      type="file"
                      onChange={handleAvatar}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <FaUser className="mr-3" />
                    <label
                      className="mr-3 font-bold"
                      style={{ minWidth: "120px" }}
                    >
                      First Name
                    </label>
                    <input
                      className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <FaUser className="mr-3" />
                    <label
                      className="mr-3 font-bold"
                      style={{ minWidth: "120px" }}
                    >
                      Last Name
                    </label>
                    <input
                      className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <FaEnvelope className="mr-3" />
                    <label
                      className="mr-3 font-bold"
                      style={{ minWidth: "120px" }}
                    >
                      Email
                    </label>
                    <input
                      className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
                      type="text"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <FaPhone className="mr-3" />
                    <label
                      className="mr-3 font-bold"
                      style={{ minWidth: "120px" }}
                    >
                      Mobile Number
                    </label>
                    <input
                      className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
                      type="number"
                      placeholder="Mobile Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <FaIdCard className="mr-3" />
                    <label
                      className="mr-3 font-bold"
                      style={{ minWidth: "120px" }}
                    >
                      Aadhar No.
                    </label>
                    <input
                      className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
                      type="text"
                      placeholder="Aadhar No."
                      value={nic}
                      onChange={(e) => setNic(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <FaBirthdayCake className="mr-3" />
                    <label
                      className="mr-3 font-bold"
                      style={{ minWidth: "120px" }}
                    >
                      Date Of Birth
                    </label>
                    <input
                      className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
                      type="text"
                      placeholder="Date Of Birth"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <FaGenderless className="mr-3" />
                    <label
                      className="mr-3 font-bold"
                      style={{ minWidth: "120px" }}
                    >
                      Gender
                    </label>
                    <select
                      className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
                      name="selectedGender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="flex items-center mb-4">
                    <FaLock className="mr-3" />
                    <label
                      className="mr-3 font-bold"
                      style={{ minWidth: "120px" }}
                    >
                      Password
                    </label>
                    <input
                      className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <FaUserMd className="mr-3" />
                    <label
                      className="mr-3 font-bold"
                      style={{ minWidth: "120px" }}
                    >
                      Department
                    </label>
                    <select
                      className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
                      name="selectedDepartment"
                      value={doctorDepartment}
                      onChange={(e) => setDoctorDepartment(e.target.value)}
                    >
                      <option value="">Select Department</option>
                      {departmentsArray.map((depart, index) => (
                        <option value={depart} key={index}>
                          {depart}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-center mt-6 space-x-4">
                  <button
                    type="button"
                    onClick={clearForm}
                    className="w-48 bg-red-500 text-white rounded-2xl h-10 font-semibold transition duration-300 hover:bg-gradient-to-r from-red-500 to-red-700"
                  >
                    CLEAR
                  </button>
                  <button
                    type="submit"
                    className="w-48 bg-green-500 text-white rounded-2xl h-10 font-semibold transition duration-300 hover:bg-gradient-to-r from-green-500 to-green-700"
                  >
                    ADD NEW DOCTOR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
