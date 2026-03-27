import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import AddMedicine from "../Components/AddMedicine";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const { isAuthenticated } = useContext(Context);
  const [showAddMedicinePopup, setShowAddMedicinePopup] = useState(false);
  const [editItem, setEditItem] = useState(null); // holds item being edited
  const [editForm, setEditForm] = useState({});

  const fetchInventory = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/inventory/getall", { withCredentials: true });
      setInventory(data.inventory || []);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const navigateTo = useNavigate();

  const filteredInventory = inventory.filter((item) => {
    const matchesName = searchName === "" || item.medicineName.toLowerCase().includes(searchName.toLowerCase());
    const matchesCategory = searchCategory === "" || item.category.toLowerCase().includes(searchCategory.toLowerCase());
    return matchesName && matchesCategory;
  });

  const deleteMedicine = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/inventory/${id}`, { withCredentials: true });
      setInventory(inventory.filter((item) => item._id !== id));
      toast.success("Medicine deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete medicine!");
    }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setEditForm({
      medicineName: item.medicineName,
      category: item.category,
      composition: item.composition,
      generalUse: item.generalUse,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      expiryDate: new Date(item.expiryDate).toISOString().substring(0, 10),
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async () => {
    try {
      await axios.put(`http://localhost:8000/api/v1/inventory/${editItem._id}`, editForm, { withCredentials: true });
      toast.success("Medicine updated successfully!");
      setEditItem(null);
      fetchInventory();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update medicine!");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <section className="page messages p-7 w-full">
        <div className="w-full flex justify-center">
          <h1 className="font-bold text-3xl mb-5 text-center bg-red-500 text-white py-2 px-4 rounded-full">
            Medicine
          </h1>
        </div>
        <div className="flex justify-center mb-6">
          <div className="relative mx-2">
            <input
              type="text"
              className="p-2 border border-black rounded-lg w-64"
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          <div className="relative mx-2">
            <input
              type="text"
              className="p-2 border border-black rounded-lg w-64"
              placeholder="Search by category"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          <button
            className="mx-2 p-2 bg-green-500 text-white rounded-lg"
            onClick={() => setShowAddMedicinePopup(true)}
          >
            Add Medicine
          </button>
        </div>

        <div className="ml-24 pl-14 doc-details p-5 flex flex-wrap justify-center">
          {filteredInventory && filteredInventory.length > 0 ? (
            filteredInventory.map((item, index) => (
              <div
                key={item._id}
                className="bg-white shadow-md p-5 m-2 rounded-lg w-80 border border-gray-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center mb-2">
                    <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center mr-3">
                      <span className="font-bold text-lg">{index + 1}</span>
                    </div>
                    <h2 className="font-bold text-xl">{item.medicineName}</h2>
                  </div>
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Composition:</strong> {item.composition}</p>
                  <p><strong>General Use:</strong> {item.generalUse}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Unit Price:</strong> ₹ {item.unitPrice.toFixed(2)}</p>
                  <p><strong>Expiry Date:</strong> {new Date(item.expiryDate).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    className="flex-1 flex items-center justify-center gap-1 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    onClick={() => openEdit(item)}
                  >
                    <FaEdit size={13} /> Edit
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    onClick={() => deleteMedicine(item._id)}
                  >
                    <FaTrash size={13} /> Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <h1 className="text-4xl font-bold text-gray-500 mb-4">No Medicine Items</h1>
              <p className="text-lg text-gray-400">Please add some medicines to your inventory.</p>
            </div>
          )}
        </div>
      </section>

      {/* Add Medicine Popup */}
      {showAddMedicinePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowAddMedicinePopup(false)}>
              &times;
            </button>
            <AddMedicine onMedicineAdded={fetchInventory} />
          </div>
        </div>
      )}

      {/* Edit Medicine Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative max-h-screen overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setEditItem(null)}
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Edit Medicine</h2>

            {[
              { label: "Medicine Name", name: "medicineName", type: "text" },
              { label: "Category", name: "category", type: "text" },
              { label: "Composition", name: "composition", type: "text" },
              { label: "General Use", name: "generalUse", type: "text" },
              { label: "Quantity", name: "quantity", type: "number" },
              { label: "Unit Price (₹)", name: "unitPrice", type: "number" },
              { label: "Expiry Date", name: "expiryDate", type: "date" },
            ].map(({ label, name, type }) => (
              <div className="mb-4" key={name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={editForm[name]}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditItem(null)}
                className="flex-1 border border-gray-300 text-gray-600 px-4 py-2 rounded-full hover:bg-gray-100 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={submitEdit}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition font-semibold"
              >
                <FaCheck size={13} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;