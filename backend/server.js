import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import postRoutes from "./routes/post.routes.js";  
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use(postRoutes);
app.use(userRoutes);

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/new", (req, res) => {
  res.send("this is my next app");
});

// MongoDB connection
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

start();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(9090, () => {
  console.log("Server running on port 9090");
});
