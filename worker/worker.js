import { Worker } from "bullmq";
import axios from "axios";
import connectDB from "../backend/src/db/index.js"
import { Monitor } from "../backend/src/models/monitors.models.js"
import { MonitorLog } from "../backend/src/models/monitorLog.models.js"
import { sendEmail } from "../backend/src/utils/sendEmail.js";
import { User } from "../backend/src/models/user.models.js";
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
        timeout: 5000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          "Accept":
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        }
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

    // Keep the previous value for deciding whether an alert is needed.
    const prevStatus = monitor.lastStatus;


    if (prevStatus !== newStatus) {
      console.log(`⚠️ Status changed: ${prevStatus} → ${newStatus}`);

      try {

        const user = await User.findById(monitor.userId)

        if (user && user.email) {
          await sendEmail(
            user.email,
            "🚨 Monitor Alert",
            `Monitor ${monitor.url} changed from ${prevStatus} to ${newStatus}`
          );
          console.log(`Alert email successfully sent to ${user.email}`);
        }
        else {
          console.error(`Could not send email: User not found for monitor ${monitorId}`);
        }

      } catch (error) {
        console.error("Failed to send monitor alert email:", error.message);
      }

    }
    // Save status before notification delivery; email failure must not keep it stale.
    await Monitor.findByIdAndUpdate(monitorId, {
      lastStatus: newStatus,
      lastCheckedAt: new Date(start),
    });

  },
  {
    connection: {
      url: process.env.REDIS_URL,
      maxRetriesPerRequest: null,
      tls: {
        rejectUnauthorized: false
      }
    }
  }
);
