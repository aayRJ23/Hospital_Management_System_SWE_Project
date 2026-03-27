import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";

const ReceiveBill = ({ closePopup, appointment }) => {
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    // Function to fetch the bill data
    const fetchBillData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/bill/getBill/${appointment._id}`
        );

        // Log the entire response object to understand its structure
        console.log("Response object:", response);

        // Check the structure of response.data
        const data = response.data;
        console.log("Response data:", data);

        if (response.status === 200) {
          setBillData(data);
        } else {
          console.error("Bill not found");
        }
      } catch (error) {
        console.error("Error fetching bill: ", error);
      }
    };

    fetchBillData();
  }, [appointment._id]);

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
        link.download = `bill_${billData.patientName}_${billData.appointmentId}.png`;

        // Append the link to the document, trigger a click, and remove it
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error generating PNG: ", error);
      });
  };

  if (!billData) {
    return <div>Loading...</div>;
  }

  const {
    consultationFee,
    convenienceCharge,
    GST,
    totalAmount,
    appointmentDate,
    billingDate,
    doctorName,
    department,
    patientName,
    patientId,
    patientEmail,
    dob,
    patientPhone,
    nic,
    gender,
    address,
  } = billData;

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
                <strong>Name:</strong> {patientName}
              </p>
              <div className="flex justify-between mr-9">
                <p>
                  <strong>Patient ID:</strong> {patientId}
                </p>
                <p>
                  <strong>Email:</strong> {patientEmail}
                </p>
              </div>
              <div className="flex justify-between pr-14 mr-10">
                <p>
                  <strong>DOB:</strong> {dob}
                </p>
                <p>
                  <strong>Phone:</strong> {patientPhone}
                </p>
              </div>
              <div className="flex justify-between pr-14 mr-24">
                <p>
                  <strong>Aadhar No.:</strong> {nic}
                </p>
                <p>
                  <strong>Gender:</strong> {gender}
                </p>
              </div>
              <p>
                <strong>Address:</strong> {address}
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
              <p>₹{GST}</p>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <p className="font-bold">
                <strong>Total Amount:</strong>
              </p>
              <p className="font-bold">₹{totalAmount}</p>
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

export default ReceiveBill;
