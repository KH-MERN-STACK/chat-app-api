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
				type: mongoose.Object.Types.OjectId,
				ref: "User",
			},
		],
		latestMessage: {
			type: mongoose.Object.Types.OjectId,
			ref: "Message",
		},
		groupAdmin: {
			type: mongoose.Object.Types.OjectId,
			ref: "User",
		},
	},
	{
		timestaps: true,
	}
)

export const chat = mongoose.model("chat", chatSchema)


/* 
chat name 
isGroupChat 
users
latestMessage
groupAdmin
*/
