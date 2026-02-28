import express from "express"

const app = express()

app.use(express.json())

import userRouter from "./routes/user.routes.js"
import monitorRouter from "./routes/monitor.routes.js"
app.use("/api/v1/user", userRouter)
app.use("/api/v1/monitor", monitorRouter)

export {app}