import dotenv from "dotenv"
dotenv.config()

import connectDB from "../backend/src/db/index.js"
import { Monitor } from "../backend/src/models/monitors.models.js"
import monitorQueue from "./queue.js"


await connectDB()

async function startScheduler() {
    console.log("Scheduler starting...")

    const monitors = await Monitor.find()

    for (const monitor of monitors) {
        console.log("Scheduling monitor:", monitor._id)

        await monitorQueue.add("monitor-api",
            { monitorId: monitor._id.toString() },
            {
                jobId: monitor._id.toString(),
                repeat: {
                    every: monitor.interval * 1000
                }
            }
        )
    }
    console.log("All monitors scheduled");
}

startScheduler()