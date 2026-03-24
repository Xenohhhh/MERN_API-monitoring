import { Worker } from "bullmq";
import axios from "axios";
import connectDB from "../backend/src/db/index.js"
import { Monitor } from "../backend/src/models/monitors.models.js"
import { MonitorLog } from "../backend/src/models/monitorLog.models.js"
import dotenv from "dotenv";
dotenv.config();

await connectDB();

const worker = new Worker("monitorQueue",
    async (job) => {
        const { monitorId } = job.data;

        console.log("Processing monitor:", monitorId);


        // Fetch DB
        const monitor = await Monitor.findById(monitorId);

        const start = Date.now();

        try {
            const res = await axios({
                url: monitor.url,
                method: monitor.method
            })

            const responseTime = Date.now() - start;
            console.log("UP:", monitor.url);
            console.log("Response time:", responseTime, "ms");

            const newStatus = "UP";


            await MonitorLog.create({
                monitorId: monitorId,
                status: "UP",
                checkedAt: new Date(start),
                responseTime: responseTime,
            })

            if (monitor.lastStatus !== newStatus) {
                console.log(`Status changed: ${monitor.lastStatus} -> ${newStatus}`)
            }

            await Monitor.findByIdAndUpdate(monitorId, {
                lastStatus: newStatus,
                lastCheckedAt: new Date(),
            })


        } catch (err) {
            const responseTime = Date.now() - start;

            console.log("DOWN:", monitor.url);
            console.log("Response time:", responseTime, "ms");



            await MonitorLog.create({
                monitorId: monitorId,
                status: "DOWN",
                checkedAt: new Date(start),
                responseTime: responseTime,
                errorMessage: err.message
            })
        }
    },
    {
        connection: {
            host: "127.0.0.1",
            port: 6379
        }
    }
)