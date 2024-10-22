import mongoose from "mongoose";

const subUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
    }

}, {timestamps: true})

const SubUser = mongoose.model("SubUser", subUserSchema);

export default SubUser;