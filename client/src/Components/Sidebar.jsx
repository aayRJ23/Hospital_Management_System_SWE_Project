import React, { useState, useEffect } from "react";
import { RiMenu3Fill, RiCloseFill, RiLogoutCircleFill } from "react-icons/ri";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Set sidebar to be open initially
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigateTo = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/users/admin/logout",
        {
          withCredentials: true, // Include cookies in the request
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(res);
      toast.success(res.data.message);
      setIsAuthenticated(false);
      localStorage.removeItem("authToken"); // Remove token from localStorage
      localStorage.removeItem("admin");
      navigateTo("/loginadmin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigateAndKeepOpen = (path) => {
    navigateTo(path);
  };

  useEffect(() => {
    // Keep the sidebar open after navigating to a new page
    setIsOpen(true);
  }, [location]);

  return (
    <div className={`fixed h-screen ${isOpen ? 'w-48' : 'w-16'} transition-all duration-300 bg-[#FA7070] border-r-2 border-gray-400`}>
      <div className="flex flex-col items-center py-7">
        <div onClick={toggleSidebar} className="cursor-pointer">
          {isOpen ? <RiCloseFill size={35} /> : <RiMenu3Fill size={35} />}
        </div>
        {isOpen && (
          <div className="mt-4 flex flex-col items-start pl-2 space-y-4">
            <button 
              onClick={() => navigateAndKeepOpen("/admin")} 
              className={`mb-4 px-4 py-2 w-full text-left font-bold hover:bg-gray-300 transition-colors duration-200 ${location.pathname === "/admin" ? "border border-gray-100 bg-gray-200 rounded-full" : ""}`}>
              Home
            </button>
            <button 
              onClick={() => navigateAndKeepOpen("/admin-addnew")} 
              className={`mb-4 px-4 py-2 w-full text-left font-bold hover:bg-gray-300 transition-colors duration-200 ${location.pathname === "/admin-addnew" ? "border border-gray-100 bg-gray-200 rounded-full" : ""}`}>
              Add New Admin
            </button>
            <button 
              onClick={() => navigateAndKeepOpen("/doctors")} 
              className={`mb-4 px-4 py-2 w-full text-left font-bold hover:bg-gray-300 transition-colors duration-200 ${location.pathname === "/doctors" ? "border border-gray-100 bg-gray-200 rounded-full" : ""}`}>
              Doctors
            </button>
            <button 
              onClick={() => navigateAndKeepOpen("/doctor-addnew")} 
              className={`mb-4 px-4 py-2 w-full text-left font-bold hover:bg-gray-300 transition-colors duration-200 ${location.pathname === "/doctor-addnew" ? "border border-gray-100 bg-gray-200 rounded-full" : ""}`}>
              Add New Doctor
            </button>
            <button 
              onClick={() => navigateAndKeepOpen("/messages")} 
              className={`mb-4 px-4 py-2 w-full text-left font-bold hover:bg-gray-300 transition-colors duration-200 ${location.pathname === "/messages" ? "border border-gray-100 bg-gray-200 rounded-full" : ""}`}>
              Messages
            </button>
            <button 
              onClick={handleLogout} 
              className="mb-4 px-4 py-2 w-full text-left font-bold bg-red-600 text-white border border-white rounded-full hover:bg-red-700 transition-colors duration-200">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Sidebar;
