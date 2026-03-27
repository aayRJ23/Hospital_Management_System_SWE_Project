import { Inventory } from "../models/inventory.model.js";
import ErrorHandler from "../middlewares/error.middlewares.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllInventoryDetails = asyncHandler(async (req, res, next) => {
  const inventory = await Inventory.find();
  res.status(200).json({ success: true, inventory });
});

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
  res
    .status(201)
    .json({
      success: true,
      message: "Medicine added successfully!",
      data: newMedicine,
    });
});

export const updateMedicine = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    medicineName,
    category,
    composition,
    generalUse,
    quantity,
    unitPrice,
    expiryDate,
  } = req.body;
  const medicine = await Inventory.findByIdAndUpdate(
    id,
    {
      medicineName,
      category,
      composition,
      generalUse,
      quantity,
      unitPrice,
      expiryDate,
    },
    { new: true, runValidators: true },
  );
  if (!medicine) return next(new ErrorHandler("Medicine not found", 404));
  res
    .status(200)
    .json({
      success: true,
      message: "Medicine updated successfully!",
      data: medicine,
    });
});

export const deleteMedicine = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const medicine = await Inventory.findByIdAndDelete(id);
  if (!medicine) return next(new ErrorHandler("Medicine not found", 404));
  res
    .status(200)
    .json({ success: true, message: "Medicine deleted successfully!" });
});
