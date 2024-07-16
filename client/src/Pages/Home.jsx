import React from "react";
import { Navbar } from "../Components/Navbar";
import { Department } from "../Components/Department";
import Message from "../Components/Message";
import { Footer } from "../Components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBubble from "../Components/ChatBubble";

function decode(token) {
  try {
    const tokenValue = JSON.parse(window.atob(token.split(".")[1]));
    return tokenValue;
  } catch (e) {
    return undefined;
  }
}

const adminData = decode(localStorage.getItem("authToken"));
console.log(adminData);

const Home = () => {
  const departmentsArray = [
    {
      dept: "Pediatrics",
      img: "pediatrics.jpg",
    },
    {
      dept: "Orthopedics",
      img: "orthopedics.jpg",
    },
    {
      dept: "Cardiology",
      img: "cardiology.png",
    },
    {
      dept: "Neurology",
      img: "neurology.jpg",
    },
    {
      dept: "Oncology",
      img: "oncology.webp",
    },
    {
      dept: "Radiology",
      img: "radiology.jpg",
    },
    {
      dept: "Gynaecology",
      img: "gynae.png",
    },
    {
      dept: "Dermatology",
      img: "derma.jpg",
    },
  ];

  return (
    <>
      {/* Navbar + Hero Section */}
      <div className="sec-1 w-full h-fit bg-gradient-to-tl from-[#4a90e2] to-[#a0c4ff] animate-fade-in">
        <Navbar />
        <div className="hero w-full flex items-center px-20 py-10">
          <div className="hero-pic w-1/2 flex justify-center">
            <img className="w-3/4 transform transition-transform duration-500 hover:scale-105" src="/hero-pic.png" alt="" />
          </div>
          <div className="hero-text w-1/2 flex flex-col items-center text-center space-y-2">
            <h1 className="font-bold text-5xl text-[#333] animate-slide-in">Welcome to Aaragya</h1>
            <p className="text-2xl text-[#555] animate-slide-in delay-200">
              Providing exceptional healthcare services for every individual. Our team of experts is dedicated to your well-being.
            </p>
          </div>
        </div>
      </div>

      {/* Departments section */}
      <div className="sec-2 w-full h-fit p-10 bg-gradient-to-t from-[#4a90e2] to-[#a0c4ff] animate-fade-in">
        <div className="department-head flex justify-center mb-5">
          <h1 className="text-4xl font-semibold text-[#333]">Find Doctors By Your Health Concern</h1>
        </div>
        <div className="departments w-full h-fit px-20 mt-9 flex flex-wrap justify-around gap-5">
          {departmentsArray.map((depart, index) => (
            <div className="w-1/4 p-5 bg-white rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105" key={index}>
              <Department data={depart} />
            </div>
          ))}
        </div>
      </div>
      
      <ChatBubble />

      {/* Message Section + Footer */}
      <div className="sec-3 w-full h-fit bg-gradient-to-b from-[#4a90e2] to-[#a0c4ff] pb-10 px-4 animate-fade-in">
  <div className="department-head flex justify-center mb-5">
    <h1 className="text-4xl font-semibold text-[#333]">Send Us A Message</h1>
  </div>
  <div className="w-full flex justify-center">
    <div className="w-full max-w-screen-lg px-4">
      <Message />
    </div>
  </div>
  <div className="footer px-10 mt-10">
    <hr className="h-px my-8 border-0 bg-[#4a90e2]" />
    <Footer />
  </div>
</div>


      <ToastContainer />
    </>
  );
};

export default Home;
