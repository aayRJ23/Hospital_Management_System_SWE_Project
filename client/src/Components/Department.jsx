import React from "react";

export const Department = ({ data }) => {
  const dep = data;
  return (
    <div className="flex bg-white h-64 w-56 rounded-xl p-4 border-4 border-gray-300 shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl flex-col items-center mx-6 mb-10 group">
      <button className="w-44 h-44 rounded-full overflow-hidden transition-all duration-300 ease-in-out transform group-hover:scale-110">
        <img
          src={dep.img}
          alt={dep.dept}
          className="object-cover w-full h-full"
        />
      </button>
      <h4 className="text-gray-800 font-semibold text-xl mt-4">{dep.dept}</h4>
    </div>
  );
};
