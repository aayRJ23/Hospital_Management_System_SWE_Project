import React from "react";
import Sidebar from "../Components/Sidebar";
import { useContext, useState } from "react";
import { Context } from "../main";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { RiAdminFill, RiUserFill, RiMailFill, RiPhoneFill, RiPassportFill, RiCakeFill, RiLockFill, RiDeleteBin2Fill } from "react-icons/ri";

const AddAdmin = () => {
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

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:8000/api/v1/users/admin/add",
          { firstName, lastName, email, phone, nic, dob, gender, password },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
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
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full add-admin flex">
        <div className="ml-24 w-full h-fit pl-20 pt-7 pr-20">
          <div className="add-admin-form bg-white w-full h-fit rounded-2xl px-5 py-3 flex flex-col items-center">
            <h1 className="font-semibold text-3xl mt-3 mb-5 bg-red-500 text-white px-4 py-2 rounded-full">
              Add New Admin
            </h1>
            <div className="w-full h-fit mb-10">
              <form onSubmit={handleAddNewAdmin}>
                <div className="flex flex-col mb-6">
                  <div className="flex items-center mb-4">
                    <RiAdminFill size={20} />
                    <label className="ml-2 text-gray-800 font-bold w-32">First Name</label>
                    <input
                      className="flex-grow h-10 bg-zinc-200 rounded-2xl px-4 border border-black ml-2"
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <RiAdminFill size={20} />
                    <label className="ml-2 text-gray-800 font-bold w-32">Last Name</label>
                    <input
                      className="flex-grow h-10 bg-zinc-200 rounded-2xl px-4 border border-black ml-2"
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <RiMailFill size={20} />
                    <label className="ml-2 text-gray-800 font-bold w-32">Email</label>
                    <input
                      className="flex-grow h-10 bg-zinc-200 rounded-2xl px-4 border border-black ml-2"
                      type="text"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <RiPhoneFill size={20} />
                    <label className="ml-2 text-gray-800 font-bold w-32">Mobile Number</label>
                    <input
                      className="flex-grow h-10 bg-zinc-200 rounded-2xl px-4 border border-black ml-2"
                      type="number"
                      placeholder="Mobile Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <RiPassportFill size={20} />
                    <label className="ml-2 text-gray-800 font-bold w-32">Aadhar No.</label>
                    <input
                      className="flex-grow h-10 bg-zinc-200 rounded-2xl px-4 border border-black ml-2"
                      type="text"
                      placeholder="Aadhar No."
                      value={nic}
                      onChange={(e) => setNic(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <RiCakeFill size={20} />
                    <label className="ml-2 text-gray-800 font-bold w-32">Date Of Birth</label>
                    <input
                      className="flex-grow h-10 bg-zinc-200 rounded-2xl px-4 border border-black ml-2"
                      type="text"
                      placeholder="Date Of Birth"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center mb-4">
                    <RiUserFill size={20} />
                    <label className="ml-2 text-gray-800 font-bold w-32">Gender</label>
                    <select
                      className="flex-grow h-10 bg-zinc-200 rounded-2xl px-4 border border-black ml-2"
                      name="selectedGender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="nosay">Prefer not to say</option>
                    </select>
                  </div>
                  <div className="flex items-center mb-4">
                    <RiLockFill size={20} />
                    <label className="ml-2 text-gray-800 font-bold w-32">Password</label>
                    <input
                      className="flex-grow h-10 bg-zinc-200 rounded-2xl px-4 border border-black ml-2"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-around w-full mb-6">
                  <button
                    className="w-1/6 bg-red-600 text-white rounded-full h-10 font-semibold transition-colors duration-300 hover:bg-gradient-to-r from-red-500 to-red-700"
                    type="button"
                    onClick={clearForm}
                  >
                    CLEAR
                  </button>
                  <button
                    className="w-1/6 bg-green-600 text-white rounded-full h-10 font-semibold transition-colors duration-300 hover:bg-gradient-to-r from-green-500 to-green-700"
                    type="submit"
                  >
                    ADD NEW ADMIN
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

export default AddAdmin;
