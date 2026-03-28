import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";

const GenerateBill = ({ closePopup, appointment }) => {
  const [consultationFee, setConsultationFee] = useState(0);
  const [billSent, setBillSent] = useState(
    appointment.paymentStatus !== "BillNotSend",
  );
  const [showEditPopup, setShowEditPopup] = useState(false);

  // ── Saved bill data fetched from DB (used when bill already sent) ──
  const [savedBill, setSavedBill] = useState(null);
  const [loadingSavedBill, setLoadingSavedBill] = useState(false);

  // Extra charges: each item { purpose, cost }
  const [extraCharges, setExtraCharges] = useState([
    { purpose: "Convenience Charge", cost: 60 },
  ]);
  const [editRows, setEditRows] = useState([]);

  const extraTotal = extraCharges.reduce(
    (sum, c) => sum + Number(c.cost || 0),
    0,
  );
  const gst = ((consultationFee + extraTotal) * 18) / 100;
  const total = consultationFee + extraTotal + gst;

  // ── Fetch saved bill from DB whenever bill is already sent ──────────
  useEffect(() => {
    if (billSent) {
      const fetchSavedBill = async () => {
        setLoadingSavedBill(true);
        try {
          const response = await axios.get(
            `http://localhost:8000/api/v1/bill/${appointment._id}`,
            { withCredentials: true },
          );
          if (response.status === 200) {
            setSavedBill(response.data);
          }
        } catch (error) {
          console.error("Error fetching saved bill:", error);
        } finally {
          setLoadingSavedBill(false);
        }
      };
      fetchSavedBill();
    }
  }, [billSent, appointment._id]);

  // ── Fetch consultation fee (used only when generating a new bill) ───
  useEffect(() => {
    if (!billSent) {
      const fetchConsultationFee = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/v1/users/doctors",
          );
          const data = response.data;
          if (data && data.success && Array.isArray(data.data)) {
            const doctor = data.data.find(
              (doc) => doc._id === appointment.doctorId,
            );
            if (doctor) setConsultationFee(doctor.doctorConsultationFee);
          }
        } catch (error) {
          console.error("Error fetching consultation fee: ", error);
        }
      };
      fetchConsultationFee();
    }
  }, [appointment.doctorId, billSent]);

  // Open edit popup — clone current extra charges into editRows
  const openEdit = () => {
    setEditRows(extraCharges.map((c) => ({ ...c })));
    setShowEditPopup(true);
  };

  const handleEditRowChange = (index, field, value) => {
    setEditRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addEditRow = () => {
    setEditRows((prev) => [...prev, { purpose: "", cost: "" }]);
  };

  const removeEditRow = (index) => {
    setEditRows((prev) => prev.filter((_, i) => i !== index));
  };

  const saveEdit = () => {
    const valid = editRows.filter((r) => r.purpose.trim() && r.cost !== "");
    setExtraCharges(valid);
    setShowEditPopup(false);
  };

  // ── PDF builder for the NEW (unsent) bill using local state ─────────
  const buildNewBillPDF = ({ extraChargesData, consultationFeeData }) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210;
    const margin = 15;
    const contentW = W - margin * 2;
    let y = 0;

    const extraTotalLocal = extraChargesData.reduce(
      (s, c) => s + Number(c.cost || 0),
      0,
    );
    const gstLocal = ((consultationFeeData + extraTotalLocal) * 18) / 100;
    const totalLocal = consultationFeeData + extraTotalLocal + gstLocal;

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

    const row = (
      label,
      value,
      yPos,
      leftX = margin + 3,
      rightX = margin + contentW / 2,
    ) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(label, leftX, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 30);
      doc.text(String(value), rightX, yPos);
      return yPos + 6;
    };

    const twoColRow = (l1, v1, l2, v2, yPos) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.text(l1, margin + 3, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 30);
      doc.text(String(v1), margin + 45, yPos);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text(l2, margin + contentW / 2 + 3, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 30);
      doc.text(String(v2), margin + contentW / 2 + 45, yPos);
      return yPos + 6;
    };

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
      new Date().toLocaleDateString(),
      "Department:",
      appointment.department,
      y,
    );
    y += 2;

    y = sectionHeader("Doctor Details", y);
    y = row("Doctor ID:", appointment.doctorId, y);
    y = twoColRow(
      "Doctor Name:",
      `${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
      "Department:",
      appointment.department,
      y,
    );
    y += 2;

    y = sectionHeader("Patient Details", y);
    y = twoColRow(
      "Patient Name:",
      `${appointment.firstName} ${appointment.lastName}`,
      "Patient ID:",
      appointment.patientId.substring(0, 16) + "...",
      y,
    );
    y = twoColRow("Email:", appointment.email, "Phone:", appointment.phone, y);
    y = twoColRow(
      "Date of Birth:",
      appointment.dob.substring(0, 10),
      "Gender:",
      appointment.gender,
      y,
    );
    y = twoColRow(
      "Aadhar No.:",
      appointment.nic,
      "Address:",
      appointment.address,
      y,
    );
    y += 4;

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

    feeRow("Doctor's Consultation Fee", consultationFeeData, false);
    extraChargesData.forEach((c, i) => {
      feeRow(c.purpose, Number(c.cost).toFixed(2), i % 2 === 0);
    });
    feeRow("GST (18%)", gstLocal.toFixed(2), extraChargesData.length % 2 === 0);

    doc.setFillColor(30, 30, 30);
    doc.rect(tableX, y, contentW, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TOTAL AMOUNT", tableX + 3, y + 5.5);
    doc.text(
      `Rs. ${totalLocal.toFixed(2)}`,
      tableX + col1W + col2W / 2,
      y + 5.5,
      { align: "center" },
    );
    y += 12;

    const statusColor =
      appointment.paymentStatus === "Paid" ? [22, 163, 74] : [239, 68, 68];
    doc.setFillColor(...statusColor);
    doc.roundedRect(margin, y, 40, 8, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const statusLabel =
      appointment.paymentStatus === "Paid"
        ? "PAID"
        : appointment.paymentStatus === "Unpaid"
          ? "UNPAID"
          : "PENDING";
    doc.text(statusLabel, margin + 20, y + 5.5, { align: "center" });
    y += 14;

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

    return doc;
  };

  // ── PDF builder for the SAVED bill fetched from DB ──────────────────
  const buildSavedBillPDF = (bill) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210;
    const margin = 15;
    const contentW = W - margin * 2;
    let y = 0;

    const extraChargesData = bill.extraCharges || [];

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
      bill.billingDate || new Date().toLocaleDateString(),
      "Department:",
      bill.department,
      y,
    );
    y += 2;

    y = sectionHeader("Doctor Details", y);
    y = row("Doctor ID:", String(bill.doctorId), y);
    y = twoColRow(
      "Doctor Name:",
      bill.doctorName,
      "Department:",
      bill.department,
      y,
    );
    y += 2;

    y = sectionHeader("Patient Details", y);
    y = twoColRow(
      "Patient Name:",
      bill.patientName,
      "Patient ID:",
      String(bill.patientId).substring(0, 16) + "...",
      y,
    );
    y = twoColRow("Email:", bill.patientEmail, "Phone:", bill.patientPhone, y);
    y = twoColRow("Date of Birth:", bill.dob, "Gender:", bill.gender, y);
    y = twoColRow("Aadhar No.:", bill.nic, "Address:", bill.address, y);
    y += 4;

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
      Number(bill.consultationFee).toFixed(2),
      false,
    );
    extraChargesData.forEach((c, i) => {
      feeRow(c.purpose, Number(c.cost).toFixed(2), i % 2 === 0);
    });
    feeRow(
      "GST (18%)",
      Number(bill.GST).toFixed(2),
      extraChargesData.length % 2 === 0,
    );

    doc.setFillColor(30, 30, 30);
    doc.rect(tableX, y, contentW, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TOTAL AMOUNT", tableX + 3, y + 5.5);
    doc.text(
      `Rs. ${Number(bill.totalAmount).toFixed(2)}`,
      tableX + col1W + col2W / 2,
      y + 5.5,
      { align: "center" },
    );
    y += 12;

    const isPaid = appointment.paymentStatus === "Paid";
    doc.setFillColor(...(isPaid ? [22, 163, 74] : [239, 68, 68]));
    doc.roundedRect(margin, y, 40, 8, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(isPaid ? "PAID" : "UNPAID", margin + 20, y + 5.5, {
      align: "center",
    });
    y += 14;

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

    return doc;
  };

  // ── Download: use savedBill if bill already sent, else local state ───
  const downloadBill = () => {
    if (billSent && savedBill) {
      const doc = buildSavedBillPDF(savedBill);
      doc.save(`Bill_${savedBill.patientName}_${appointment._id}.pdf`);
    } else {
      const doc = buildNewBillPDF({
        extraChargesData: extraCharges,
        consultationFeeData: consultationFee,
      });
      doc.save(
        `Bill_${appointment.firstName}_${appointment.lastName}_${appointment._id}.pdf`,
      );
    }
  };

  const sendBill = async () => {
    const convenienceCharge =
      extraCharges.find((c) => c.purpose === "Convenience Charge")?.cost || 0;

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
      extraCharges,
      gst: gst.toFixed(2),
      total: total.toFixed(2),
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/bill/create",
        billData,
        { withCredentials: true },
      );
      toast.success("Bill sent successfully");
      setBillSent(true);
      setSavedBill(response.data.bill); // store the newly created bill immediately
    } catch (error) {
      toast.error("Error sending bill");
      console.error("Error sending bill:", error);
    }
  };

  // ── Render the bill content area ────────────────────────────────────
  // If bill already sent, show saved bill from DB; otherwise show live local state
  const renderBillContent = () => {
    if (billSent) {
      if (loadingSavedBill) {
        return (
          <div className="mt-16 text-center text-gray-400 py-10">
            Loading bill...
          </div>
        );
      }
      if (!savedBill) {
        return (
          <div className="mt-16 text-center text-red-400 py-10">
            Failed to load bill data.
          </div>
        );
      }
      const {
        consultationFee: savedFee,
        GST: savedGst,
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
        extraCharges: savedExtras = [],
        billingDate,
      } = savedBill;

      return (
        <div id="bill-content" className="mt-16">
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
                {billingDate || new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="my-4"></div>
            <div className="flex justify-between">
              <p>
                <strong>Doctor's Name:</strong> {doctorName}
              </p>
            </div>
            <div className="flex justify-between">
              <p>
                <strong>Doctor's Department:</strong> {department}
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
              <p>₹{Number(savedFee).toFixed(2)}</p>
            </div>
            {savedExtras.map((c, i) => (
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
              <p>₹{Number(savedGst).toFixed(2)}</p>
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
      );
    }

    // Bill not yet sent — show live local-state bill
    return (
      <div id="bill-content" className="mt-16">
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
            <p className="font-bold text-xl mb-4">Wishing you a healthy life</p>
          </div>
        </div>
      </div>
    );
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
          Download Bill (PDF)
        </button>

        {/* Send Bill / Edit Bill buttons — only shown before bill is sent */}
        <div className="absolute top-14 left-4 flex flex-col gap-1">
          {billSent ? (
            <span className="text-sm font-bold text-gray-400 cursor-not-allowed">
              Bill Sent ✓
            </span>
          ) : (
            <>
              <button
                className="text-sm font-bold text-green-600 hover:text-green-800 text-left"
                onClick={sendBill}
              >
                Send Bill
              </button>
              <button
                className="text-sm font-bold text-orange-500 hover:text-orange-700 text-left"
                onClick={openEdit}
              >
                ✏️ Edit Charges
              </button>
            </>
          )}
        </div>

        {renderBillContent()}
      </div>

      {/* ── Edit Charges Popup ─────────────────────────────────────────── */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[60]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Edit Bill Charges
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Only Doctor's Consultation Fee is fixed. Add or edit all other
              charges below.
            </p>

            <div className="flex items-center gap-3 mb-3 bg-gray-50 rounded-lg px-3 py-2">
              <input
                className="flex-1 border-none bg-transparent text-sm font-medium text-gray-500 outline-none"
                value="Doctor's Consultation Fee"
                readOnly
              />
              <input
                className="w-28 border-none bg-transparent text-sm font-medium text-gray-500 text-right outline-none"
                value={`₹ ${consultationFee}`}
                readOnly
              />
            </div>

            <div className="text-xs font-semibold text-gray-400 uppercase flex gap-3 px-3 mb-1">
              <span className="flex-1">Purpose / Description</span>
              <span className="w-28 text-right">Cost (₹)</span>
              <span className="w-6"></span>
            </div>

            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
              {editRows.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2"
                >
                  <input
                    className="flex-1 text-sm border-none bg-transparent outline-none focus:ring-0"
                    placeholder="e.g. Medicine, Room charge..."
                    value={row.purpose}
                    onChange={(e) =>
                      handleEditRowChange(i, "purpose", e.target.value)
                    }
                  />
                  <input
                    className="w-28 text-sm border-none bg-transparent outline-none text-right focus:ring-0"
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={row.cost}
                    onChange={(e) =>
                      handleEditRowChange(i, "cost", e.target.value)
                    }
                  />
                  <button
                    onClick={() => removeEditRow(i)}
                    className="w-6 text-red-400 hover:text-red-600 font-bold text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addEditRow}
              className="mt-3 w-full border-2 border-dashed border-orange-300 text-orange-500 hover:border-orange-500 hover:text-orange-700 rounded-lg py-2 text-sm font-semibold transition"
            >
              + Add Item
            </button>

            <div className="mt-4 bg-gray-800 text-white rounded-lg px-4 py-3 flex justify-between items-center text-sm font-semibold">
              <span>GST (18%)</span>
              <span>
                ₹{" "}
                {(
                  ((consultationFee +
                    editRows.reduce((s, r) => s + Number(r.cost || 0), 0)) *
                    18) /
                  100
                ).toFixed(2)}
              </span>
            </div>
            <div className="mt-1 bg-red-600 text-white rounded-lg px-4 py-3 flex justify-between items-center font-bold">
              <span>Total</span>
              <span>
                ₹{" "}
                {(
                  consultationFee +
                  editRows.reduce((s, r) => s + Number(r.cost || 0), 0) +
                  ((consultationFee +
                    editRows.reduce((s, r) => s + Number(r.cost || 0), 0)) *
                    18) /
                    100
                ).toFixed(2)}
              </span>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowEditPopup(false)}
                className="flex-1 border border-gray-300 text-gray-600 rounded-lg py-2 text-sm font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 bg-green-600 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green-700 transition"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateBill;
