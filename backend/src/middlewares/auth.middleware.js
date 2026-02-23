import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"

const verifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided",
            })
        }

        const token = authHeader.split(" ")[1]

        const decode = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        )

        const user = await User.findById(decode._id).select("-password")

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            })
        }

        req.user = user
        next()
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or expired token",
        })
    }
}