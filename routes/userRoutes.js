import express from "express"
import { registerUser, loginUser } from "../controllers/user.js"
export const router = express.Router()

router.route("/").post(registerUser)
router.route("/login").post(loginUser)
