// Import dependencies
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";
import { connectDB } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import { newsLetterCron } from "./automation/newsLetterCron.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

// Initialize the Express app
const app = express();

// Use __dirname to ensure the correct directory path
const __dirname = path.resolve();

// Load environment variables from .env file
dotenv.config();

// Database connection
connectDB();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Cookie parser middleware

// File upload setup
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // Ensure this is appropriate for your environment
  })
);

// CORS setup
app.use(
  cors({
    origin: [process.env.FRONTEND_URL], // Ensure FRONTEND_URL is defined in .env
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Define routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// Serve static files (ensure correct path to the frontend build)
app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Error handling middleware (should come last)
app.use(errorMiddleware);

// Run newsletter cron job
newsLetterCron();

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
