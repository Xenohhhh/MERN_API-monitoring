import { Router } from "express";
import { postFunction, getFunction, deleteFunction, getMonitorLogs } from "../controllers/monitors.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/add").post(verifyJWT, postFunction)
router.route("/").get(verifyJWT, getFunction)
router.route("/:id").delete(verifyJWT, deleteFunction)
router.route("/:id/logs").get(verifyJWT, getMonitorLogs);

export default router