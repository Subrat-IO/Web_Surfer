import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import postRoutes from "./routes/post.routes.js";  // ✅ must include .js
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(postRoutes);
app.use(userRoutes);

app.use(express.static("uploads"));




const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    });
    console.log("✅ Connected to MongoDB");
  }
  catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit the app if DB connection fails
  }
};

start();

app.use(postRoutes);

app.get("/new", (req, res) => {
  res.send("this is my next app");
})

app.listen(9090, () => {
  console.log("server running on 9090");
});




