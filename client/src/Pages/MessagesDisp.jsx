import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import { FaEnvelope } from "react-icons/fa";

const MessagesDisp = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/message/get-all-msg",
          {
            withCredentials: true,
          }
        );
        console.log(data.messages);
        setMessages(data.messages);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <section className="page messages p-7 mt-10 w-full">
        <div className="flex justify-center mb-3">
          <h1 className="font-semibold text-3xl bg-red-400 text-white px-4 py-2 rounded-full">
            MESSAGE
          </h1>
        </div>
        <div className="banner flex w-full items-center flex-wrap gap-5 flex-col-reverse">
          {messages && messages.length > 0 ? (
            messages.map((element, index) => {
              return (
                <div
                  className="w-10/12 h-fit pl-20 flex-shrink-0 flex items-start mb-4"
                  key={element._id}
                >
                  <div
                    className="bg-gray-200 p-5 pl-7 rounded-lg border border-black flex-grow relative"
                    style={{ zIndex: -1 }}
                  >
                    <div className="absolute top-1/2 transform -translate-y-1/2 -left-8 w-10 h-10 bg-red-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex justify-end items-center h-full">
                      <FaEnvelope className="text-2xl text-gray-600" />
                    </div>
                    <h1 className="font-semibold text-xl">
                      First Name:{" "}
                      <span className="font-normal">{element.firstName}</span>
                    </h1>
                    <h1 className="font-semibold text-xl">
                      Last Name:{" "}
                      <span className="font-normal">{element.lastName}</span>
                    </h1>
                    <h1 className="font-semibold text-xl">
                      Email:{" "}
                      <span className="font-normal">{element.email}</span>
                    </h1>
                    <h1 className="font-semibold text-xl">
                      Phone no.:{" "}
                      <span className="font-normal">{element.phone}</span>
                    </h1>
                    <h1 className="font-semibold text-xl">
                      Message:{" "}
                      <span className="font-normal">{element.message}</span>
                    </h1>
                  </div>
                </div>
              );
            })
          ) : (
            <h1>No Messages!</h1>
          )}
        </div>
      </section>
    </div>
  );
};

export default MessagesDisp;
