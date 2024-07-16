import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "../Components/Navbar";
import AppointForm from "../Components/AppointForm";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../main";
import AppointDoctors from "../Components/AppointDoctors";

const Appointment = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (cardData) => {
    setSelectedCard(cardData);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };
  const [doctors, setDoctors] = useState([]);
  const { isAuthenticated } = useContext(Context);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/doctors",
          { withCredentials: true }
        );
        console.log(response.data);
        if (response.data.success) {
          setDoctors(response.data.data);
        } else {
          console.log("Failed to fetch doctors: ", response.data.message);
        }
      } catch (error) {
        // console.log(error.response.data.message);
      }
    };
    fetchDoctors();
  }, []);
  const navigateTo = useNavigate();
  const goToLogin = () => {
    navigateTo("/login");
  };
  // const [cards] = useState(doctors)
  // console.log(cards)
  const [showModal, setShowModal] = useState(false);
  function checkToken() {
    const token = localStorage.getItem("authToken");
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  const tokenExists = checkToken();
  // console.log(tokenExists);
  // let df = "";
  // let dl = "";
  // let dd = "";

  return (
    <div className="sec-1 w-full h-full bg-gradient-to-tl from-[#76dbcf]">
      <Navbar />
      <div className="header w-full flex justify-center mt-7">
        <h1 className="font-semibold text-2xl">Our Doctors</h1>
      </div>
      <div className="doc-details p-5 flex justify-around flex-wrap">
      {doctors && doctors.length > 0 ? (
        doctors.map((element) => (
          <AppointDoctors key={element._id} data={element} onClick={handleCardClick} />
        ))):(
          <h1>No Doctors</h1>
        )}
      </div>
      <AppointForm data={selectedCard} onClose={handleCloseModal} />
      
    </div>
  );
};

export default Appointment;
