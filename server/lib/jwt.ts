
import jwt from "jsonwebtoken"
const secret = process.env.JWT_SECRET || "dev-secret"
export function signJwt(payload: Record<string, any>) { return jwt.sign(payload, secret, { expiresIn: "7d" }) }
export function verifyJwt(token: string): any { return jwt.verify(token, secret) }
