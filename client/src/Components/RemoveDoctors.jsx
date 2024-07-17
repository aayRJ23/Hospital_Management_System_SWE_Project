import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

const RemoveDoctors = ({ data }) => {
  const navigateTo = useNavigate();

  const handleRemoveDoctor = async (doctorID) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/v1/users/doctor/${doctorID}`,
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      navigateTo("/admin");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <div
      key={data._id}
      className="flex w-full bg-white box-border h-fit w-52 rounded-3xl py-4 px-10 border-4 shadow-[0_24px_40px_-15px_rgba(0,0,0,0.3)] items-center justify-between ml-14 mb-10"
    >
      <div className="w-28 h-28 rounded-full border-2 border-emerald-300 mb-2">
        <img
          className="w-28 h-28 rounded-full"
          src={data.avatar && data.avatar.url}
          alt=""
        />
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="text-black font-semibold text-xl ">
          Name: {data.firstName} {data.lastName}
        </h1>
        <h1 className="text-black font-semibold text-xl">
          Dept.: {data.doctorDepartment}
        </h1>
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="text-black font-semibold text-xl ">
          Email id: {data.email}
        </h1>
        <h1 className="text-black font-semibold text-xl">
          Ph no.: {data.phone}
        </h1>
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="text-black font-semibold text-xl">
          Aadhar No.: {data.nic}
        </h1>
        <div className="flex gap-10">
          <h1 className="text-black font-semibold text-xl ">
            Gender: {data.gender}
          </h1>
          <h1 className="text-black font-semibold text-xl ">
            D.O.B: {data.dob}
          </h1>
        </div>
      </div>
      <button
        onClick={() => handleRemoveDoctor(data._id)}
        className="w-40 bg-red-500 rounded-2xl h-10 font-semibold text-white mt-2"
      >
        Remove
      </button>
    </div>
  );
};

export default RemoveDoctors;
