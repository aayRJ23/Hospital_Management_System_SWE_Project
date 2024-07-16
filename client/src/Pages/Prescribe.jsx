import React from "react";
import "./Prescribe.css";

const Prescribe = ({ appointment, onClose }) => {
  return (
    <div className="prescribe-overlay">
      <div className="prescribe-container">
        <button className="close-button" onClick={onClose}>×</button>
        <h2 className="prescribe-title">Patient Details</h2>
        <div className="prescribe-details">
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
        <div className="prescribe-section">
          <h3 className="prescribe-subtitle">Prescription</h3>
          <textarea className="prescribe-textarea" placeholder="Enter prescription details here..."></textarea>
        </div>
        <div className="prescribe-section">
          <h3 className="prescribe-subtitle">Medicine Recommendation</h3>
          <textarea className="prescribe-textarea" placeholder="Enter medicine recommendation here..."></textarea>
        </div>
        <button className="submit-button">Submit Prescription</button>
      </div>
    </div>
  );
};

export default Prescribe;
