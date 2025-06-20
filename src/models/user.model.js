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
        password,
      };
    } catch (error) {
      console.error("Error en register en user.mode.js: ", error.message);
      throw error;
    }
  }
}

export default UserModel;
