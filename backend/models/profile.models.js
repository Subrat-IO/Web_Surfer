import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bio: { type: String, default: "" },
    currentPost: { type: String, default: "" },
    postWork: { type: [String], default: [] }, // now array of strings
    education: { type: [String], default: [] }, // now array of strings
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
