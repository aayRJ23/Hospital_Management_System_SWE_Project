import React from "react";

export const Footer = () => {
  return (
    <div className="bg-gray-100 rounded-lg py-10 px-5 pl-20 shadow-md">
      <div className="flex justify-around pb-7 pl-20">
        <div className="w-1/3">
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul>
            <li className="text-slate-600 mb-2 hover:text-black cursor-pointer">Home</li>
            <li className="text-slate-600 mb-2 hover:text-black cursor-pointer">Appointment</li>
            <li className="text-slate-600 hover:text-black cursor-pointer">About us</li>
          </ul>
        </div>
        <div className="w-1/3">
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <ul>
            <li className="flex items-center mb-2">
              <img
                src="/phone-call_597177.png"
                alt=""
                className="w-4 h-4"
              />
              <span className="text-slate-600 ml-2">9999999999</span>
            </li>
            <li className="flex items-center mb-2">
              <img src="/email.png" alt="" className="w-4 h-4" />
              <span className="text-slate-600 ml-2">name@gmail.com</span>
            </li>
            <li className="flex items-center">
              <img src="/pin.png" alt="" className="w-4 h-4" />
              <span className="text-slate-600 ml-2">Burdwan,WB</span>
            </li>
          </ul>
        </div>
        <div className="w-1/3">
          <h4 className="text-lg font-semibold mb-4">Hours</h4>
          <ul>
            <li className="text-slate-600 mb-2">
              Monday: 09am-11pm
            </li>
            <li className="text-slate-600 mb-2">
              Tuesday: 10am-11pm
            </li>
            <li className="text-slate-600 mb-2">
              Wednesday: 10am-11pm
            </li>
            <li className="text-slate-600 mb-2">
              Friday: 11am-10pm
            </li>
            <li className="text-slate-600 mb-2">
              Saturday: 12pm-9pm
            </li>
            <li className="text-slate-600">
              Sunday: 12pm-9pm
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
