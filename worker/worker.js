import { Worker } from "bullmq";
import axios from "axios";
import connectDB from "../backend/src/db/index.js"
import { Monitor } from "../backend/src/models/monitors.models.js"
import { MonitorLog } from "../backend/src/models/monitorLog.models.js"
import { sendEmail } from "../backend/src/utils/sendEmail.js";
import dotenv from "dotenv";
dotenv.config();

await connectDB();

const worker = new Worker("monitorQueue",
  async (job) => {
    const { monitorId } = job.data;

    const monitor = await Monitor.findById(monitorId);
    if (!monitor) return;

    const start = Date.now();

    let newStatus;
    let responseTime;

    try {
      const res = await axios({
        url: monitor.url,
        method: monitor.method,
        timeout: 5000
      });

      responseTime = Date.now() - start;
      newStatus = "UP";

      console.log("UP:", monitor.url);

    } catch (err) {
      responseTime = Date.now() - start;
      newStatus = "DOWN";

      console.log("DOWN:", monitor.url);
      console.log("Error:", err.code || err.message);
    }

    // ALWAYS SAVE LOG
    await MonitorLog.create({
      monitorId,
      status: newStatus,
      checkedAt: new Date(start),
      responseTime,
    });

    // COMPARE BEFORE UPDATE
    const prevStatus = monitor.lastStatus;

    if (prevStatus !== newStatus) {
      console.log(`⚠️ Status changed: ${prevStatus} → ${newStatus}`);

      await sendEmail(
        process.env.EMAIL_USER,
        "🚨 Monitor Alert",
        `Monitor ${monitor.url} changed from ${prevStatus} to ${newStatus}`
      );
    }

    // ALWAYS UPDATE DB
    await Monitor.findByIdAndUpdate(monitorId, {
      lastStatus: newStatus,
      lastCheckedAt: new Date(),
    });
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379
    }
  }
);