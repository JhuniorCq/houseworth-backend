import pool from "../config/db.js";

class UserModel {
  static async register({ uid, username, email, password }) {
    try {
      // Verificar si el usuario ya existe
      const [userResult] = await pool.query(
        "SELECT * FROM user WHERE email = ? OR user_id = ?",
        [email, uid]
      );

      if (userResult.length > 0) {
        throw new Error("Este usuario ya existe");
      }

      const [userInsert] = await pool.query(
        "INSERT user (user_id, username, email, password) VALUES (?, ?, ?, ?)",
        [uid, username, email, password]
      );

      if (userInsert.affectedRows === 0) {
        throw new Error("Ocurrió un problema al registrar el usuario");
      }

      return {
        uid,
        username,
        email,
      };
    } catch (error) {
      console.error("Error en register en user.mode.js: ", error.message);
      throw error;
    }
  }

  static async login({ uid }) {
    try {
      const [user] = await pool.query("SELECT * FROM user WHERE user_id = ?", [
        uid,
      ]);

      if (user.length === 0) {
        throw new Error("Este usuario no existe.");
      }

      console.log("El usuario es: ", user);

      return {
        uid: user[0].user_id,
        username: user[0].username,
        email: user[0].email,
      };
    } catch (error) {
      console.error("Error en login en user.model.js: ", error.message);
      throw error;
    }
  }
}

export default UserModel;
