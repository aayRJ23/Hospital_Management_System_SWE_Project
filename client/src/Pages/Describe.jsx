import React, { useState, useEffect } from "react";
import axios from "axios";

const FIELDS = [
  { key: "remarks", label: "Remarks", icon: "📋" },
  { key: "prescription", label: "Prescription", icon: "💊" },
  { key: "medicineRecommendation", label: "Medicine Recommendation", icon: "🧴" },
  { key: "testReferral", label: "Test Referrals", icon: "🔬" },
  { key: "additionalNote", label: "Additional Notes", icon: "📝" },
];

const Describe = ({ appointment, onClose }) => {
  const [form, setForm] = useState({ remarks: "", prescription: "", medicineRecommendation: "", testReferral: "", additionalNote: "" });

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/prescribe/getPrescribe/${appointment._id}`);
        if (response.data) {
          setForm({
            remarks: response.data.remarks || "",
            prescription: response.data.prescription || "",
            medicineRecommendation: response.data.medicineRecommendation || "",
            testReferral: response.data.testReferral || "",
            additionalNote: response.data.additionalNote || "",
          });
        }
      } catch (error) {
        console.error("Error fetching prescription data:", error);
      }
    };
    fetchPrescription();
  }, [appointment._id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-100">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-red-600 to-red-500 rounded-t-2xl px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-2xl">📋 Your Prescription</h2>
            <p className="text-red-100 text-sm mt-0.5">Read-only view</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center text-2xl font-bold transition">×</button>
        </div>

        <div className="px-8 py-6 space-y-5">
          {/* Appointment Info */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 grid grid-cols-2 gap-2 text-sm">
            <p><span className="font-semibold text-red-700">Appointment Date:</span> {appointment.appointment_date.substring(0, 10)}</p>
            <p><span className="font-semibold text-red-700">Status:</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-white text-xs bg-green-500">{appointment.status}</span>
            </p>
          </div>

          {/* Doctor Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
            <h3 className="font-bold text-blue-700 mb-2 text-base">👨‍⚕️ Doctor Details</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              <p><span className="font-semibold">Name:</span> Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</p>
              <p><span className="font-semibold">Department:</span> {appointment.department}</p>
            </div>
          </div>

          {/* Patient Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
            <h3 className="font-bold text-gray-700 mb-2 text-base">🧑 Patient Details</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              <p><span className="font-semibold">Name:</span> {appointment.firstName} {appointment.lastName}</p>
              <p><span className="font-semibold">Email:</span> {appointment.email}</p>
              <p><span className="font-semibold">Phone:</span> {appointment.phone}</p>
              <p><span className="font-semibold">Gender:</span> {appointment.gender}</p>
              <p><span className="font-semibold">DOB:</span> {appointment.dob.substring(0, 10)}</p>
              <p><span className="font-semibold">NIC:</span> {appointment.nic}</p>
              <p className="col-span-2"><span className="font-semibold">Address:</span> {appointment.address}</p>
              <p className="col-span-2"><span className="font-semibold">Patient ID:</span> {appointment.patientId}</p>
            </div>
          </div>

          {/* Readonly Fields */}
          {FIELDS.map(({ key, label, icon }) => (
            <div key={key}>
              <label className="flex items-center gap-2 font-bold text-gray-700 mb-2">
                <span>{icon}</span> {label}
              </label>
              <div className="w-full min-h-[80px] p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-800 whitespace-pre-wrap">
                {form[key] || <span className="text-gray-400 italic">Not provided</span>}
              </div>
            </div>
          ))}

          <div className="pb-4">
            <button
              onClick={onClose}
              className="w-full border border-gray-300 text-gray-600 py-2.5 rounded-full hover:bg-gray-100 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Describe;