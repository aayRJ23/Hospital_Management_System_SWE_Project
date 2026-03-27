import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Message = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/api/v1/message/send",
        { firstName, lastName, email, phone, message },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) => {
        toast.success(res.data.message);
        clearFields();
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const clearFields = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="msg-form w-full max-w-screen-xl rounded-lg bg-white shadow-lg p-10">
        <h2 className="text-2xl font-bold text-center mb-6">Contact Us</h2>
        <form onSubmit={handleMessage}>
          <div className="mb-4">
            <label className="block font-semibold mb-2">First Name</label>
            <input
              className="w-full h-12 bg-zinc-100 rounded-lg px-4 mb-4 transform transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Last Name</label>
            <input
              className="w-full h-12 bg-zinc-100 rounded-lg px-4 mb-4 transform transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Email</label>
            <input
              className="w-full h-12 bg-zinc-100 rounded-lg px-4 mb-4 transform transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Mobile Number</label>
            <input
              className="w-full h-12 bg-zinc-100 rounded-lg px-4 mb-4 transform transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              type="tel"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-2">Message</label>
            <textarea
              className="w-full h-32 bg-zinc-100 rounded-lg px-4 py-2 transform transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex justify-center space-x-4">
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
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Message;
