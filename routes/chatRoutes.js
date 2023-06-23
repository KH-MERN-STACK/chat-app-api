import express from "express"
import { fetchChat, accessChat } from "../controllers/chat.js"

const router = express.Router()

router.route("/").get(fetchChat).post(accessChat)
// router.route("/group").post(createGroupChat).put(renameGroupChat)

export default router
