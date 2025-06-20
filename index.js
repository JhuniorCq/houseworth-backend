import express from "express";
import { SERVER_HOST, SERVER_PORT } from "./src/config/config.js";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./src/routes/user.routes.js";
import handleError from "./src/middlewares/error.middleware.js";
import handleError404 from "./src/middlewares/error404.middleware.js";

const app = express();

app.disable("x-powered-by");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.use("/user", userRouter);

// Middleware -> Error 404
app.use(handleError404);

// Middleware -> Manejo de errores
app.use(handleError);

app.listen(SERVER_PORT, () => {
  console.log(`Servidor ejecutándose en ${SERVER_HOST}`);
});
