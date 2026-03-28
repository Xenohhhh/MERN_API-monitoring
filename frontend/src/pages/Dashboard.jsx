import { useEffect, useState } from "react";
import { getMonitors } from "../services/monitorService";

export default function Dashboard() {
  const [monitors, setMonitors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMonitors();
      setMonitors(data);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 grid grid-cols-3 gap-6">
      {monitors.map((m) => (
        <MonitorCard key={m._id} monitor={m} />
      ))}
    </div>
  );
}