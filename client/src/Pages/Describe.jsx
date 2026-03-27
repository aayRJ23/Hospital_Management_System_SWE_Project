import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Describe = ({ appointment, onClose }) => {
  const [remarks, setRemarks] = useState("");
  const [prescription, setPrescription] = useState("");
  const [medicineRecommendation, setMedicineRecommendation] = useState("");
  const [testReferral, setTestReferral] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");

  useEffect(() => {
    const fetchPrescription = async (id) => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/prescribe/getPrescribe/${id}`
        );
        if (response.data) {
          setRemarks(response.data.remarks);
          setPrescription(response.data.prescription);
          setMedicineRecommendation(response.data.medicineRecommendation);
          setTestReferral(response.data.testReferral);
          setAdditionalNote(response.data.additionalNote);
        }
      } catch (error) {
        console.error("Error fetching prescription data:", error);
      }
    };

    fetchPrescription(appointment._id);
  }, [appointment._id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto relative border-4 border-gray-800">
        <button
          className="absolute top-4 right-4 text-2xl font-bold text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">
          Appointment Details
        </h2>
        <div className="space-y-4">
          <p>
            <strong>Appointment Date:</strong>{" "}
            {appointment.appointment_date.substring(0, 10)}
          </p>
          <p>
            <strong>Status:</strong> {appointment.status}
          </p>
        </div>
        <hr className="my-4" />
        <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">
          Doctor's Details
        </h2>
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {appointment.doctor.firstName}{" "}
            {appointment.doctor.lastName}
          </p>
          <p>
            <strong>Department:</strong> {appointment.department}
          </p>
        </div>
        <hr className="my-4" />
        <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">
          Patient's Details
        </h2>
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {appointment.firstName}{" "}
            {appointment.lastName}
          </p>
          <p>
            <strong>Email:</strong> {appointment.email}
          </p>
          <p>
            <strong>Phone:</strong> {appointment.phone}
          </p>
          <p>
            <strong>NIC:</strong> {appointment.nic}
          </p>
          <p>
            <strong>DOB:</strong> {appointment.dob.substring(0, 10)}
          </p>
          <p>
            <strong>Gender:</strong> {appointment.gender}
          </p>
          <p>
            <strong>Address:</strong> {appointment.address}
          </p>
          <p>
            <strong>Patient ID:</strong> {appointment.patientId}
          </p>
        </div>
        <hr className="my-4" />
        <div className="mt-6">
          <h3 className="text-xl font-bold text-red-500 mb-2">Remarks</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md resize-y"
            value={remarks}
            readOnly
          ></textarea>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold text-red-500 mb-2">Prescription</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md resize-y"
            value={prescription}
            readOnly
          ></textarea>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold text-red-500 mb-2">
            Medicine Recommendation
          </h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md resize-y"
            value={medicineRecommendation}
            readOnly
          ></textarea>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold text-red-500 mb-2">Test Referrals</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md resize-y"
            value={testReferral}
            readOnly
          ></textarea>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold text-red-500 mb-2">
            Additional Notes
          </h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md resize-y"
            value={additionalNote}
            readOnly
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Describe;
