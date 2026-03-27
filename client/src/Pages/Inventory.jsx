import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import AddMedicine from "../Components/AddMedicine";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const { isAuthenticated } = useContext(Context);
  const [showAddMedicinePopup, setShowAddMedicinePopup] = useState(false);

  const fetchInventory = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/v1/inventory/getall",
        {
          withCredentials: true,
        }
      );
      setInventory(data.inventory || []);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const navigateTo = useNavigate();
  const goToLogin = () => {
    navigateTo("/login");
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesName =
      searchName === "" ||
      item.medicineName.toLowerCase().includes(searchName.toLowerCase());
    const matchesCategory =
      searchCategory === "" ||
      item.category.toLowerCase().includes(searchCategory.toLowerCase());

    return matchesName && matchesCategory;
  });

  const deleteMedicine = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/inventory/${id}`, {
        withCredentials: true,
      });
      setInventory(inventory.filter((item) => item._id !== id));
      toast.success("Medicine deleted successfully!");
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
      toast.error("Failed to delete medicine!");
    }
  };

  const handleAddMedicineClick = () => {
    setShowAddMedicinePopup(true);
  };

  const handleClosePopup = () => {
    setShowAddMedicinePopup(false);
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
            onClick={handleAddMedicineClick}
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
                <button
                  className="mt-3 p-2 bg-red-500 text-white rounded-lg w-full self-end"
                  onClick={() => deleteMedicine(item._id)}
                >
                  Remove
                </button>
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
      {showAddMedicinePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={handleClosePopup}
            >
              &times;
            </button>
            <AddMedicine onMedicineAdded={fetchInventory} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
