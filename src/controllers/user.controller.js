import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import { SALT_ROUNDS } from "../config/config.js";
import { deleteUserById } from "../services/user.service.js";

class UserController {
  static async register(req, res, next) {
    // Tal vez ya no sea necesario almacenar la contraseña en MySQL, ya que la autenticación se gestionará con Firebase
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
        message: "Usuario registrado con éxito.",
        // data: undefined,
      });
    } catch (error) {
      console.error("Error en register en user.controller.js: ", error.message);

      // Eliminamos al usuario registrado en Firebase
      if (uid) await deleteUserById(uid);

      next(error);
    }
  }

  static async login(req, res, next) {
    const { uid } = req.token;

    try {
      console.log("Ya estoy en el controller del login :v, uid: ", uid);

      const user = await UserModel.login({ uid });

      res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso.",
        data: user,
      });
    } catch (error) {
      console.error("Error en login en user.controller.js: ", error.message);

      next(error);
    }
  }
}

export default UserController;

// Esto contiene el token:
/*
  Token decodificado con éxito:  {
  iss: 'https://securetoken.google.com/houseworth-115cd',
  aud: 'houseworth-115cd',
  auth_time: 1750640315,
  user_id: '6hJnnJcntsWp6kno47ZfQ6oxdPB3',
  sub: '6hJnnJcntsWp6kno47ZfQ6oxdPB3',
  iat: 1750640315,
  exp: 1750643915,
  email: 'jhunior@gmail.com',
  email_verified: false,
  firebase: { identities: { email: [Array] }, sign_in_provider: 'password' },
  uid: '6hJnnJcntsWp6kno47ZfQ6oxdPB3'
}
*/
