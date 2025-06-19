import express from "express";
import { SERVER_PORT } from "./src/config/config.js";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Agregar las rutas

app.listen(SERVER_PORT, () => {
  console.log(`Servidor corriendo en el puerto ${SERVER_PORT}`);
});
