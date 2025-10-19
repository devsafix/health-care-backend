import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { jwtHelper } from "../../helper/jwtHelper";
import config from "../../../config";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password
  );
  if (!isCorrectPassword) {
    throw new AppError(status.BAD_REQUEST, "Password is incorrect!");
  }

  const accessTokenHealthCare = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.access_token_secret as string,
    config.access_token_expire as string
  );

  const refreshTokenHealthCare = jwtHelper.generateToken(
    { email: user.email, role: user.role },
    config.refresh_token_secret as string,
    config.refresh_token_expire as string
  );

  return {
    accessTokenHealthCare,
    refreshTokenHealthCare,
    needPasswordChange: user.needPasswordChange,
  };
};

export const AuthService = {
  login,
};
