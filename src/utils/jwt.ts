import config from "../config";
import type { RUser } from "../types";
import jwt from "jsonwebtoken"

export const signToken = (payload: RUser) => {
    const accessToken = jwt.sign(payload, config.access_secret, { expiresIn: "1d" })

    const refreshToken = jwt.sign(payload, config.refresh_secret, { expiresIn: "7d" })

    return { accessToken, refreshToken }
}