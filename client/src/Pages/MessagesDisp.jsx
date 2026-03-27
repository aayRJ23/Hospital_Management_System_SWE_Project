import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import Sidebar from "../Components/Sidebar";
import { FaEnvelope, FaEnvelopeOpen, FaReply, FaCheckDouble } from "react-icons/fa";

const MessagesDisp = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/v1/message/get-all-msg", { withCredentials: true });
        // initialise local isRead flag (backend has no isRead field — purely frontend state)
        setMessages(data.messages.map((m) => ({ ...m, isRead: false })));
      } catch (error) {
        console.log(error.response?.data?.message);
      }
    };
    fetchMessages();
  }, []);

  const markRead = (id) => {
    setMessages((prev) => prev.map((m) => m._id === id ? { ...m, isRead: true } : m));
  };

  const markAllRead = () => {
    setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
    toast.success("All messages marked as read");
  };

  const handleReply = (msg) => {
    const subject = encodeURIComponent(`Re: Message from ${msg.firstName} ${msg.lastName} | MedEazy HMS`);
    const body = encodeURIComponent(
      `Dear ${msg.firstName} ${msg.lastName},\n\nThank you for contacting MedEazy. We have received your message and are getting back to you.\n\n` +
      `──────────────────────────────\n` +
      `Your original message:\n` +
      `Name: ${msg.firstName} ${msg.lastName}\n` +
      `Phone: ${msg.phone}\n` +
      `Message: ${msg.message}\n` +
      `──────────────────────────────\n\n` +
      `[Write your reply here]\n\n` +
      `Warm regards,\nMedEazy Admin Team\n123 Health St, Wellness City\nPhone: (123) 456-7890`
    );
    // Opens Gmail compose in the same Chrome profile's new tab (not account picker)
    window.open(`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(msg.email)}&su=${subject}&body=${body}`, "_blank", "noopener");
    markRead(msg._id);
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="flex">
      <Sidebar />
      <section className="page messages p-7 mt-10 w-full">
        {/* Header + Mark All Read */}
        <div className="flex justify-center items-center mb-5 gap-4 flex-wrap">
          <h1 className="font-semibold text-3xl bg-red-400 text-white px-4 py-2 rounded-full">
            MESSAGES
          </h1>
          {unreadCount > 0 && (
            <span className="bg-red-100 text-red-600 font-semibold text-sm px-3 py-1 rounded-full border border-red-300">
              {unreadCount} unread
            </span>
          )}
          {messages.length > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-full transition"
            >
              <FaCheckDouble size={13} /> Mark All as Read
            </button>
          )}
        </div>

        <div className="banner flex w-full items-center flex-wrap gap-5 flex-col-reverse">
          {messages && messages.length > 0 ? (
            messages.map((element, index) => (
              <div
                className="w-10/12 h-fit pl-20 flex-shrink-0 flex items-start mb-4"
                key={element._id}
              >
                <div
                  className={`p-5 pl-7 rounded-lg border flex-grow relative transition-all duration-300 ${
                    element.isRead
                      ? "bg-white border-gray-200 opacity-70"
                      : "bg-gray-200 border-black"
                  }`}
                  style={{ zIndex: -1 }}
                >
                  {/* Number badge */}
                  <div className="absolute top-1/2 transform -translate-y-1/2 -left-8 w-10 h-10 bg-red-400 rounded-full flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>

                  {/* Read/Unread icon + action buttons top-right */}
                  <div className="flex justify-end items-center gap-3 mb-2">
                    {element.isRead ? (
                      <FaEnvelopeOpen className="text-2xl text-gray-400" title="Read" />
                    ) : (
                      <FaEnvelope className="text-2xl text-gray-600" title="Unread" />
                    )}

                    {/* Mark as Read button */}
                    {!element.isRead && (
                      <button
                        onClick={() => markRead(element._id)}
                        className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition"
                        title="Mark as read"
                      >
                        <FaEnvelopeOpen size={11} /> Mark as Read
                      </button>
                    )}

                    {/* Reply button — opens Gmail compose */}
                    <button
                      onClick={() => handleReply(element)}
                      className="flex items-center gap-1 bg-red-400 hover:bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition"
                      title={`Reply to ${element.email}`}
                    >
                      <FaReply size={11} /> Reply via Gmail
                    </button>
                  </div>

                  <h1 className="font-semibold text-xl">First Name: <span className="font-normal">{element.firstName}</span></h1>
                  <h1 className="font-semibold text-xl">Last Name: <span className="font-normal">{element.lastName}</span></h1>
                  <h1 className="font-semibold text-xl">Email: <span className="font-normal">{element.email}</span></h1>
                  <h1 className="font-semibold text-xl">Phone no.: <span className="font-normal">{element.phone}</span></h1>
                  <h1 className="font-semibold text-xl">Message: <span className="font-normal">{element.message}</span></h1>

                  {/* Read indicator strip */}
                  {element.isRead && (
                    <p className="mt-2 text-xs text-gray-400 italic">✓ Read</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <h1>No Messages!</h1>
          )}
        </div>
      </section>
    </div>
  );
};

export default MessagesDisp;