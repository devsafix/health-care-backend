import { UserRole } from "@prisma/client";

export type IJwtPayload = {
  name: string;
  email: string;
  role: UserRole;
};
