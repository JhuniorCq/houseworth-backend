import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyToken.middleware.js";

const router = Router();

// Agregar ruta para obtener los datos de un usuario
router.post("/sign-up", UserController.register);
router.post("/login", verifyFirebaseToken, UserController.login);
router.get("/:uid", verifyFirebaseToken, UserController.getById);

export default router;
