import express from "express"
import { registerUser, loginUser, allUsers } from "../controllers/user.js"
import { protect } from "../middleWare/authentication.js"
export const router = express.Router()

router.route("/").post(registerUser).get(protect, allUsers)
router.route("/login").post(loginUser)
