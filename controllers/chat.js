import asyncHandler from "express-async-handler"
import { StatusCodes } from "http-status-codes"
import Chat from "../models/chatModel.js"
import User from "../models/userModel.js"
import chat from "../models/chatModel.js"

export const fetchChat = asyncHandler(async (req, res, next) => {
	const loggedInUserId = req.body.userId
	let chats = await Chat.find({
		users: { $elemMatch: { $eq: loggedInUserId } },
	})
		.populate("users")
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
	const { userId } = req.body
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
	let { users, name } = req.body
	if (!users || !name) {
		res.status(StatusCodes.BAD_REQUEST)
		throw new Error(`please fill up fields`)
	}
	try {
		users = JSON.parse(users)
		users.push(req.userId)
	} catch (err) {
		throw new Error("Invalid incoming data")
	}

	if (users.length < 2) {
		res.status(400)
		throw new Error("Group chat must have at least 2 users")
	}
	try {
		const GroupChat = await Chat.create({
			chatName: name,
			users: users,
			isGroupChat: true,
			groupAdmin: req.userId,
		})

		const fullChat = await Chat.findOne({ _id: GroupChat._id }).populate("users", "-password").populate("groupAdmin", "-password")
		res.status(StatusCodes.OK).json(fullChat)
	} catch (err) {
		throw new Error(err.message)
	}
})

export const updateGroup = asyncHandler(async (req, res, next) => {
	const { chatId, chatName } = req.body

	if (!chatId || !chatName) {
		res.status(400)
		throw new Error(`please select a chat and  provide a new chat name`)
	}

	const updatedGroup = await Chat.findOneAndUpdate({ _id: chatId }, { chatName }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password")

	if (!updatedGroup) {
		res.status(404)
		throw new Error(`chat not found`)
	}

	res.status(201).json(updatedGroup)
})

export const leaveGroup = asyncHandler(async (req, res, next) => {
	res.send()
})

export const addMember = asyncHandler(async (req, res, next) => {
	const { chatId, userId } = req.body
	const added = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
		.populate("users", "-password")
		.populate("groupAdmin", "-password")

	if (!added) {
		res.status(404)
		throw new Error("chat not found")
	}
	res.send(added)
})

export const removeMember = asyncHandler(async (req, res, next) => {
		const { chatId, userId } = req.body
		const removed = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
			.populate("users", "-password")
			.populate("groupAdmin", "-password")

		if (!removed) {
			res.status(404)
			throw new Error("chat not found")
		}
		res.send(removed)
})
