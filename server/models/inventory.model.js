import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        medicineName: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        composition: {
            type: String,
            required: true
        },
        generalUse: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [0, "Quantity cannot be negative"]
        },
        unitPrice: {
            type: Number,
            required: true,
            min: [0, "Unit Price cannot be negative"]
        },
        expiryDate: {
            type: Date,
            required: true
        }
    }
);

export const Inventory = mongoose.model("Inventory", inventorySchema);
