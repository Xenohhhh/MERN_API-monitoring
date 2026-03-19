import mongoose from "mongoose"

const monitorLogSchema = new mongoose.Schema({
    monitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Monitor",
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ["UP", "DOWN"],
        required: true
    },
    checkedAt: {
        type: Date,
        required: true,
        index: true

    },
    responseTime: {
        type: Number
    },
    statusCode: {
        type: Number
    },
    errorMessage: {
        type: String
    }
}, {timestamps: true})

export const MonitorLog = mongoose.model("MonitorLog", monitorLogSchema)