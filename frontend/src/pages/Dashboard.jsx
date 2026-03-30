import { useEffect, useState } from "react";
import { getMonitors } from "../services/monitorService";
import MonitorCard from "../components/MonitorCard";

export default function Dashboard() {
  const [monitors, setMonitors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMonitors();
        setMonitors(data?.monitors || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData(); // initial load

    const interval = setInterval(fetchData, 15000); // 🔥 every 15s

    return () => clearInterval(interval); // cleanup
  }, []);

  // 📊 Stats
  const total = monitors.length;
  const up = monitors.filter((m) => m.lastStatus === "UP").length;
  const down = monitors.filter((m) => m.lastStatus === "DOWN").length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* 🔥 Header */}
      <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-6">
        Monitor your services in real-time
      </p>

      {/* 🔥 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <div className="bg-gray-100 p-3 rounded-lg">📦</div>
          <div>
            <p className="text-gray-500 text-sm">Total Monitors</p>
            <h2 className="text-2xl font-bold">{total}</h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">⬆️</div>
          <div>
            <p className="text-gray-500 text-sm">Services Up</p>
            <h2 className="text-2xl font-bold text-green-600">{up}</h2>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-lg text-red-600">⬇️</div>
          <div>
            <p className="text-gray-500 text-sm">Services Down</p>
            <h2 className="text-2xl font-bold text-red-600">{down}</h2>
          </div>
        </div>

      </div>

      {/* 🔥 Section Title */}
      <h2 className="text-xl font-semibold mb-4">Monitors</h2>

      {/* 📦 Monitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monitors.map((m) => (
          <MonitorCard key={m._id} monitor={m} />
        ))}
      </div>
    </div>
  );
}