import asyncHandler from "express-async-handler"
import { StatusCodes } from "http-status-codes"
import Chat from "../models/chatModel.js"
import User from "../models/userModel.js"

export const fetchChat = asyncHandler(async (req, res, next) => {
	const loggedInUserId = req.userId
	let chats = await Chat.find({
		users: { $elemMatch: { $eq: loggedInUserId } },
	})
		.populate("users", "-password")
		.populate("groupAdmin", "-password")
		.populate("latestMessage")
		.sort({ updatedAt: -1 })

	chats = await User.populate(chats, {
		path: "latestMessage.sender",
		select: "name pic email",
	})
	res.send(chats)
})

export const accessChat = asyncHandler(async (req, res, next) => {
	const userId = req.userId
	if (!userId) {
		res.status(StatusCodes.BAD_REQUEST)
		throw new Error("userId pram not sent with request")
	}
	let isChat = await Chat.find({
		isGroupChat: false,
		$and: [{ users: { $elemMatch: { $eq: req.body._id } } }, { users: { $elemMatch: { $eq: req.userId } } }],
	})
		.populate("users", "name email pic")
		.populate("latestMessage")

	isChat = await User.populate(isChat, {
		path: "latestMessage.sender",
		select: "name pic email",
	})

	// return res.send(isChat)

	if (isChat.length > 0) {
		res.send(isChat[0])
	} else {
		let chatData = {
			chatName: "sender",
			isGroupChat: false,
			users: [userId, req.body._id],
		}

		try {
			const createdChat = await Chat.create(chatData)
			const fullChat = await Chat.findOne({
				_id: createdChat._id,
			}).populate("users", "-password")

			res.send(fullChat)
		} catch (err) {
			throw new Error(err)
		}
	}
})

export const createGroup = asyncHandler(async (req, res, next) => {
	res.send()
})

export const updateGroup = asyncHandler(async (req, res, next) => {
	res.send()
})

export const leaveGroup = asyncHandler(async (req, res, next) => {
	res.send()
})

export const addMember = asyncHandler(async (req, res, next) => {
	res.send()
})

export const removeMember = asyncHandler(async (req, res, next) => {
	res.send()
})
