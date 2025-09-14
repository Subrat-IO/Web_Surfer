import mongoose from "mongoose";
import User from "../models/user.models.js";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";



export const register = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        if (!name || !email || !password || !username) return res.status(400)({ message: "All fields required to be filled" });
        const user = await User.findOne({ email });


        if (user) return res.status(400).json({ message: "User Already Exists" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username,
            profilepicture: "",
        });


        await newUser.save();



        return res.json({ message: "User Registered Successfully" });

    }


    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = crypto.randomBytes(32).toString("hex");

        // ✅ Save token correctly
        user.token = token;
        await user.save();

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
};


export const uploadProfilePicture = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        user.profilePicture = req.file.filename;

        await user.save();

        return res.json({ message: "profile Picture Update" });



    }
    catch (error) {
        return res.json(500).json({ message: error.message })
    }
}