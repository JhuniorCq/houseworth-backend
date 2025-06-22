import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import { SALT_ROUNDS } from "../config/config.js";
import { deleteUserById } from "../services/user.service.js";

class UserController {
  static async register(req, res, next) {
    const { uid, username, email, password } = req.body;
    try {
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
        // data: undefined,
      });
    } catch (error) {
      console.error("Error en register en user.controller.js: ", error.message);

      // Eliminamos al usuario registrado en Firebase
      if (uid) await deleteUserById(uid);

      next(error);
    }
  }
}

export default UserController;
