import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Prescribe = ({ appointment, onClose }) => {
  const [remarks, setRemarks] = useState("");
  const [prescription, setPrescription] = useState("");
  const [medicineRecommendation, setMedicineRecommendation] = useState("");
  const [testReferral, setTestReferral] = useState("");
  const [additionalNote, setAdditionalNote] = useState("");

  useEffect(() => {
    // Fetch the last saved state if it exists
    const fetchPrescription = async (id) => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/prescribe/getPrescribe/${id}`);
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

  const handleSubmit = async () => {
    const data = {
      appointmentId: appointment._id,
      remarks,
      prescription,
      medicineRecommendation,
      testReferral,
      additionalNote,
    };
  
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/prescribe/postPrescribe`, data);
      console.log("Response:", response.data); // Log the response for debugging
      toast.success('Prescription sent successfully');
      onClose();
    } catch (error) {
      console.error("Error submitting prescription data:", error.response ? error.response.data : error.message);
      toast.error('Error occurred while sending prescription');
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto relative">
        <button className="absolute top-4 right-4 text-2xl font-bold text-gray-600" onClick={onClose}>
          ×
        </button>
        <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">Patient Details</h2>
        <div className="space-y-4">
          <p><strong>Name:</strong> {appointment.firstName} {appointment.lastName}</p>
          <p><strong>Email:</strong> {appointment.email}</p>
          <p><strong>Phone:</strong> {appointment.phone}</p>
          <p><strong>NIC:</strong> {appointment.nic}</p>
          <p><strong>DOB:</strong> {appointment.dob.substring(0, 10)}</p>
          <p><strong>Gender:</strong> {appointment.gender}</p>
          <p><strong>Appointment Date:</strong> {appointment.appointment_date.substring(0, 10)}</p>
          <p><strong>Department:</strong> {appointment.department}</p>
          <p><strong>Address:</strong> {appointment.address}</p>
          <p><strong>Patient ID:</strong> {appointment.patientId}</p>
          <p><strong>Status:</strong> {appointment.status}</p>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold text-red-500 mb-2">Remarks</h3>
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-md resize-y"
            placeholder="Enter remarks here..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          ></textarea>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold text-red-500 mb-2">Prescription</h3>
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-md resize-y"
            placeholder="Enter prescription details here..."
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold text-red-500 mb-2">Medicine Recommendation</h3>
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-md resize-y"
            placeholder="Enter medicine recommendation here..."
            value={medicineRecommendation}
            onChange={(e) => setMedicineRecommendation(e.target.value)}
          ></textarea>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold text-red-500 mb-2">Test Referrals</h3>
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-md resize-y"
            placeholder="Enter test referrals here..."
            value={testReferral}
            onChange={(e) => setTestReferral(e.target.value)}
          ></textarea>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold text-red-500 mb-2">Additional Notes</h3>
          <textarea
            className="w-full h-32 p-2 border border-gray-300 rounded-md resize-y"
            placeholder="Enter additional notes here..."
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
          ></textarea>
        </div>
        <button
          className="mt-6 bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600"
          onClick={handleSubmit}
        >
          Submit Prescription
        </button>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Prescribe;
