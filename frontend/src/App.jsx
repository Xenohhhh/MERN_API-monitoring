import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MonitorDetails from "./pages/MonitorDetails";
import AddMonitor from "./pages/AddMonitor";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Resgister";
import Pricing from "./pages/Pricing";
import "./index.css";
import { getStoredToken } from "./utils/auth";

function PublicOnlyRoute({ children }) {
  const token = getStoredToken();

  return token ? <Navigate to="/dashboard" replace /> : children;
}

function ProtectedRoute({ children }) {
  const token = getStoredToken();

  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <LandingPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/monitor/:id"
          element={
            <ProtectedRoute>
              <MonitorDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-monitor"
          element={
            <ProtectedRoute>
              <AddMonitor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pricing"
          element={
            <ProtectedRoute>
              <Pricing />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
