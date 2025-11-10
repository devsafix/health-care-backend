import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { jwtHelper } from "../../helper/jwtHelper";
import config from "../../../config";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { Secret } from "jsonwebtoken";
import emailSender from "../../helper/emailSender";

const login = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
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

  console.log(user);

  const accessTokenHealthCare = jwtHelper.generateToken(
    { name: user.name, email: user.email, role: user.role },
    config.access_token_secret as string,
    config.access_token_expire as string
  );

  const refreshTokenHealthCare = jwtHelper.generateToken(
    { name: user.name, email: user.email, role: user.role },
    config.refresh_token_secret as string,
    config.refresh_token_expire as string
  );

  return {
    accessTokenHealthCare,
    refreshTokenHealthCare,
    needPasswordChange: user.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelper.verifyToken(
      token,
      config.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new Error("You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessTokenHealthCare = jwtHelper.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.access_token_secret as Secret,
    config.access_token_expire as string
  );

  return {
    accessTokenHealthCare,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const hashedPassword: string = await bcrypt.hash(
    payload.newPassword,
    Number(10)
  );

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully!",
  };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const resetPassToken = jwtHelper.generateToken(
    { email: userData.email, role: userData.role },
    config.reset_pass_secret as Secret,
    config.reset_pass_token_expires_in as string
  );

  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

  await emailSender(
    userData.email,
    `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
  );
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });

  const isValidToken = jwtHelper.verifyToken(
    token,
    config.reset_pass_secret as Secret
  );

  if (!isValidToken) {
    throw new AppError(status.FORBIDDEN, "Forbidden!");
  }

  // hash password
  const password = await bcrypt.hash(payload.password, Number(10));

  // update into database
  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
};

const getMe = async (session: any) => {
  const accessTokenHealthCare = session.accessTokenHealthCare;
  const decodedData = jwtHelper.verifyToken(
    accessTokenHealthCare,
    config.access_token_secret as Secret
  );

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const { id, email, role, needPasswordChange, name, status } = userData;

  return {
    id,
    email,
    name,
    role,
    needPasswordChange,
    status,
  };
};

export const AuthService = {
  login,
  changePassword,
  forgotPassword,
  refreshToken,
  resetPassword,
  getMe,
};
