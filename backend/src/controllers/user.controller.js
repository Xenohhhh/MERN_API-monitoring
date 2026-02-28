import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { User } from "../models/user.models.js";


const generateAccessTokens = (user) => {
    return jwt.sign({
        _id: user._id,
        email: user.email
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
}


export const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        const existUser = await User.findOne({
            $or: [{ email: email }, { name: name }]
        })

        if (existUser) {
            return res.status(409)
                .json({ success: false, message: "Either email or username exists already." });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            hashPassword,
            name
        })

        return res.status(201).json({
            success: true,
            message: `Welcome, ${name}`
        })
    }
    catch (error) {
        console.log(`Error in register: ${error.message}`)
    }
}

export const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                message: "All fields are required."
            })
        }

        const isEmail = identifier.includes("@")

        const user = await User.findOne(
            isEmail ? { email: identifier } : { name: identifier }
        )

        if (!user) {
            return res.status(401).json({
                message: "User not found."
            })
        }

        const validPassword = await bcrypt.compare(password, user.hashPassword)
        if (!validPassword) {
            return res.status(401).json({
                message: "Password incorrect."
            })
        }

        const accessToken = generateAccessTokens(user)


        return res.status(200).json({
            message: `Welcome back, ${user.name}`,
            accessToken
        });
    }

    catch (error) {
        console.error(error)
    }
}