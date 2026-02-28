import { Router } from "express";
import { postFunction, getFunction } from "../controllers/monitors.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/").post(verifyJWT, postFunction)
router.route("/").get(verifyJWT, getFunction)

export default router