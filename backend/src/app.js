import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()


const app = express()

app.use(express.json())

app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
  credentials: true
}));

import userRouter from "./routes/user.routes.js"
import monitorRouter from "./routes/monitor.routes.js"
app.use("/api/v1/user", userRouter)
app.use("/api/v1/monitor", monitorRouter)

export {app}