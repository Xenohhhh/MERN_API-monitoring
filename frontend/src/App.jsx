import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MonitorDetails from "./pages/MonitorDetails";
import AddMonitor from "./pages/AddMonitor";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/monitor/:id" element={<MonitorDetails />} />
        <Route path="/add-monitor" element={<AddMonitor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;