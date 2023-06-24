import express from "express"
import { fetchChat, accessChat, createGroup, updateGroup, leaveGroup, addMember, removeMember } from "../controllers/chat.js"

const router = express.Router()

router.route("/").get(fetchChat).post(accessChat)
router.route("/group").post(createGroup).put(updateGroup).delete(leaveGroup)
router.route("/admin").put(addMember).delete(removeMember)


export default router
