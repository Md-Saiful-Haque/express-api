import config from "../config";
import type { RUser } from "../types";
import jwt, { type JwtPayload } from "jsonwebtoken"

export const verifyToken = (token: string, type: "access" | "refresh") => {
    const secret = type === "access" ? config.access_secret : config.refresh_secret
    const decode = jwt.verify(token, secret)

    return decode as JwtPayload
}

export const signToken = (payload: RUser) => {
    const accessToken = jwt.sign(payload, config.access_secret, { expiresIn: "1d" })

    const refreshToken = jwt.sign(payload, config.refresh_secret, { expiresIn: "7d" })

    return { accessToken, refreshToken }
}