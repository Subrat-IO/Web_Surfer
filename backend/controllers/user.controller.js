import mongoose from "mongoose";
import User from "../models/user.models.js";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";
import Profile from "../models/profile.models.js";
import { profile } from "console";





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

        const profile = new Profile({ userId: newUser._id }); // Create Profile
        await profile.save();

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


export const updateUserProfile = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;

        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "Hey user Not found in Database" });

        }

        const { username, email } = newUserData;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {

            if (existingUser || String(existingUser._id) !== String(user._id)) {

                return res.status(400).json({ message: "user already Exists" })

            }

        }
        Object.assign(user, newUserData);

        await user.save();

        return res.json({ message: "user updated successfully" });

    }
    catch (error) {
        return res.status(500).json({ message: "Update Pofile Error" });
    }
}





export const UserProfile = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) return res.status(400).json({ message: "Token is required" });


        // Find the user by token
        const user = await User.findOne({ token });
        if (!user) return res.status(404).json({ message: "User not found" });



        // Find the profile for this user and populate user info
        const userProfile = await Profile.findOne({ userId: user._id })
            .populate('userId', 'name email username profilepicture');



        if (!userProfile) return res.status(404).json({ message: "Profile not found" });



        return res.json(userProfile);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};



export const updateProfileData = async (req, res) => {
    try {
        const { token, ...newProfileData } = req.body;

        const userProfile = await User.findOne({ token: token });

        if (!userProfile) {
            return res.status(404).json({ message: "User nOt Found" });
        }


        const profile_to_update = await Profile.findOne({ userId: userProfile._id });

        Object.assign(profile_to_update, newProfileData);

        await profile_to_update.save();

        return res.json({message:"profile Updated"});
    }


    catch (error) {
        return res.status(500).json({ message: error.message });

    }

}