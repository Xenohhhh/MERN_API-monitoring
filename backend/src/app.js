import express from "express"
import cors from "cors"

const app = express()

app.use(express.json())

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

import userRouter from "./routes/user.routes.js"
import monitorRouter from "./routes/monitor.routes.js"
app.use("/api/v1/user", userRouter)
app.use("/api/v1/monitor", monitorRouter)

export {app}