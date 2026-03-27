// client/src/socket.js
import { io } from "socket.io-client";

// Single shared socket instance for entire app
const socket = io("http://localhost:8000", {
  withCredentials: true,
  autoConnect: false, // We connect manually after login
});

export default socket;