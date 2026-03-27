import React from "react";
import Sidebar from "../Components/Sidebar";
import { useState, useContext, useEffect } from "react";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RemoveDoctors from "../Components/RemoveDoctors";
import { FaSearch } from "react-icons/fa";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/users/doctors",
          {
            withCredentials: true,
          }
        );
        setDoctors(data.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchDoctors();
  }, []);

  const navigateTo = useNavigate();
  const goToLogin = () => {
    navigateTo("/login");
  };

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
    <div className="flex">
      <Sidebar />
      <section className="page messages p-7 w-full">
        <div className="w-full flex justify-center">
          <h1 className="font-bold text-3xl mb-5 text-center bg-red-500 text-white py-2 px-4 rounded-full">
            Our Doctors
          </h1>
        </div>
        <div className="flex justify-center mb-6">
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
        <div className="ml-20 pl-10 doc-details p-5 flex justify-around flex-wrap">
          {filteredDoctors && filteredDoctors.length > 0 ? (
            filteredDoctors.map((element) => (
              <RemoveDoctors key={element._id} data={element} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-4xl font-bold text-gray-500 mb-4">No Doctors</h1>
            <p className="text-lg text-gray-400">Please add some doctors for this Hospital.</p>
          </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Doctors;
