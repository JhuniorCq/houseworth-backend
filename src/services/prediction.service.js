import axios from "axios";
import { SERVER_IA } from "../config/config.js";

export const makePrediction = async (features) => {
  try {
    const response = await axios.post(`${SERVER_IA}/predict`, features);

    return response.data;
  } catch (error) {
    console.error("Error en makePrediction en prediction.service.js: ", error);
    throw new Error("No se pudo obtener la predicción del modelo.");
  }
};

export const makePredictions = async (featuresList) => {
  try {
    const responses = await Promise.all(
      featuresList.map((features) =>
        axios.post(`${SERVER_IA}/predict`, features)
      )
    );

    return responses.map((r) => r.data);
  } catch (error) {}
};
