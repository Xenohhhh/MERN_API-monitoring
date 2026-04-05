import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
  if (!form.name || !form.email || !form.password) {
    return alert("All fields required");
  }

  try {
    setLoading(true);

    const res = await api.post("/user/register", form);

    // 🔥 store token immediately
    localStorage.setItem("token", res.data.accessToken);

    // 🔥 go directly to dashboard
    navigate("/dashboard");

  } catch (err) {
    console.error(err);
    alert("Registration failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow w-80">

        <h2 className="text-xl font-semibold mb-4">
          Create Account
        </h2>

        <input
          name="name"
          placeholder="Name"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-sm text-gray-500 mt-3 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}