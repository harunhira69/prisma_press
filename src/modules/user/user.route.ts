import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { auth } from "../../middleware/auth";

const router = Router();




router.post("/register", userController.registerUser);

router.get(
  "/me",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  userController.userProfile
);

router.put("/my-profile",
auth(Role.ADMIN, Role.AUTHOR, Role.USER),
userController.updateProfile)

export const userRouter = router;