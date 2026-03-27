import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const FIELDS = [
  { key: "remarks", label: "Remarks", icon: "📋", placeholder: "Enter clinical remarks, observations..." },
  { key: "prescription", label: "Prescription", icon: "💊", placeholder: "Enter prescribed medicines, dosage, duration..." },
  { key: "medicineRecommendation", label: "Medicine Recommendation", icon: "🧴", placeholder: "Enter OTC suggestions or additional medicine notes..." },
  { key: "testReferral", label: "Test Referrals", icon: "🔬", placeholder: "Enter lab tests, imaging referrals..." },
  { key: "additionalNote", label: "Additional Notes", icon: "📝", placeholder: "Any other notes or follow-up instructions..." },
];

const Prescribe = ({ appointment, onClose }) => {
  const [form, setForm] = useState({ remarks: "", prescription: "", medicineRecommendation: "", testReferral: "", additionalNote: "" });
  const [loading, setLoading] = useState(false);

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
      } catch { /* not yet created, start blank */ }
    };
    fetchPrescription();
  }, [appointment._id]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/v1/prescribe/postPrescribe", {
        appointmentId: appointment._id, ...form,
      });
      toast.success("Prescription saved successfully");
      onClose();
    } catch (error) {
      toast.error("Error saving prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-100">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-red-600 to-red-500 rounded-t-2xl px-8 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-2xl">📋 Prescription</h2>
            <p className="text-red-100 text-sm mt-0.5">Doctor's editable view</p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full w-9 h-9 flex items-center justify-center text-2xl font-bold transition">×</button>
        </div>

        <div className="px-8 py-6 space-y-5">
          {/* Appointment Info Card */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 grid grid-cols-2 gap-2 text-sm">
            <p><span className="font-semibold text-red-700">Appointment Date:</span> {appointment.appointment_date.substring(0, 10)}</p>
            <p><span className="font-semibold text-red-700">Department:</span> {appointment.department}</p>
            <p><span className="font-semibold text-red-700">Status:</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-white text-xs ${appointment.status === "Accepted" ? "bg-green-500" : "bg-yellow-400"}`}>{appointment.status}</span>
            </p>
          </div>

          {/* Patient Info Card */}
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

          {/* Editable Fields */}
          {FIELDS.map(({ key, label, icon, placeholder }) => (
            <div key={key}>
              <label className="flex items-center gap-2 font-bold text-gray-700 mb-2">
                <span>{icon}</span> {label}
              </label>
              <textarea
                className="w-full h-28 p-3 border border-gray-300 rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-red-400 text-sm bg-white transition"
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </div>
          ))}

          {/* Actions */}
          <div className="flex gap-3 pt-2 pb-4">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-full hover:bg-gray-100 transition font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white py-2.5 rounded-full transition font-semibold"
            >
              {loading ? "Saving..." : "✅ Submit Prescription"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prescribe;