import type { Request, Response } from "express";
import authService from "../service/auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { signToken } from "../../utils/jwt";

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

    return sendResponse(res, { message: "User Login Successfully", data: result})

}