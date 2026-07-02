import { Router } from "express";
import { loginController } from "./auth.controller";

const router = Router();

router.post("/login",loginController.loginUser);
router.post("/refresh-token",loginController.refreshToken)

export const loginRouter = router;