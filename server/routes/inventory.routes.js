import express from "express";
import { getAllInventoryDetails, addMedicine ,deleteMedicine} from "../controllers/inventory.controllers.js";

const router = express.Router();

router.get("/getall", getAllInventoryDetails);
router.post("/addMedicine", addMedicine);
router.delete("/:id", deleteMedicine);

export default router;
