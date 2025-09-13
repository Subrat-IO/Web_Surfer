import User from "../models/user.models.js";
import bcrypt, { hash } from "bcrypt";



export const activeCheck = async (req, res) => {
    return res.status(200).json({ message: "running" });

}


