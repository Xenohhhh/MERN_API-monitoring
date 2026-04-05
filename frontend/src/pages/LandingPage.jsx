import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// 🔥 animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 }
};

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function LandingPage() {
  const features = [
    "Global Monitoring",
    "Detailed Analytics",
    "Instant Alerts",
    "Lightning Fast",
    "SSL Monitoring",
    "Status Pages",
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-8 py-4 border-b bg-white">
        <h1 className="text-xl font-bold text-blue-600">MonitorX</h1>

        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-gray-600 hover:text-black">
            Dashboard
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg transition hover:scale-105"
          >
            Get Started →
          </Link>
        </div>
      </div>

      {/* HERO */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="flex flex-col items-center text-center px-6 py-20"
      >
        <motion.p
          variants={fadeUp}
          className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full mb-4"
        >
          ● All systems operational
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="text-5xl font-bold leading-tight max-w-4xl"
        >
          Monitor Your APIs.{" "}
          <span className="text-blue-600">
            Stay Ahead of Downtime.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-gray-500 mt-6 max-w-2xl"
        >
          MonitorX watches your APIs, websites, and services 24/7.
          Get instant alerts and detailed analytics to keep uptime at 100%.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex gap-4 mt-8"
        >
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg transition transform hover:scale-105 hover:shadow-lg"
          >
            Start Monitoring →
          </Link>
        </motion.div>
      </motion.div>

      {/* STATS */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 px-10 py-10 bg-white border-y"
      >
        {[
          ["99.99%", "Platform Uptime"],
          ["10M+", "Checks per Day"],
          ["50ms", "Avg Detection Time"],
          ["5,000+", "Happy Users"],
        ].map(([value, label], i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-blue-600">
              {value}
            </h2>
            <p className="text-gray-500 text-sm">{label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* FEATURES */}
      <div className="px-10 py-16">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-3xl font-bold text-center mb-4"
        >
          Everything you need to stay online
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center text-gray-500 mb-10"
        >
          Powerful monitoring tools designed for reliability.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((title, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-gray-500 text-sm">
                Powerful tools to monitor your services reliably.
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={fadeUp}
        className="px-10 py-16"
      >
        <div className="bg-blue-600 text-white rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to eliminate downtime?
          </h2>

          <p className="mb-6 text-blue-100">
            Join thousands of developers using MonitorX.
          </p>

          <Link
            to="/login"
            className="bg-white text-black px-6 py-3 rounded-lg hover:scale-105 transition inline-block"
          >
            Get Started for Free →
          </Link>
        </div>
      </motion.div>

      {/* FOOTER */}
      <div className="border-t py-6 text-center text-gray-500 text-sm">
        © 2026 MonitorX. All rights reserved.
      </div>

    </div>
  );
}