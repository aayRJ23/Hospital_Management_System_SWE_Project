import express from "express";
import { getAllInventoryDetails, addMedicine, updateMedicine, deleteMedicine } from "../controllers/inventory.controllers.js";

const router = express.Router();

router.get("/getall", getAllInventoryDetails);
router.post("/addMedicine", addMedicine);
router.put("/:id", updateMedicine);
router.delete("/:id", deleteMedicine);

export default router;