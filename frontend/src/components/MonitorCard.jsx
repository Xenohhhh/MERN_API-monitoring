import { useEffect, useState } from "react";
import { getLogs } from "../services/monitorService";

export default function MonitorCard({ monitor }) {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const fetchLogs = async () => {
      const logs = await getLogs(monitor._id, 1, 20);

      const upCount = logs.filter((l) => l.status === "UP").length;
      const percent = (upCount / logs.length) * 100;

      setUptime(percent.toFixed(2));
    };

    fetchLogs();
  }, [monitor._id]);

  return (
    <div className="bg-white shadow rounded-xl p-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">{monitor.name}</h2>
        <span
          className={`px-2 py-1 rounded text-sm ${
            monitor.lastStatus === "UP"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {monitor.lastStatus}
        </span>
      </div>

      <p className="text-gray-500 text-sm">{monitor.url}</p>

      <div className="mt-3 flex justify-between text-sm">
        <span>Last checked</span>
        <span>{new Date(monitor.lastCheckedAt).toLocaleTimeString()}</span>
      </div>

      <div className="mt-3">
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-green-500 rounded"
            style={{ width: `${uptime}%` }}
          />
        </div>
        <p className="text-xs mt-1">{uptime}% uptime</p>
      </div>
    </div>
  );
}