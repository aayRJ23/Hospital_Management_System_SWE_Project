// server/routes/notification.routes.js
import express from "express";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controllers.js";
import { isAnyAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all notifications for logged-in user (any role)
router.get("/", isAnyAuthenticated, getMyNotifications);

// Mark a single notification as read
router.put("/:id/read", isAnyAuthenticated, markAsRead);

// Mark ALL notifications as read
router.put("/mark-all-read", isAnyAuthenticated, markAllAsRead);

// Delete a notification
router.delete("/:id", isAnyAuthenticated, deleteNotification);

export default router;