import express from "express";
import { DoctorController } from "./doctor.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
const router = express.Router();

router.get("/", DoctorController.getAllFromDB);

router.post("/suggestion", DoctorController.getAISuggestions);

router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.DOCTOR),
  DoctorController.updateIntoDB
);
export const DoctorRoutes = router;
