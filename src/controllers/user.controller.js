import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import { SALT_ROUNDS } from "../config/config.js";

class UserController {
  static async register(req, res, next) {
    try {
      const { uid, username, email, password } = req.body;

      // Validación de datos con Zod

      const passwordHashed = await bcrypt.hash(password, SALT_ROUNDS);

      const user = await UserModel.register({
        uid,
        username,
        email,
        password: passwordHashed,
      });

      res.status(200).json({
        success: true,
        message: "Usuario registrado con éxito",
        data: {
          result: user,
        },
      });
    } catch (error) {
      console.error("Error en register en user.controller.js: ", error.message);
      next(error);
    }
  }
}

export default UserController;
