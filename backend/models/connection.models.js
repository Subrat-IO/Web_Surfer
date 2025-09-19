import mongoose from "mongoose";
import { ref } from "pdfkit";
import User from "../models/user.models";

const connectionRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    connectionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    },
    status_accepted: {
        type: Boolean,
        default: null,
    }
});


const connectionRequest = mongoose.model("connectionRequest", connectionRequestSchema);

export  default connectionRequest;