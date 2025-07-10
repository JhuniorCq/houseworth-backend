import axios from "axios";
import { SERVER_IA } from "../config/config.js";

export const makePrediction = async (features) => {
  try {
    console.log("Se enviarán: ", features);
    const response = await axios.post(`${SERVER_IA}/predict`, features);

    return response.data;
  } catch (error) {
    console.error("Error en makePrediction en prediction.service.js: ", error);
    throw new Error("No se pudo obtener la predicción del modelo.");
  }
};
