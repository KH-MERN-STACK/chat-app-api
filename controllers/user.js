import asyncHandler from "express-async-handler"
import User from "../models/userModel.js"
import { StatusCodes } from "http-status-codes"

export const registerUser = asyncHandler(async (req, res, next) => {
	const { name, email, password, pic } = req.body

	if (!name || !email || !password) {
		res.status(StatusCodes.BAD_REQUEST)
		throw new Error(`please fill up feilds`)
	}
	const userExists = await User.findOne({ email })
	if (userExists) {
		res.status(StatusCodes.BAD_REQUEST)
		throw new Error(`user already exists`)
	}

	const user = await User.create({
		name,
		email,
		password,
		pic,
	})
	console.log("in registerUser" ,user._id,user.createToken(user._id))
	if (user) {
		res.status(StatusCodes.CREATED).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			pic: user.pic,
			token: user.createToken(user._id),
		})
	} else {
		res.status(StatusCodes.BAD_REQUEST)
		throw new Error(`faild to create user`)
	}
})

export const loginUser = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body
	if (!email || !password) {
		throw new Error("please fill up fields")
	}
	const user = await User.findOne({ email })
	if (user && user.comparePassword(password)) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin:user.isAdmin,
			pic: user.pic,
			token: user.createToken(user._id),
		})
	} else throw new Error("unathenticated user")
})


export const allUsers = asyncHandler(async (req, res, next) => {
	const keyWord = req.query.search
		? {
				$or: [{ name: { $regex: req.query.search, $options: "i" } }, { email: { $regex: req.query.search, $options: "i" } }],
		  }
		: {}
	const users = await User.find(keyWord).find({ _id: { $ne: req.userId } })
	res.send(users)
})