import mongoose from "mongoose"
import bycrpt from "bcryptjs"
import jwt from "jsonwebtoken"
const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		pic: {
			type: String,
			required: true,
			default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
		},
		isAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ timestamps: true }
)

userSchema.pre("save", async function () {
	this.password = await bycrpt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bycrpt.compare(this.password, candidatePassword)
}

userSchema.methods.createToken = function (payload) {
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFE_TIME })
}

const User = mongoose.model("User", userSchema)
export default User
