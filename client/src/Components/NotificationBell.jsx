// client/src/Components/NotificationBell.jsx
import React, { useContext, useEffect, useRef } from "react";
import { useNotifications } from "../context/NotificationContext";
import { Context } from "../main";
import { FaBell, FaTimes, FaTrash, FaCheckDouble } from "react-icons/fa";

// ── Utility: relative time string ────────────────────────────────────────────
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
};

// ── Icon & color per notification type ───────────────────────────────────────
const typeConfig = {
  APPOINTMENT_BOOKED: { emoji: "📅", color: "bg-blue-100 border-blue-400 text-blue-800" },
  APPOINTMENT_ACCEPTED: { emoji: "✅", color: "bg-green-100 border-green-400 text-green-800" },
  APPOINTMENT_REJECTED: { emoji: "❌", color: "bg-red-100 border-red-400 text-red-800" },
  APPOINTMENT_PENDING: { emoji: "🔄", color: "bg-yellow-100 border-yellow-400 text-yellow-800" },
  VIDEO_CALL_SCHEDULED: { emoji: "📹", color: "bg-purple-100 border-purple-400 text-purple-800" },
  PRESCRIPTION_RECEIVED: { emoji: "💊", color: "bg-teal-100 border-teal-400 text-teal-800" },
  BILL_GENERATED: { emoji: "🧾", color: "bg-orange-100 border-orange-400 text-orange-800" },
  BILL_PAID: { emoji: "💰", color: "bg-emerald-100 border-emerald-400 text-emerald-800" },
  PATIENT_CHECKED: { emoji: "🏥", color: "bg-cyan-100 border-cyan-400 text-cyan-800" },
  APPOINTMENT_DELETED: { emoji: "🗑️", color: "bg-gray-100 border-gray-400 text-gray-700" },
};

// ── Single Notification Card ──────────────────────────────────────────────────
const NotificationCard = ({ notification, onRead, onDelete }) => {
  const config = typeConfig[notification.type] || {
    emoji: "🔔",
    color: "bg-gray-100 border-gray-400 text-gray-700",
  };

  const handleClick = () => {
    if (!notification.isRead) onRead(notification._id);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative flex gap-3 p-3 mb-2 rounded-xl border-l-4 cursor-pointer transition-all duration-200
        ${config.color}
        ${notification.isRead ? "opacity-60" : "opacity-100 shadow-sm"}
      `}
    >
      {/* Unread dot */}
      {!notification.isRead && (
        <span className="absolute top-2 right-8 w-2 h-2 rounded-full bg-blue-600" />
      )}

      {/* Emoji icon */}
      <div className="text-2xl flex-shrink-0 mt-0.5">{config.emoji}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm leading-tight">{notification.title}</p>
        <p className="text-xs mt-0.5 leading-snug">{notification.message}</p>

        {/* Meta details */}
        {notification.meta && (
          <div className="mt-1.5 text-xs space-y-0.5 opacity-80">
            {notification.meta.appointmentDate && (
              <p>📆 {notification.meta.appointmentDate}</p>
            )}
            {notification.meta.department && (
              <p>🏥 {notification.meta.department}</p>
            )}
            {notification.meta.doctorName && (
              <p>👨‍⚕️ {notification.meta.doctorName}</p>
            )}
            {notification.meta.patientName && (
              <p>🧑 {notification.meta.patientName}</p>
            )}
            {notification.meta.totalAmount && (
              <p>💵 ₹{notification.meta.totalAmount}</p>
            )}
            {notification.meta.videoCallLink && (
              <a
                href={notification.meta.videoCallLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-blue-700"
                onClick={(e) => e.stopPropagation()}
              >
                🔗 Join Video Call
              </a>
            )}
            {notification.meta.scheduledTime && (
              <p>⏰ {notification.meta.scheduledTime}</p>
            )}
          </div>
        )}

        <p className="text-xs mt-1.5 opacity-60">{timeAgo(notification.createdAt)}</p>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification._id);
        }}
        className="flex-shrink-0 self-start mt-1 p-1 rounded hover:bg-black/10 transition-colors"
        title="Delete notification"
      >
        <FaTrash size={11} />
      </button>
    </div>
  );
};

// ── Main NotificationBell Component ──────────────────────────────────────────
const NotificationBell = () => {
  const { isAuthenticated } = useContext(Context);
  const {
    notifications,
    unreadCount,
    isOpen,
    setIsOpen,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Don't render if not logged in
  if (!isAuthenticated) return null;

  return (
    <>
      {/* ── Bell Button ── */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 hover:bg-blue-50 transition-colors duration-200"
        title="Notifications"
      >
        <FaBell className="text-blue-600 text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Backdrop blur overlay ── */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
      )}

      {/* ── Notification Panel ── */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed top-16 right-4 z-50 w-[370px] max-h-[80vh] flex flex-col
            bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden
            animate-fade-in"
          style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <FaBell className="text-lg" />
              <span className="font-bold text-base">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-white text-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition-colors"
                  title="Mark all as read"
                >
                  <FaCheckDouble size={11} />
                  All read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                title="Close"
              >
                <FaTimes size={16} />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <FaBell className="text-4xl mb-3 opacity-30" />
                <p className="text-sm font-semibold">No notifications yet</p>
                <p className="text-xs mt-1 opacity-70">
                  You'll be notified about appointments, prescriptions, and bills here.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationCard
                  key={n._id}
                  notification={n}
                  onRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-white border-t border-gray-100 text-center flex-shrink-0">
              <p className="text-xs text-gray-400">
                {notifications.length} notification{notifications.length !== 1 ? "s" : ""} total
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationBell;