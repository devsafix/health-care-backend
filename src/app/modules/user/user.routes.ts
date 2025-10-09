import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";

const router = express.Router();

router.post("/create-patient", UserController.createPatient);

export const userRoutes = router;
