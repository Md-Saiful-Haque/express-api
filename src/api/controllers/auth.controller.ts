import type { Request, Response } from "express";
import authService from "../service/auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { signToken, verifyToken } from "../../utils/jwt";

export const signup = async (req: Request, res: Response) => {
    const user = await authService.createUser(req.body);

    if (!user) {
        sendResponse(res, { message: "Failed to create user" }, 500)
        return
    }

    sendResponse(res, { message: "User Created Successfully", data: user }, 201)
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await authService.validateUser(email, password)

    if (!user) {
        sendResponse(res, { message: "Failed to create user" }, 500)
        return
    }

    const { accessToken, refreshToken } = signToken(user)

    res.cookie("refreshToken", refreshToken, {
        sameSite: "lax",
        httpOnly: true,
        secure: false
    })

    const result = {
        user: user,
        accessToken,
        refreshToken
    }

    return sendResponse(res, { message: "User Login Successfully", data: result })

}

export const refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken
    if (!refreshToken) {
        return sendResponse(res, { message: "Refresh Token Not Found" }, 401)
    }

    const payload = verifyToken(refreshToken, "refresh")
    if (!payload) {
        return sendResponse(res, { message: "Invalid Refresh Token" }, 401)
    }
    // console.log(payload);

    const user = await authService.getUserById(payload.id)
     if (!user) {
        return sendResponse(res, { message: "User Not Found" }, 404)
    }

    const {accessToken, refreshToken: newRefreshToken} = signToken(user)

    res.cookie("refreshToken", newRefreshToken, {
        secure: false,
        sameSite: "lax",
        httpOnly: true
    })

    sendResponse(res, { message: "Token Refreshed", data: {
        accessToken,
        newRefreshToken
    }}, 404)
}