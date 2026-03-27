import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";

const GenerateBill = ({ closePopup, appointment }) => {
  const [consultationFee, setConsultationFee] = useState(0);
  const convenienceCharge = 60;
  const gst = ((consultationFee + convenienceCharge) * 18) / 100;
  const total = consultationFee + convenienceCharge + gst;

  useEffect(() => {
    // Function to fetch the doctor's consultation fee
    const fetchConsultationFee = async () => {
      try {
        // Fetch all doctors from the new endpoint
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/doctors"
        );

        // Log the entire response object to understand its structure
        console.log("Response object:", response);

        // Check the structure of response.data
        const data = response.data;
        console.log("Response data:", data);

        // Extract the array of doctors
        if (data && data.success && Array.isArray(data.data)) {
          const doctorsArray = data.data;
          console.log("Doctors array:", doctorsArray);

          // Find the doctor with the matching ID
          const doctor = doctorsArray.find(
            (doc) => doc._id === appointment.doctorId
          );
          console.log(doctor);
          if (doctor) {
            setConsultationFee(doctor.doctorConsultationFee);
            console.log(doctor.doctorConsultationFee);
          } else {
            console.error("Doctor not found");
          }
        } else {
          console.error(
            "Fetched data is not in the expected format or unsuccessful request"
          );
        }
      } catch (error) {
        console.error("Error fetching consultation fee: ", error);
      }
    };

    fetchConsultationFee();
  }, [appointment.doctorId]);

  const downloadBill = () => {
    const input = document.getElementById("bill-content");

    html2canvas(input, { scale: 2, useCORS: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        // Create a new canvas with padding and border
        const margin = 40; // Margin in pixels
        const borderWidth = 4; // Border width in pixels
        const outputCanvas = document.createElement("canvas");
        const context = outputCanvas.getContext("2d");

        outputCanvas.width = canvas.width + margin * 2;
        outputCanvas.height = canvas.height + margin * 2;

        // Fill background with white
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

        // Draw the captured image onto the new canvas with margin
        context.drawImage(canvas, margin, margin);

        // Draw the border
        context.lineWidth = borderWidth;
        context.strokeStyle = "#000000";
        context.strokeRect(
          margin / 2,
          margin / 2,
          outputCanvas.width - margin,
          outputCanvas.height - margin
        );

        const outputImgData = outputCanvas.toDataURL("image/png");

        // Create a link element, set it to download the image
        const link = document.createElement("a");
        link.href = outputImgData;
        link.download = `bill_${appointment.firstName}_${appointment.lastName}__${appointment._id}.png`;

        // Append the link to the document, trigger a click, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error generating PNG: ", error);
      });
  };

  const sendBill = async () => {
    const billData = {
      appointmentId: appointment._id,
      appointmentDate: appointment.appointment_date.substring(0, 10),
      billingDate: new Date().toLocaleDateString(),
      doctorId: appointment.doctorId,
      doctorName: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
      department: appointment.department,
      patientName: `${appointment.firstName} ${appointment.lastName}`,
      patientId: appointment.patientId,
      email: appointment.email,
      dob: appointment.dob.substring(0, 10),
      phone: appointment.phone,
      nic: appointment.nic,
      gender: appointment.gender,
      address: appointment.address,
      consultationFee,
      convenienceCharge,
      gst: gst.toFixed(2),
      total: total.toFixed(2),
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/bill/createBill",
        billData
      );
      toast.success("Bill sent successfully");
      console.log("Bill sent successfully:", response.data);
    } catch (error) {
      toast.error("Error sending bill");
      console.error("Error sending bill:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-screen overflow-y-auto relative border-4 border-gray-800">
        <button
          className="absolute top-4 right-4 text-2xl font-bold text-gray-600"
          onClick={closePopup}
        >
          ×
        </button>
        <button
          className="absolute top-4 left-4 text-xl font-bold text-blue-600"
          onClick={downloadBill}
        >
          Download Bill
        </button>
        {appointment.paymentStatus === "BillNotSend" && (
          <button
            className="absolute top-16 left-4 text-xl font-bold text-green-600"
            onClick={sendBill}
          >
            Send Bill
          </button>
        )}
        <div id="bill-content">
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold mb-1">MedEazy</h1>
            <p className="font-bold">123 Health St, Wellness City</p>
            <p className="font-bold">Phone: (123) 456-7890</p>
          </div>
          <hr className="my-4" />
          <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">
            Billing Details
          </h2>
          <hr className="my-4" />
          <div className="space-y-4">
            <div className="flex justify-between">
              <p>
                <strong>Appointment ID:</strong> {appointment._id}
              </p>
              <p>
                <strong>Appointment Date:</strong>{" "}
                {appointment.appointment_date.substring(0, 10)}
              </p>
            </div>
            <div className="flex justify-between">
              <p>
                <strong>Date of Billing:</strong>{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="my-4"></div> {/* Slight gap */}
            <div className="flex justify-between">
              <p>
                <strong>Doctor's ID:</strong> {appointment.doctorId}
              </p>
            </div>
            <div className="flex justify-between">
              <p>
                <strong>Doctor's Name:</strong> {appointment.doctor.firstName}{" "}
                {appointment.doctor.lastName}
              </p>
            </div>
            <div className="flex justify-between">
              <p>
                <strong>Doctor's Department:</strong> {appointment.department}
              </p>
            </div>
            <div className="my-4"></div> {/* Slight gap */}
            <h3 className="text-xl font-bold text-red-500">Patient Details</h3>
            <div className="space-y-2">
              <p className="text-lg">
                <strong>Name:</strong> {appointment.firstName}{" "}
                {appointment.lastName}
              </p>
              <div className="flex justify-between mr-9">
                <p>
                  <strong>Patient ID:</strong> {appointment.patientId}
                </p>
                <p>
                  <strong>Email:</strong> {appointment.email}
                </p>
              </div>
              <div className="flex justify-between pr-14 mr-10">
                <p>
                  <strong>DOB:</strong> {appointment.dob.substring(0, 10)}
                </p>
                <p>
                  <strong>Phone:</strong> {appointment.phone}
                </p>
              </div>
              <div className="flex justify-between pr-14 mr-24">
                <p>
                  <strong>Aadhar No.:</strong> {appointment.nic}
                </p>
                <p>
                  <strong>Gender:</strong> {appointment.gender}
                </p>
              </div>
              <p>
                <strong>Address:</strong> {appointment.address}
              </p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between">
              <p>
                <strong>Doctor's Consultation Fee:</strong>
              </p>
              <p>₹{consultationFee}</p>
            </div>
            <div className="flex justify-between">
              <p>
                <strong>Convenience Charge:</strong>
              </p>
              <p>₹{convenienceCharge}</p>
            </div>
            <div className="flex justify-between">
              <p>
                <strong>GST (18%):</strong>
              </p>
              <p>₹{gst.toFixed(2)}</p>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <p className="font-bold">
                <strong>Total Amount:</strong>
              </p>
              <p className="font-bold">₹{total.toFixed(2)}</p>
            </div>
            <hr className="my-4" />
            <div className="text-center">
              <p className="font-bold text-xl mb-4">
                Wishing you a healthy life
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateBill;
