// server/server.js
import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middlewares.js";
import userRouter from "./routes/user.routes.js";
import prescribeRouter from "./routes/prescription.routes.js";
import inventoryRouter from "./routes/inventory.routes.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/msg.routes.js";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import appointmentRouter from "./routes/appointment.routes.js";
import billRouter from "./routes/bill.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import { initSocket } from "./socket.js";

dotenv.config({ path: "./.env" });

const app = express();
const httpServer = createServer(app); // ← wrap express with http server for socket.io
const PORT = process.env.PORT || 8000;

// Init Socket.io
initSocket(httpServer);

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// DB connection
const uri = `${process.env.ATLAS_URI}/E-healthcare`;
mongoose
  .connect(uri)
  .then(() =>
    console.log(`connected to MongoDB on: ${mongoose.connection.host}`)
  )
  .catch((err) => {
    console.log("Error connecting to MongoDB!!\n", err);
    process.exit(1);
  });

// Routes
app.get("/", (req, res) =>
  res.json({ message: "Welcome to the root of the server" })
);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/prescribe", prescribeRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/bill", billRouter);
app.use("/api/v1/notifications", notificationRouter);

// Error middleware
app.use(errorMiddleware);

// Cloudinary init
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Start server (use httpServer, NOT app.listen)
httpServer.listen(PORT, () =>
  console.log(`server is running on: http://localhost:${PORT}`)
);