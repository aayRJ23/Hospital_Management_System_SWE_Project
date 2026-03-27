import React, { useContext, useState } from "react";
import { IoRemoveOutline } from "react-icons/io5";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";
import { motion } from "framer-motion";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nic, setNic] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();
  const goToLogin = () => {
    navigateTo("/login");
  };
  const goToHome = () => {
    navigateTo("/");
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:8000/api/v1/users/patient/register",
          {
            firstName,
            lastName,
            email,
            phone,
            nic,
            dob,
            gender,
            password,
            role: "Patient",
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setNic("");
          setDob("");
          setGender("");
          setPassword("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <motion.div
      className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="lg:w-1/2 flex flex-col justify-center items-center bg-white bg-opacity-30 backdrop-blur-lg p-10 rounded-br-full shadow-xl">
        <h2 className="text-5xl text-white font-bold mb-4 animate-bounce">
          MedEazy
        </h2>
        <p className="text-lg text-white mb-4 px-10 text-center">
          Welcome to MedEazy, your reliable partner in healthcare. Our mission
          is to ensure that every patient receives the best possible care, with
          convenience and efficiency. Join us and be part of a healthcare
          revolution.
        </p>
        <IoRemoveOutline size={80} className="text-white mb-4 animate-pulse" />
        <p className="text-2xl text-white mb-6">Already Have an Account?</p>
        <button
          className="w-40 py-2 rounded-2xl font-semibold border-2 border-white text-white hover:bg-white hover:text-purple-500 transition duration-300"
          onClick={goToLogin}
        >
          Sign In
        </button>
        <button
          className="w-44 mt-5 py-2 rounded-2xl font-semibold border-2 border-white text-white hover:bg-white hover:text-purple-500 transition duration-300"
          onClick={goToHome}
        >
          Home
        </button>
      </div>
      <div className="lg:w-1/2 flex flex-col justify-center items-center bg-white bg-opacity-20 backdrop-blur-lg p-10 shadow-xl mt-10 lg:mt-0 lg:rounded-tl-full">
        <h2 className="text-5xl text-white font-bold mb-2">Register</h2>
        <h4 className="text-xl text-white font-bold mb-5">Patients Only</h4>
        <form
          className="w-full flex flex-col items-center space-y-6"
          onSubmit={handleRegistration}
        >
          <div className="flex flex-col lg:flex-row w-full justify-around">
            <motion.input
              className="w-full lg:w-1/2 mx-2 py-2 px-4 bg-gray-200 rounded-2xl outline-none shadow-inner focus:ring-2 focus:ring-purple-500 transition duration-300 mb-4 lg:mb-0"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              whileFocus={{ scale: 1.05 }}
            />
            <motion.input
              className="w-full lg:w-1/2 mx-2 py-2 px-4 bg-gray-200 rounded-2xl outline-none shadow-inner focus:ring-2 focus:ring-purple-500 transition duration-300"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              whileFocus={{ scale: 1.05 }}
            />
          </div>
          <div className="flex flex-col lg:flex-row w-full justify-around">
            <motion.input
              className="w-full lg:w-1/2 mx-2 py-2 px-4 bg-gray-200 rounded-2xl outline-none shadow-inner focus:ring-2 focus:ring-purple-500 transition duration-300 mb-4 lg:mb-0"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              whileFocus={{ scale: 1.05 }}
            />
            <motion.input
              className="w-full lg:w-1/2 mx-2 py-2 px-4 bg-gray-200 rounded-2xl outline-none shadow-inner focus:ring-2 focus:ring-purple-500 transition duration-300"
              type="number"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              whileFocus={{ scale: 1.05 }}
            />
          </div>
          <div className="flex flex-col lg:flex-row w-full justify-around">
            <motion.input
              className="w-full lg:w-1/2 mx-2 py-2 px-4 bg-gray-200 rounded-2xl outline-none shadow-inner focus:ring-2 focus:ring-purple-500 transition duration-300 mb-4 lg:mb-0"
              type="text"
              placeholder="Aadhar No."
              value={nic}
              onChange={(e) => setNic(e.target.value)}
              whileFocus={{ scale: 1.05 }}
            />
            <motion.input
              className="w-full lg:w-1/2 mx-2 py-2 px-4 bg-gray-200 rounded-2xl outline-none shadow-inner focus:ring-2 focus:ring-purple-500 transition duration-300"
              type="text"
              placeholder="Date Of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              whileFocus={{ scale: 1.05 }}
            />
          </div>
          <div className="flex flex-col lg:flex-row w-full justify-around">
            <motion.label className="w-full lg:w-1/2 mx-2 py-2 px-4 bg-gray-200 rounded-2xl shadow-inner flex items-center focus-within:ring-2 focus-within:ring-purple-500 transition duration-300 mb-4 lg:mb-0">
              <select
                className="w-full bg-gray-200 border-0 outline-none"
                name="selectedGender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="nosay">Prefer not to say</option>
              </select>
            </motion.label>
            <motion.input
              className="w-full lg:w-1/2 mx-2 py-2 px-4 bg-gray-200 rounded-2xl outline-none shadow-inner focus:ring-2 focus:ring-purple-500 transition duration-300"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              whileFocus={{ scale: 1.05 }}
            />
          </div>
          <div className="flex w-full justify-center mt-3">
            <motion.button
              className="w-1/2 py-2 bg-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:bg-purple-700 transition duration-300"
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              REGISTER
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Register;
