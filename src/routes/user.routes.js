import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyToken.middleware.js";

const router = Router();

router.post("/sign-up", UserController.register);
router.post("/login", verifyFirebaseToken, UserController.login);

export default router;
