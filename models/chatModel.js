import mongoose from "mongoose"

const chatSchema = mongoose.Schema(
	{
		chatName: {
			type: String,
			trim: true,
		},
		isGroupChat: {
			type: Boolean,
			default: false,
		},
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		latestMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},
		groupAdmin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestaps: true,
	}
)

const chat = mongoose.model("chat", chatSchema)

export default chat

/* 
chat name 
isGroupChat 
users
latestMessage
groupAdmin
*/
