const jwt = require('jsonwebtoken');
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

export async function middleware(req: any, res: any, next: any) {
    const header = req.headers.authorization;
    if (!header) {
       return res.status(400).send("Header not found")
    }
    try {
        const decode = await jwt.verify(header, JWT_SECRET)
        req.id = decode.id
        next()
    } catch (e) {
        return res.status(403).send("Not authorized")
    }

}