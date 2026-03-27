import React, { useContext, useState } from "react";
import { MdOutlineMailLock } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoRemoveOutline } from "react-icons/io5";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { motion } from "framer-motion";

const LoginAdmin = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        { email, password, confirmPassword: password, role: "Admin" },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("admin", JSON.stringify(user));

      toast.success(response.data.message);
      setIsAuthenticated(true);
      navigateTo("/admin");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/admin"} />;
  }

  return (
    <motion.div
      className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-orange-500 to-orange-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="lg:w-1/2 flex flex-col justify-center items-center bg-white bg-opacity-30 backdrop-blur-lg p-10 rounded-br-full shadow-xl">
        <h2 className="text-5xl text-white font-bold mb-4 animate-bounce">
          MedEazy
        </h2>
        <p className="text-lg text-white mb-4 px-10 text-center">
          Welcome to MedEazy, your reliable partner in healthcare. Our mission is to ensure that every patient receives the best possible care, with convenience and efficiency. Join us and be part of a healthcare revolution.
        </p>
        <IoRemoveOutline size={80} className="text-white mb-4 animate-pulse" />
        <p className="text-2xl text-white mb-6">We care for our patient's health</p>
        <button
          className="w-44 mt-5 py-2 rounded-2xl font-semibold border-2 border-white text-white hover:bg-white hover:text-orange-500 transition duration-300"
          onClick={() => navigateTo("/")}
        >
          Home
        </button>
      </div>
      <div className="lg:w-1/2 flex flex-col justify-center items-center bg-white bg-opacity-20 backdrop-blur-lg p-10 shadow-xl mt-10 lg:mt-0 lg:rounded-tl-full">
        <h2 className="text-5xl text-white font-bold mb-1">Sign In</h2>
        <h4 className="text-xl text-white font-bold mb-5">Admins Only</h4>
        <form
          className="w-full flex flex-col items-center space-y-6"
          onSubmit={handleLogin}
        >
          <div className="flex items-center w-72 h-10 bg-zinc-200 px=5 rounded-2xl mb-6">
            <MdOutlineMailLock className="ml-4" />
            <motion.input
              className="bg-zinc-200 h-10 px-5 outline-none w-full"
              type="email"
              placeholder="Email"
              required="required"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              whileFocus={{ scale: 1.05 }}
            />
          </div>
          <div className="flex items-center w-72 h-10 bg-zinc-200 px=5 rounded-2xl mb-6">
            <RiLockPasswordLine className="ml-4" />
            <motion.input
              className="bg-zinc-200 h-10 px-5 outline-none w-full"
              type="password"
              placeholder="Password"
              required="required"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              whileFocus={{ scale: 1.05 }}
            />
          </div>
          <motion.button
            className="w-40 bg-orange-600 rounded-2xl h-10 text-white font-semibold shadow-lg hover:bg-orange-700 transition duration-300"
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginAdmin;
