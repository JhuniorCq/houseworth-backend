import mysql from "mysql2/promise";
import { DATA_BASE } from "./config.js";

const pool = mysql.createPool({
  user: DATA_BASE.user,
  password: DATA_BASE.password,
  host: DATA_BASE.host,
  port: DATA_BASE.port,
  database: DATA_BASE.database,
  decimalNumbers: true,
  connectionLimit: 10,
});

// Verificar la conexión con la base de datos
const verifyConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Conexión exitosa a la base de datos ...");
    connection.release();
  } catch (error) {
    console.error("Error en la conexión con la base de datos: ", error.message);
  }
};

verifyConnection();

export default pool;
