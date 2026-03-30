import { useEffect, useState } from "react";
import { getLogs } from "../services/monitorService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

export default function MonitorCard({ monitor }) {
  const [uptime, setUptime] = useState(0);
  const [responseTime, setResponseTime] = useState(null);
  const [chartData, setChartData] = useState([]);

  const navigate = useNavigate(); // ✅ FIXED

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getLogs(monitor._id, 1, 20);
        const logs = data.logs || [];

        // 🔥 Uptime
        const upCount = logs.filter((l) => l.status === "UP").length;
        const percent = logs.length
          ? (upCount / logs.length) * 100
          : 0;

        setUptime(percent.toFixed(2));

        // 🔥 Response time fix
        if (logs.length > 0 && logs[0].status === "UP") {
          setResponseTime(logs[0].responseTime);
        } else {
          setResponseTime(null);
        }

        // 🔥 Chart data
        const formatted = logs
          .slice()
          .reverse()
          .map((log) => ({
            time: new Date(log.checkedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            responseTime: log.status === "UP" ? log.responseTime : null,
          }));

        setChartData(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLogs();

    const interval = setInterval(fetchLogs, 10000); // ✅ 10s refresh

    return () => clearInterval(interval);
  }, [monitor._id]);

  const timeAgo = (date) => {
    if (!date) return "Never";

    const diff = Math.floor((Date.now() - new Date(date)) / 60000);

    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} min ago`;

    return `${Math.floor(diff / 60)} hr ago`;
  };

  return (
    <div
      onClick={() => navigate(`/monitor/${monitor._id}`)} // ✅ clickable
      className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
    >
      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              monitor.lastStatus === "UP"
                ? "bg-green-500"
                : monitor.lastStatus === "DOWN"
                ? "bg-red-500"
                : "bg-gray-400"
            }`}
          />
          <h2 className="font-semibold">{monitor.name}</h2>
        </div>

        <span
          className={`px-2 py-1 rounded text-xs ${
            monitor.lastStatus === "UP"
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

      {/* ⚡ Info */}
      <div className="flex justify-between text-sm text-gray-600 mb-3">
        <span>
          ⚡{" "}
          {monitor.lastStatus === "DOWN"
            ? "Failed"
            : responseTime
            ? `${responseTime} ms`
            : "-- ms"}
        </span>

        <span>
          🕒 {timeAgo(monitor.lastCheckedAt)}
        </span>
      </div>

      {/* 📊 Chart */}
      <div className="h-24 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="time" hide />
            <YAxis hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="responseTime"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 Uptime */}
      <div className="h-2 bg-gray-200 rounded mb-1">
        <div
          className={`h-2 rounded ${
            monitor.lastStatus === "UP"
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