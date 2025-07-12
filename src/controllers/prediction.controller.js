import dayjs from "dayjs";
import PredictionModel from "../models/prediction.model.js";
import { makePrediction } from "../services/prediction.service.js";
import { prepareFeatures } from "../utils/prepareFeatures.js";

class PredictionController {
  static async predictPrice(req, res, next) {
    try {
      const { uid } = req.token;

      // Obtención de campos derivados de los ingresados por el usuario
      const features = prepareFeatures({ ...req.body });

      const { price, probability } = await makePrediction(features);

      const {
        GrLivArea_Qual: grLivAreaQual,
        Is_Modern: isModern,
        Is_Luxury: isLuxury,
        AvgPriceByNbhd: avgPriceByNbhd,
        SocioEconomicLevel: socioEconomicLevel,
      } = features;

      const createdAt = dayjs().format("YYYY-MM-DD HH:mm:ss");

      const predictionResult = await PredictionModel.predictPrice({
        uid,
        price,
        probability,
        ...req.body,
        grLivAreaQual,
        isModern,
        isLuxury,
        avgPriceByNbhd,
        socioEconomicLevel,
        createdAt,
      });

      res.status(200).json({
        success: true,
        message: "Predicción realiza con éxito.",
        data: predictionResult,
      });
    } catch (error) {
      console.error(
        "Error en predictPrice en prediction.controller.js: ",
        error.message
      );
      next(error);
    }
  }

  static async predictMultiplePrices(req, res, next) {
    try {
    } catch (error) {
      console.error(
        "Error en predictionMultiplePrices en prediction.controller.js: ",
        error.message
      );
      next(error);
    }
  }

  static async listAll(req, res, next) {
    try {
      const { uid } = req.token;

      const predictions = await PredictionModel.listAll({ uid });

      res.status(200).json({
        success: true,
        message: "Se obtuvieron todas tus predicciones con éxito.",
        data: predictions,
      });
    } catch (error) {
      console.error(
        "Error en listAll en prediction.controller.js: ",
        error.message
      );
      next(error);
    }
  }
}

export default PredictionController;
