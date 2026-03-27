import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "../Components/Navbar";
import AppointForm from "../Components/AppointForm";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../main";
import AppointDoctors from "../Components/AppointDoctors";
import { FaSearch } from "react-icons/fa";

const Appointment = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");

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
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesName =
      searchName === "" ||
      doctor.firstName.toLowerCase().includes(searchName.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(searchName.toLowerCase());
    const matchesDepartment =
      searchDepartment === "" ||
      doctor.doctorDepartment
        .toLowerCase()
        .includes(searchDepartment.toLowerCase());

    return matchesName && matchesDepartment;
  });


  return (
    <div className="sec-1 w-full bg-gradient-to-br from-[#6a11cb] via-[#2575fc] to-[#00d4ff]">
      <Navbar />
      <div className="header w-full flex justify-center mt-20 pt-10">
        <h1 className="font-semibold text-white text-2xl">Our Doctors</h1>
      </div>
      <div className="flex justify-center my-6">
        <div className="relative mx-2">
          <input
            type="text"
            className="p-2 border border-black rounded-lg w-64"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
        <div className="relative mx-2">
          <input
            type="text"
            className="p-2 border border-black rounded-lg w-64"
            placeholder="Search by department"
            value={searchDepartment}
            onChange={(e) => setSearchDepartment(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-3 text-gray-400" />
        </div>
      </div>
      <div className="doc-details p-5 flex justify-around flex-wrap">
        {filteredDoctors && filteredDoctors.length > 0 ? (
          filteredDoctors.map((element) => (
            <AppointDoctors
              key={element._id}
              data={element}
              onClick={handleCardClick}
            />
          ))
        ) : (
          <h1>No Doctors</h1>
        )}
      </div>
      <AppointForm data={selectedCard} onClose={handleCloseModal} />
    </div>
  );
};

export default Appointment;
