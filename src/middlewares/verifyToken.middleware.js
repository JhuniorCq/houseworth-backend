import admin from "../config/firebase.js";

export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader?.startsWith("Bearer ")) {
      const error = new Error(
        "Tu sesión ha expirado o es inválida. Inicia sesión nuevamente."
      );
      error.status = 401;
      throw error;
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log(`Token decodificado con éxito: `, decodedToken);

    req.token = decodedToken;

    next();
  } catch (error) {
    console.log("Token no enviado o inválido: ", error.message);

    next(error);
  }
};
