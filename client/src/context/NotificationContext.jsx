// client/src/context/NotificationContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import socket from "../socket";
import { Context } from "../main";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useContext(Context);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // ── Derive current user ID from localStorage ──────────────────────────────
  const getCurrentUserId = () => {
    try {
      const patient = localStorage.getItem("patient");
      const doctor = localStorage.getItem("doctor");
      const admin = localStorage.getItem("admin");
      if (patient) return JSON.parse(patient)?._id || JSON.parse(patient)?.id;
      if (doctor) return JSON.parse(doctor)?._id || JSON.parse(doctor)?.id;
      if (admin) return JSON.parse(admin)?._id || JSON.parse(admin)?.id;
    } catch {
      return null;
    }
    return null;
  };

  // ── Fetch existing notifications from DB ──────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/notifications",
        { withCredentials: true }
      );
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      // Silently ignore — user may not be logged in
    }
  }, []);

  // ── Connect socket & register user when authenticated ─────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      socket.disconnect();
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Connect socket
    if (!socket.connected) socket.connect();

    // Register user with their MongoDB _id so server can route notifications
    const userId = getCurrentUserId();
    if (userId) {
      socket.emit("register", userId);
    }

    // Fetch existing notifications from DB
    fetchNotifications();

    // Listen for incoming real-time notifications
    const handleNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [isAuthenticated, fetchNotifications]);

  // ── Mark single notification as read ─────────────────────────────────────
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:8000/api/v1/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // ── Mark all as read ──────────────────────────────────────────────────────
  const markAllAsRead = async () => {
    try {
      await axios.put(
        "http://localhost:8000/api/v1/notifications/mark-all-read",
        {},
        { withCredentials: true }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  // ── Delete a notification ─────────────────────────────────────────────────
  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/notifications/${id}`,
        { withCredentials: true }
      );
      setNotifications((prev) => {
        const removed = prev.find((n) => n._id === id);
        if (removed && !removed.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n._id !== id);
      });
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isOpen,
        setIsOpen,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);