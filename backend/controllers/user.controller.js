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
        });


        await newUser.save();

        const profile = new Profile({ userId: newUser._id });

        return res.json({ message: "User Registered Successfully" });

    }


    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}



export const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "All Fields are required" });

        const user = await User.findOne({
            email
        });
        if (!user) return res.status(404).json({ message: "user does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Password Try Again" });

        const token = crypto.randomBytes(32).toString("hex");

        await user.updateOne({ _id: user._id }, { token });

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {

        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }

}