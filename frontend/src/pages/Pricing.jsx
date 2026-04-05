import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Pricing() {
  const navigate = useNavigate();

  const upgradePlan = async (plan) => {
    try {
      await api.post("/user/upgrade", { plan });

      alert(`Upgraded to ${plan}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Upgrade failed");
    }
  };

  const plans = [
    {
      name: "Free",
      price: "₹0",
      features: ["5 Monitors", "Basic Alerts"],
      plan: "free",
    },
    {
      name: "Pro",
      price: "₹199/mo",
      features: ["30 Monitors", "Faster Checks", "Email Alerts"],
      plan: "pro",
    },
    {
      name: "Premium",
      price: "₹499/mo",
      features: ["Unlimited Monitors", "Priority Checks", "Advanced Analytics"],
      plan: "premium",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-10">

      <h1 className="text-3xl font-bold text-center mb-10">
        Choose Your Plan
      </h1>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((p, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{p.name}</h2>

            <p className="text-2xl font-bold mb-4">{p.price}</p>

            <ul className="text-gray-500 mb-6">
              {p.features.map((f, idx) => (
                <li key={idx}>• {f}</li>
              ))}
            </ul>

            <button
              onClick={() => upgradePlan(p.plan)}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Choose {p.name}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}