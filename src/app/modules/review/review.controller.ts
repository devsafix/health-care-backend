import { Request, Response } from "express";
import httpStatus from "http-status";
import { ReviewService } from "./review.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { IJwtPayload } from "../../types";

const insertIntoDB = catchAsync(
  async (req: Request & { user?: IJwtPayload }, res: Response) => {
    const user = req.user;
    const result = await ReviewService.insertIntoDB(
      user as IJwtPayload,
      req.body
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  }
);

export const ReviewController = {
  insertIntoDB,
};
