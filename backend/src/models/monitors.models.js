import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    interval: {
        type: Number,
        required: true,
        enum: [60, 300, 600]

    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastStatus: {
        type: String,
        enum: ["UP", "DOWN", "UNKNOWN"],
        default: "UNKNOWN"
    },
    lastCheckedAt: {
        type: Date
    }
}, {timestamps: true})

export const Monitor = mongoose.model("Monitor", monitorSchema);