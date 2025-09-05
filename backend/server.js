import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import 

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const start = async () => {
    const connectDB = await mongoose.connect("mongodb+srv://Subrat003:wRh7mGB98M8zGJCN@cluster0.bwpjyud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

}

app.get("/new", (req, res) => {
    res.send("this is my next app");
})

app.listen(9090, () => {
    console.log("server running on 9090");
});


start();

