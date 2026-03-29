import { useEffect, useState } from "react";
import { getLogs } from "../services/monitorService";

export default function MonitorCard({ monitor }) {
  const [uptime, setUptime] = useState(0);
  const [responseTime, setResponseTime] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getLogs(monitor._id, 1, 20);
        const logs = data.logs || [];

        // 🔥 Uptime calculation
        const upCount = logs.filter((l) => l.status === "UP").length;
        const percent = logs.length
          ? (upCount / logs.length) * 100
          : 0;

        setUptime(percent.toFixed(2));

        // 🔥 Latest response time
        if (logs.length > 0 && logs[0].status === "UP") {
          setResponseTime(logs[0].responseTime);
        } else {
          setResponseTime(null); // ❌ don't show fake time
        }
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    fetchLogs();
  }, [monitor._id]);

  // 🕒 Time formatter
  const timeAgo = (date) => {
    if (!date) return "Never";

    const diff = Math.floor((Date.now() - new Date(date)) / 60000);

    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} min ago`;

    const hours = Math.floor(diff / 60);
    return `${hours} hr ago`;
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">

      {/* 🔥 Title Row */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${monitor.lastStatus === "UP"
                ? "bg-green-500"
                : monitor.lastStatus === "DOWN"
                  ? "bg-red-500"
                  : "bg-gray-400"
              }`}
          />
          <h2 className="font-semibold">{monitor.name}</h2>
        </div>

        <span
          className={`px-2 py-1 rounded text-xs ${monitor.lastStatus === "UP"
              ? "bg-green-100 text-green-600"
              : monitor.lastStatus === "DOWN"
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600"
            }`}
        >
          {monitor.lastStatus}
        </span>
      </div>

      {/* 🔗 URL */}
      <p className="text-gray-500 text-sm mb-3">
        🌐 {monitor.url}
      </p>

      {/* ⚡ Info Row */}
      <div className="flex justify-between text-sm text-gray-600 mb-3">
        <span>
          ⚡ {responseTime ? `${responseTime} ms` : "-- ms"}
        </span>
        <span>
          🕒 {timeAgo(monitor.lastCheckedAt)}
        </span>
      </div>

      {/* 📊 Uptime Bar */}
      <div className="h-2 bg-gray-200 rounded mb-1">
        <div
          className={`h-2 rounded ${monitor.lastStatus === "UP"
              ? "bg-green-500"
              : "bg-red-500"
            }`}
          style={{ width: `${uptime}%` }}
        />
      </div>

      <p className="text-xs text-right text-gray-500">
        {uptime}% uptime
      </p>
    </div>
  );
}