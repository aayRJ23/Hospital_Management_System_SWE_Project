import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBars, FaTimes } from "react-icons/fa"; // Importing icons for the hamburger menu

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loginOptionsOpen, setLoginOptionsOpen] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/users/patient/logout",
        {
          withCredentials: true, // Include cookies in the request
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(res);
      toast.success(res.data.message);
      setIsAuthenticated(false);
      localStorage.removeItem("authToken"); // Remove token from localStorage
      localStorage.removeItem("patient");
      navigateTo("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const handleLogoutDoctor = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/users/doctor/logout",
        {
          withCredentials: true, // Include cookies in the request
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(res);
      toast.success(res.data.message);
      setIsAuthenticated(false);
      localStorage.removeItem("authToken"); // Remove token from localStorage
      localStorage.removeItem("doctor");
      navigateTo("/logindoctor");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const checkPatient = () => {
    const token = localStorage.getItem("patient");
    return !!token;
  };

  const patientExists = checkPatient();

  const checkDoctor = () => {
    const token = localStorage.getItem("doctor");
    return !!token;
  };

  const doctorExists = checkDoctor();

  const clickHandler = () => {
    patientExists ? handleLogout() : handleLogoutDoctor();
  };

  const goToLogin = () => {
    navigateTo("/login");
  };

  const goToRegister = () => {
    navigateTo("/register");
  };

  return (
    <div>
      <div className="fixed top-0 left-0 z-50 w-full flex justify-between items-center p-5 bg-gray-200 shadow-lg">
        <div
          className="text-2xl cursor-pointer z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
        <div className="logo w-10">
          <Link to={"/"}>
            <img className="ml-10" src="./image.png" alt="Logo" />
          </Link>
        </div>
      </div>

      <nav
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r-2 border-black p-5 transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="text-2xl font-bold text-deep-blue-900 mb-12">
          Navigation
        </div>
        <ul className="text-xl font-sans font-bold text-deep-blue-900">
          <li className="mb-4 hover:text-blue-600">
            <Link to={"/"}>Home</Link>
          </li>
          {patientExists ? (
            <li className="mb-4 hover:text-blue-600">
              <Link to={"/appointment"}>Appointment</Link>
            </li>
          ) : (
            <></>
          )}

          <li className="mb-4 hover:text-blue-600">
            <Link to={"/aboutus"}>About Us</Link>
          </li>
        </ul>
        {isAuthenticated ? (
          <div className="flex flex-col items-start mt-10">
            <button
              className="w-full mb-4 h-10 bg-red-600 text-white rounded-lg font-semibold"
              onClick={clickHandler}
            >
              LOGOUT
            </button>
            <div className="profile w-full flex flex-col">
              {patientExists ? (
                <Link to={"/patient-home"}>
                  <div className="pl-16 pt-2 w-full mb-4 h-10 bg-blue-600 text-white rounded-lg font-semibold ">
                    ACCOUNT
                  </div>
                </Link>
              ) : (
                <Link to={"/doctor-home"}>
                  <div className="pl-16 pt-2 w-full mb-4 h-10 bg-blue-600 text-white rounded-lg font-semibold ">
                    ACCOUNT
                  </div>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col mt-10">
            <button
              className="w-full mb-4 h-10 bg-blue-600 text-white rounded-lg font-semibold"
              onClick={goToRegister}
            >
              REGISTER
            </button>
            <button
              className="w-full h-10 bg-blue-600 text-white rounded-lg font-semibold"
              onClick={() => setLoginOptionsOpen((prev) => !prev)}
            >
              LOGIN
            </button>
            {loginOptionsOpen && (
              <div className="bg-white absolute left-full flex flex-col rounded-xl w-32 mt-3 font-semibold items-center shadow-lg">
                <Link
                  to={"/login"}
                  className="py-2 w-full text-center hover:bg-gray-200"
                >
                  Patient
                </Link>
                <Link
                  to={"/logindoctor"}
                  className="py-2 w-full text-center hover:bg-gray-200"
                >
                  Doctor
                </Link>
                <Link
                  to={"/loginadmin"}
                  className="py-2 w-full text-center hover:bg-gray-200"
                >
                  Admin
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};
