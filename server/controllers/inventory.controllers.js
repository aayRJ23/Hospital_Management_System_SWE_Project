import { Inventory } from "../models/inventory.model.js";
import ErrorHandler from "../middlewares/error.middlewares.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Fetch all inventory details
export const getAllInventoryDetails = asyncHandler(async (req, res, next) => {
  const inventory = await Inventory.find();
  res.status(200).json({
    success: true,
    inventory,
  });
});

// Add new medicine
export const addMedicine = asyncHandler(async (req, res, next) => {
  const {
    medicineName,
    category,
    composition,
    generalUse,
    quantity,
    unitPrice,
    expiryDate,
  } = req.body;

  if (
    !medicineName ||
    !category ||
    !composition ||
    !generalUse ||
    !quantity ||
    !unitPrice ||
    !expiryDate
  ) {
    return next(new ErrorHandler("Please fill out the entire form", 400));
  }

  const newMedicine = await Inventory.create({
    medicineName,
    category,
    composition,
    generalUse,
    quantity,
    unitPrice,
    expiryDate,
  });

  res.status(201).json({
    success: true,
    message: "Medicine added successfully!",
    data: newMedicine,
  });
});


// Delete medicine
export const deleteMedicine = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);

    const medicine = await Inventory.findByIdAndDelete(id);
    if (!medicine) {
      return next(new ErrorHandler("Medicine not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully!",
    });
});
