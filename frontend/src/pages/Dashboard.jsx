import { useEffect, useState } from "react";
import { getMonitors } from "../services/monitorService";
import MonitorCard from "../components/MonitorCard";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const [monitors, setMonitors] = useState([]);
  const [limit, setLimit] = useState(5); // fallback
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  const fetchData = async () => {
    try {
      const data = await getMonitors();

      console.log("DATA:", data); // 🔥 debug

      setMonitors(data.monitors || []);
      setLimit(data.limit || 5);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const headerActions = (
    <div className="flex items-center gap-3">
      <button
        onClick={() => navigate("/pricing")}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
      >
        Upgrade
      </button>

      <button
        onClick={handleLogout}
        className="text-red-500 border border-red-300 px-3 py-1 rounded hover:bg-red-50 transition"
      >
        Logout
      </button>
    </div>
  );

  if (monitors.length === 0) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-start mb-4">

          {/* Left side */}
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-gray-500">
              Monitor your services in real-time
            </p>
          </div>

          {headerActions}
        </div>

        {/* 🔥 EMPTY STATE */}
        <div className="flex flex-col items-center justify-center flex-1">

          <p className="text-gray-500 mb-4 text-lg">
            No monitors yet
          </p>

          <button
            onClick={() => navigate("/add-monitor")}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add your first monitor
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-gray-500">
            Monitor your services in real-time
          </p>
        </div>

        {headerActions}
      </div>

      {/* 🔥 PLAN USAGE */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-1">
          {monitors.length} of {limit} monitors used (
          {limit ? Math.round((monitors.length / limit) * 100) : 0}%)
        </p>

        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-blue-500 rounded transition-all"
            style={{
              width: `${limit ? (monitors.length / limit) * 100 : 0
                }%`,
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Monitors</p>
          <h2 className="text-2xl font-semibold">
            {monitors.length}
          </h2>
        </div>

        <div className="bg-green-100 p-4 rounded-xl">
          <p className="text-green-700 text-sm">Services Up</p>
          <h2 className="text-2xl font-semibold text-green-600">
            {monitors.filter((m) => m.lastStatus === "UP").length}
          </h2>
        </div>

        <div className="bg-red-100 p-4 rounded-xl">
          <p className="text-red-700 text-sm">Services Down</p>
          <h2 className="text-2xl font-semibold text-red-600">
            {monitors.filter((m) => m.lastStatus === "DOWN").length}
          </h2>
        </div>
      </div>



      {/* Monitors */}
      <h2 className="text-xl font-semibold mb-4">Monitors</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Monitor Cards */}
        {monitors.map((m) => (
          <MonitorCard
            key={m._id}
            monitor={m}
            onDelete={(id) =>
              setMonitors((prev) =>
                prev.filter((mon) => mon._id !== id)
              )
            }
          />
        ))}

        {/* 🔥 ADD MONITOR CARD */}
        <div
          onClick={() => {
            if (monitors.length < limit) {
              navigate("/add-monitor");
            }
          }}
          className={`flex items-center justify-center rounded-xl border-2 border-dashed bg-white p-6 transition
    ${monitors.length >= limit
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:shadow-lg"
            }
  `}
        >
          <button
            className={`px-4 py-2 rounded ${monitors.length >= limit
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white"
              }`}
            disabled={monitors.length >= limit}
          >
            {monitors.length >= limit
              ? "Limit Reached"
              : "+ Add Monitor"}
          </button>
        </div>

      </div>
    </div>
  );
}
