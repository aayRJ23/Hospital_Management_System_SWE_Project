// server/socket.js
import { Server } from "socket.io";

let io;

// Map of userId (string) -> socket.id
const userSocketMap = {};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Client sends their userId after connecting
    socket.on("register", (userId) => {
      if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} registered with socket ${socket.id}`);
      }
    });

    socket.on("disconnect", () => {
      // Remove user from map on disconnect
      for (const [userId, socketId] of Object.entries(userSocketMap)) {
        if (socketId === socket.id) {
          delete userSocketMap[userId];
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

// Send real-time notification to a specific user by their MongoDB _id
export const sendNotificationToUser = (userId, notification) => {
  if (!io) return;
  const socketId = userSocketMap[userId?.toString()];
  if (socketId) {
    io.to(socketId).emit("notification", notification);
    console.log(`Notification sent to user ${userId}`);
  } else {
    console.log(`User ${userId} is not online — notification saved to DB only`);
  }
};

// Send to multiple users
export const sendNotificationToUsers = (userIds, notification) => {
  userIds.forEach((id) => sendNotificationToUser(id, notification));
};

export const getIO = () => io;