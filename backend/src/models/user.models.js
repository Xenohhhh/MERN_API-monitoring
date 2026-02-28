import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    hashPassword: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    plan: {
        type: String,
        enum: ["free", "pro"],
        default: "free"
    }

},{timestamps: true})

export const User = mongoose.model("User", userSchema);