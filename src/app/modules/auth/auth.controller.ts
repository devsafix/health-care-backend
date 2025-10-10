import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  const { accessTokenHealthCare, refreshTokenHealthCare, needPasswordChange } =
    result;

  res.cookie("accessTokenHealthCare", accessTokenHealthCare, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.cookie("refreshTokenHealthCare", refreshTokenHealthCare, {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 100,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User logged successfully!",
    data: {
      needPasswordChange,
    },
  });
});

export const AuthController = {
  login,
};
