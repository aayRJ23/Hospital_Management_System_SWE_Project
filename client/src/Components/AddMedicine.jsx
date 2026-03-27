import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaPills,
  FaListAlt,
  FaFlask,
  FaClipboard,
  FaSortNumericUp,
  FaCalendarAlt,
  FaRupeeSign,
} from "react-icons/fa";

const AddMedicine = ({ onMedicineAdded }) => {
  const [medicineName, setMedicineName] = useState("");
  const [category, setCategory] = useState("");
  const [composition, setComposition] = useState("");
  const [generalUse, setGeneralUse] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const handleAddNewMedicine = async (e) => {
    e.preventDefault();
    try {
      const newMedicine = {
        medicineName,
        category,
        composition,
        generalUse,
        quantity,
        unitPrice,
        expiryDate,
      };
      const { data } = await axios.post(
        "http://localhost:8000/api/v1/inventory/addMedicine",
        newMedicine,
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      clearForm();
      onMedicineAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const clearForm = () => {
    setMedicineName("");
    setCategory("");
    setComposition("");
    setGeneralUse("");
    setQuantity("");
    setUnitPrice("");
    setExpiryDate("");
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-96 bg-white p-5 rounded-3xl border border-black overflow-y-auto max-h-screen">
        <h1 className="font-bold text-3xl mb-5 text-center bg-green-500 text-white py-2 px-4 rounded-full">
          Add New Medicine
        </h1>
        <form onSubmit={handleAddNewMedicine}>
          <div className="mb-4 flex items-center">
            <FaPills className="mr-3" />
            <input
              className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
              type="text"
              placeholder="Medicine Name"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <FaListAlt className="mr-3" />
            <input
              className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <FaFlask className="mr-3" />
            <input
              className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
              type="text"
              placeholder="Composition"
              value={composition}
              onChange={(e) => setComposition(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <FaClipboard className="mr-3" />
            <input
              className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
              type="text"
              placeholder="General Use"
              value={generalUse}
              onChange={(e) => setGeneralUse(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <FaSortNumericUp className="mr-3" />
            <input
              className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <FaRupeeSign className="mr-3" />
            <input
              className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
              type="number"
              step="0.01"
              placeholder="Unit Price"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <FaCalendarAlt className="mr-3" />
            <input
              className="w-full h-10 bg-zinc-200 rounded-2xl px-4 border border-black"
              type="date"
              placeholder="Expiry Date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              type="button"
              onClick={clearForm}
              className="w-48 bg-red-500 text-white rounded-2xl h-10 font-semibold transition duration-300 hover:bg-gradient-to-r from-red-500 to-red-700"
            >
              CLEAR
            </button>
            <button
              type="submit"
              className="w-48 bg-green-500 text-white rounded-2xl h-10 font-semibold transition duration-300 hover:bg-gradient-to-r from-green-500 to-green-700"
            >
              ADD NEW MEDICINE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicine;
