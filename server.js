import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { chats } from "./dummyData.js"
import { router as uerRoutes } from "./routes/userRoutes.js"
import { errorHandler, notFound } from "./middleWare/ErrorHandling.js"
import colors from "colors"
const app = express()
dotenv.config()
const Port = process.env.Port

app.use(express.json())
app.get("/api/chats", (req, res) => res.send(chats))
app.use("/api/user", uerRoutes)

app.use(notFound)
app.use(errorHandler)

const startServer = async () => {
	try {
		const connectDB = await mongoose.connect(process.env.MONGO_URI)
		console.log(`connected to mongoDB : ${connectDB.connection.host}`.magenta.bold)
		app.listen(Port, () => console.log(`server listening on port ${Port}...........`.blue.bold))
	} catch (err) {
		console.log(`error connecting to database: ${err}`.red.bold)
	}
}

startServer()