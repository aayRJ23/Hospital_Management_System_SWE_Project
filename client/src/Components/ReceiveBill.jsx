import axios from "axios";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const ReceiveBill = ({ closePopup, appointment }) => {
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    const fetchBillData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/bill/${appointment._id}`,
          { withCredentials: true },
        );
        if (response.status === 200) {
          setBillData(response.data);
        }
      } catch (error) {
        console.error("Error fetching bill: ", error);
      }
    };
    fetchBillData();
  }, [appointment._id]);

  const downloadBill = () => {
    if (!billData) return;

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210;
    const margin = 15;
    const contentW = W - margin * 2;
    let y = 0;

    const extraCharges = billData.extraCharges || [];
    const extraTotal = extraCharges.reduce(
      (s, c) => s + Number(c.cost || 0),
      0,
    );

    // Header band
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, W, 38, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("MedEazy", W / 2, 15, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      "123 Health St, Wellness City  |  Phone: (123) 456-7890",
      W / 2,
      22,
      { align: "center" },
    );
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, 27, 35, 8, 4, 4, "F");
    doc.setTextColor(220, 38, 38);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("INVOICE", margin + 17.5, 32.5, { align: "center" });
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, W - margin, 32.5, {
      align: "right",
    });

    y = 46;

    const sectionHeader = (label, yPos) => {
      doc.setFillColor(254, 242, 242);
      doc.rect(margin, yPos, contentW, 8, "F");
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.4);
      doc.line(margin, yPos + 8, margin + contentW, yPos + 8);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(220, 38, 38);
      doc.text(label, margin + 3, yPos + 5.5);
      return yPos + 12;
    };

    const row = (label, value, yPos) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(label, margin + 3, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 30);
      doc.text(String(value ?? ""), margin + contentW / 2, yPos);
      return yPos + 6;
    };

    const twoColRow = (l1, v1, l2, v2, yPos) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(l1, margin + 3, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 30);
      doc.text(String(v1 ?? ""), margin + 45, yPos);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text(l2, margin + contentW / 2 + 3, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 30);
      doc.text(String(v2 ?? ""), margin + contentW / 2 + 45, yPos);
      return yPos + 6;
    };

    // Appointment Info
    y = sectionHeader("Appointment Information", y);
    y = twoColRow(
      "Appointment ID:",
      appointment._id.substring(0, 18) + "...",
      "Appointment Date:",
      appointment.appointment_date.substring(0, 10),
      y,
    );
    y = twoColRow(
      "Billing Date:",
      billData.billingDate || new Date().toLocaleDateString(),
      "Department:",
      billData.department,
      y,
    );
    y += 2;

    // Doctor Info
    y = sectionHeader("Doctor Details", y);
    y = row("Doctor ID:", billData.doctorId, y);
    y = twoColRow(
      "Doctor Name:",
      billData.doctorName,
      "Department:",
      billData.department,
      y,
    );
    y += 2;

    // Patient Info
    y = sectionHeader("Patient Details", y);
    y = twoColRow(
      "Patient Name:",
      billData.patientName,
      "Patient ID:",
      String(billData.patientId).substring(0, 16) + "...",
      y,
    );
    y = twoColRow(
      "Email:",
      billData.patientEmail,
      "Phone:",
      billData.patientPhone,
      y,
    );
    y = twoColRow(
      "Date of Birth:",
      billData.dob,
      "Gender:",
      billData.gender,
      y,
    );
    y = twoColRow("Aadhar No.:", billData.nic, "Address:", billData.address, y);
    y += 4;

    // Fee Table
    y = sectionHeader("Fee Breakdown", y);
    const tableX = margin;
    const col1W = contentW * 0.65;
    const col2W = contentW * 0.35;

    doc.setFillColor(220, 38, 38);
    doc.rect(tableX, y, contentW, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Description", tableX + 3, y + 5);
    doc.text("Amount", tableX + col1W + col2W / 2, y + 5, { align: "center" });
    y += 7;

    const feeRow = (desc, amount, shade) => {
      if (shade) {
        doc.setFillColor(254, 242, 242);
        doc.rect(tableX, y, contentW, 6.5, "F");
      }
      doc.setTextColor(30, 30, 30);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(desc, tableX + 3, y + 4.5);
      doc.text(`Rs. ${amount}`, tableX + col1W + col2W / 2, y + 4.5, {
        align: "center",
      });
      y += 6.5;
    };

    feeRow(
      "Doctor's Consultation Fee",
      Number(billData.consultationFee).toFixed(2),
      false,
    );
    extraCharges.forEach((c, i) => {
      feeRow(c.purpose, Number(c.cost).toFixed(2), i % 2 === 0);
    });
    feeRow(
      "GST (18%)",
      Number(billData.GST).toFixed(2),
      extraCharges.length % 2 === 0,
    );

    // Total
    doc.setFillColor(30, 30, 30);
    doc.rect(tableX, y, contentW, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TOTAL AMOUNT", tableX + 3, y + 5.5);
    doc.text(
      `Rs. ${Number(billData.totalAmount).toFixed(2)}`,
      tableX + col1W + col2W / 2,
      y + 5.5,
      { align: "center" },
    );
    y += 12;

    // Payment status badge
    const isPaid =
      billData.paymentStatus === "Paid" || appointment.paymentStatus === "Paid";
    doc.setFillColor(...(isPaid ? [22, 163, 74] : [239, 68, 68]));
    doc.roundedRect(margin, y, 40, 8, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(isPaid ? "PAID" : "UNPAID", margin + 20, y + 5.5, {
      align: "center",
    });
    y += 14;

    // Footer
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentW, y);
    y += 6;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Wishing you a speedy recovery and a healthy life.", W / 2, y, {
      align: "center",
    });
    y += 5;
    doc.setFontSize(8);
    doc.text(
      "This is a computer-generated document. No signature required.",
      W / 2,
      y,
      { align: "center" },
    );

    doc.save(`Bill_${billData.patientName}_${appointment._id}.pdf`);
  };

  if (!billData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-10 rounded-lg shadow-lg text-center">
          <p className="text-gray-500 text-lg">Loading bill...</p>
        </div>
      </div>
    );
  }

  const {
    consultationFee,
    GST,
    totalAmount,
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
    extraCharges = [],
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
          Download Bill (PDF)
        </button>
        <div id="bill-content" className="mt-10">
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
            <div className="my-4"></div>
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
            <div className="my-4"></div>
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
              <p>₹{Number(consultationFee).toFixed(2)}</p>
            </div>
            {extraCharges.map((c, i) => (
              <div key={i} className="flex justify-between">
                <p>
                  <strong>{c.purpose}:</strong>
                </p>
                <p>₹{Number(c.cost).toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between">
              <p>
                <strong>GST (18%):</strong>
              </p>
              <p>₹{Number(GST).toFixed(2)}</p>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <p className="font-bold">
                <strong>Total Amount:</strong>
              </p>
              <p className="font-bold">₹{Number(totalAmount).toFixed(2)}</p>
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
