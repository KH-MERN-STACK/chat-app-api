import jwt from "jsonwebtoken"

const auth = async (req, res, next) => {
	const authHeader = req.headers["authorization"]
	const token = authHeader && authHeader.split(" ")[1]

	if (!token) throw new Error("authentication failed")

	try {
		const load = jwt.verify(token, process.env.JWT_SECRET)
		req.userId = load.userId
		next()
	} catch (err) {
		throw new Error(`Authentication failed error : ${err.message}`)
	}
}
