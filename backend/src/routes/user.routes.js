import { loginUser, registerUser, upgradePlan } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {Router} from "express"


const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/upgrade").post(verifyJWT, upgradePlan)

export default router
