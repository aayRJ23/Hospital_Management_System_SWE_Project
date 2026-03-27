// server/controllers/notification.controllers.js
import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorHandler from "../middlewares/error.middlewares.js";

// Get all notifications for the logged-in user (newest first)
export const getMyNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({
    recipientId: req.user._id,
  }).sort({ createdAt: -1 });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  res.status(200).json({
    success: true,
    notifications,
    unreadCount,
  });
});

// Mark single notification as read
export const markAsRead = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const notification = await Notification.findOneAndUpdate(
    { _id: id, recipientId: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }
  res.status(200).json({ success: true, notification });
});

// Mark ALL notifications as read for logged-in user
export const markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { recipientId: req.user._id, isRead: false },
    { isRead: true }
  );
  res.status(200).json({ success: true, message: "All notifications marked as read" });
});

// Delete a notification
export const deleteNotification = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const notification = await Notification.findOneAndDelete({
    _id: id,
    recipientId: req.user._id,
  });
  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }
  res.status(200).json({ success: true, message: "Notification deleted" });
});

// ─── Internal helper (used by other controllers, not a route) ────────────────
// Creates a notification in DB and fires it via socket to online users
import { Notification as NotificationModel } from "../models/notification.model.js";
import { sendNotificationToUser } from "../socket.js";

export const createAndSendNotification = async ({
  recipientId,
  recipientRole,
  type,
  title,
  message,
  meta = {},
}) => {
  try {
    const notification = await NotificationModel.create({
      recipientId,
      recipientRole,
      type,
      title,
      message,
      meta,
    });
    // Push real-time to online user
    sendNotificationToUser(recipientId.toString(), {
      _id: notification._id,
      type,
      title,
      message,
      meta,
      isRead: false,
      createdAt: notification.createdAt,
    });
    return notification;
  } catch (err) {
    console.error("Failed to create/send notification:", err.message);
  }
};