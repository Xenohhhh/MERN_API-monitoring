import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AddMonitor() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        url: "",
        interval: 60, // default 1 min
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
        ...form,
        [name]: name === "interval" ? Number(value) : value,
    });
};

    const handleSubmit = async () => {
        if (!form.name || !form.url) {
            return alert("All fields are required");
        }

        if (!form.url.startsWith("http")) {
            return alert("Enter a valid URL");
        }

        try {
            setLoading(true);

            await api.post("/monitor/add", form);

            navigate("/");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to create monitor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">

                <h2 className="text-xl font-semibold mb-4">
                    Add Monitor
                </h2>

                {/* Name */}
                <input
                    name="name"
                    placeholder="Monitor Name"
                    className="w-full border p-2 mb-3 rounded"
                    onChange={handleChange}
                />

                {/* URL */}
                <input
                    name="url"
                    placeholder="https://example.com"
                    className="w-full border p-2 mb-3 rounded"
                    onChange={handleChange}
                />

                {/* Interval */}
                <select
                    name="interval"
                    className="w-full border p-2 mb-4 rounded"
                    onChange={handleChange}
                >
                    <option value={60}>60 sec</option>
                    <option value={300}>5 min</option>
                    <option value={600}>10 min</option>
                </select>

                {/* Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                    {loading ? "Creating..." : "Add Monitor"}
                </button>

            </div>
        </div>
    );
}
