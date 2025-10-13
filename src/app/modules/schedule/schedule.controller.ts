import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ScheduleService } from "./schedule.service";
import { JwtPayload } from "jsonwebtoken";
import pick from "../../helper/pick";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.createSchedule(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Schedule created successfully!",
    data: result,
  });
});

const schedulesForDoctor = catchAsync(
  async (req: Request & { user?: JwtPayload }, res: Response) => {
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);
    const filters = pick(req.query, ["startDateTime", "endDateTime"]);

    const user = req.user;
    const result = await ScheduleService.schedulesForDoctor(
      user as JwtPayload,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedule fetched successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const ScheduleController = {
  createSchedule,
  schedulesForDoctor,
};
