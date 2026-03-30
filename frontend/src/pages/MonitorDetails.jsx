import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLogs } from "../services/monitorService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MonitorDetails() {
  const { id } = useParams();

  const [logs, setLogs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [latest, setLatest] = useState(null);

  // 🔥 Add this function
  const calculateUptime = () => {
    if (!logs.length) return 0;

    const upCount = logs.filter((l) => l.status === "UP").length;
    return ((upCount / logs.length) * 100).toFixed(2);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await getLogs(id, 1, 50);
      const logs = data.logs || [];

      setLogs(logs);

      if (logs.length > 0) {
        setLatest(logs[0]);
      }

      // 📊 Chart
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
    };

    fetchLogs();
  }, [id]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* 🔥 Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Monitor Details</h1>
          <p className="text-gray-500">Monitor performance & logs</p>
        </div>
      </div>

      {/* 🔥 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Response Time</p>
          <h2 className="text-xl font-bold">
            {latest?.responseTime || "--"} ms
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Uptime (24h)</p>
          <h2
            className={`text-xl font-bold ${calculateUptime() > 90
              ? "text-green-600"
              : calculateUptime() > 50
                ? "text-yellow-500"
                : "text-red-500"
              }`}
          >
            {calculateUptime()}%
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Check Interval</p>
          <h2 className="text-xl font-bold">300s</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Last Checked</p>
          <h2 className="text-sm">
            {latest?.status === "DOWN"
              ? "Failed"
              : latest?.responseTime
                ? `${latest.responseTime} ms`
                : "--"}
          </h2>
        </div>

      </div>

      {/* 📊 Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-4">Response Time</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="#2563eb" // 🔥 blue like your design
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📋 Logs Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Request Logs</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Status</th>
                <th className="py-2">Response Time</th>
                <th className="py-2">Timestamp</th>
                <th className="py-2">Error</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-b hover:bg-gray-50 transition">

                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${log.status === "UP"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                        }`}
                    >
                      {log.status}
                    </span>
                  </td>

                  <td className="py-3">
                    {log.responseTime || "--"} ms
                  </td>

                  <td className="py-3 text-gray-600">
                    {new Date(log.checkedAt).toLocaleString()}
                  </td>

                  <td className="py-3 text-red-500">
                    {log.errorMessage || "--"}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}