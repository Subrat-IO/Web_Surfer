import User from "../models/user.models.js";

import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";
import Profile from "../models/profile.models.js";
import { profile } from "console";
import PDFDocument from 'pdfkit';
import fs from "fs";

import connectionRequest from "../models/connection.models.js";
import { request } from "http";

import express from 'express';
import { connections } from "mongoose";
const app = express();

// This is mandatory to parse JSON body
app.use(express.json());


export const convertUserDataTOPDF = (userData) => {
  if (!userData || !userData.userId) {
    throw new Error("Invalid user data passed to convertUserDataTOPDF");
  }

  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(16).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);

  // ✅ Profile picture
  const profilePic = userData.userId.profilepicture || "default.jpg";
  const imagePath = `uploads/${profilePic}`;
  try {
    if (fs.existsSync(imagePath)) {
      doc.image(imagePath, { width: 100, align: "center" });
    }
  } catch (err) {
    console.error("Image load failed:", err.message);
  }

  doc.moveDown();

  // ✅ User Info
  doc.fontSize(16).text("User Information", { underline: true });
  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.moveDown();

  // ✅ Profile Info
  doc.fontSize(16).text("Profile Information", { underline: true });
  doc.fontSize(14).text(`Bio: ${userData.bio || "N/A"}`);
  doc.fontSize(14).text(`Current Post: ${userData.currentPost || "N/A"}`);
  doc.moveDown();

  // ✅ Work Experience
  doc.fontSize(16).text("Work Experience", { underline: true });
  if (userData.postWork?.length > 0) {
    userData.postWork.forEach((work, i) => {
      doc.fontSize(14).text(`${i + 1}. Company: ${work.company}`);
      doc.fontSize(14).text(`   Position: ${work.position}`);
      doc.fontSize(14).text(`   Years: ${work.years}`);
      doc.moveDown(0.5);
    });
  } else {
    doc.fontSize(14).text("No work history.");
  }
  doc.moveDown();

  // ✅ Education
  doc.fontSize(16).text("Education", { underline: true });
  if (userData.education?.length > 0) {
    userData.education.forEach((edu, i) => {
      doc.fontSize(14).text(`${i + 1}. School: ${edu.school}`);
      doc.fontSize(14).text(`   Degree: ${edu.degree}`);
      doc.fontSize(14).text(`   Field of Study: ${edu.fieldOfStudy}`);
      doc.moveDown(0.5);
    });
  } else {
    doc.fontSize(14).text("No education history.");
  }
  doc.moveDown();

  doc.end();
  return outputPath;
};





export const register = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    if (!name || !email || !password || !username) {
      // Send status + message safely
      res.status(400);
      return res.json({ message: "All fields required to be filled" });
    }

    const user = await User.findOne({ email });
    if (user) {
      res.status(400);
      return res.json({ message: "User Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
      profilepicture: "default.jpg",
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    // Success
    res.status(201);
    return res.json({ message: "User Registered Successfully" });
  } catch (err) {
    res.status(500);
    return res.json({ message: err.message });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      return res.json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400);
      return res.json({ message: "Invalid password" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.token = token;
    await user.save();

    res.status(200);
    return res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500);
    return res.json({ message: "Server error" });
  }
};




export const uploadProfilePicture = async (req, res) => {
  const { token } = req.query;

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
    const { token } = req.query;

   
    if (!token) return res.status(400).json({ message: "Token is required" });


    // Find the user by token
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });



    // Find the profile for this user and populate user info
    const userProfile = await Profile.findOne({ userId: user._id })
      .populate('userId', 'name email username profilepicture');



    if (!userProfile) return res.status(404).json({ message: "Profile not found" });



    return res.json(userProfile);
  }
   catch (error) {
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

    return res.json({ message: "profile Updated" });
  }


  catch (error) {
    return res.status(500).json({ message: error.message });

  }

}


export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('userId', 'name username email profilePicture');

    return res.json({ profiles });
  }
  catch (error) {
    return res.status(404).json({ message: error.message });

  }
}



export const download_profile = async (req, res) => {
  try {
    const user_Id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_Id })
      .populate("userId", "name username email profilepicture");

    if (!userProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const outputPath = await convertUserDataTOPDF(userProfile);

    return res.json({ message: "PDF generated", file: outputPath });
  } catch (err) {
    console.error("❌ Error in download_profile:", err.message);
    return res.status(500).json({ error: "Failed to generate PDF" });
  }
};

// Send Connection Request
export const sendRequest = async (req, res) => {
  const { token, connectionId } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const connectionUser = await User.findById(connectionId);
    if (!connectionUser) return res.status(404).json({ message: "Connection user not found" });

    const existingRequest = await connectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Connection request already sent" });
    }

    const request = new connectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
      status_accepted: false,
      createdAt: new Date(),
    });

    await request.save();

    return res.status(201).json({
      message: "Connection request sent",
      request: {
        userId: request.userId,
        connectionId: request.connectionId,
        status_accepted: request.status_accepted,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Incoming Requests
export const getmyconnectionRequest = async (req, res) => {
  const { token } = req.query;

  try {
    // Find the user by token
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find all connection requests where this user is the receiver and not yet accepted
    const connections = await connectionRequest
      .find({ connectionId: user._id, status_accepted: false })
      .populate("userId", "name username email profilePicture"); // populate sender info

    return res.json({ connections });
  } catch (error) {
    console.error("Error in getmyconnectionRequest:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Outgoing Requests
export const whatAreMyconnections = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const connections = await connectionRequest
      .find({ userId: user._id })
      .populate("connectionId", "name username email profilePicture status_accepted");

    return res.json({ connections });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Accept/Reject Request
export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;

  try {
    // Find the logged-in user by token
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the connection request document by its _id
    const connection = await connectionRequest.findById(requestId);
    if (!connection)
      return res.status(404).json({ message: "Connection request not found" });

    // Check if the logged-in user is the recipient of this request
    if (connection.connectionId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to accept/reject this request" });
    }

    // Update the status based on action_type
    if (action_type === "accept") connection.status_accepted = true;
    else if (action_type === "reject") connection.status_accepted = false;

    await connection.save();

    return res.json({ message: "Request updated successfully", connection });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



// 🗑️ Delete accepted connection
// 🗑️ Delete accepted or pending connection (FIXED)
export const deleteConnection = async (req, res) => {
  const { token, connectionId } = req.body;
  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🧠 Delete any connection where either side matches user & connectionId
    const connection = await connectionRequest.findOneAndDelete({
      $or: [
        { userId: user._id, connectionId: connectionId },
        { userId: connectionId, connectionId: user._id },
      ],
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    return res.json({ message: "Connection removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const getUserProfileFromUserName = async (req,res) =>{
  const {username} = req.query;
  

  try{
    const user = await User.findOne({
      username
    })
    if(!user){
      return res.status(404).json({message:"User Not Found"})

  }
   const userProfile = await Profile.findOne({userId:user._id})
  .populate('userId', 'name username email profilePicture');
  return res.json({"profile":userProfile})
}
 

  catch(error){
    return res.status(500).json({message:err.message})

  }
}