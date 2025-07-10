import PredictionModel from "../models/prediction.model.js";
import { makePrediction } from "../services/prediction.service.js";
import { prepareFeatures } from "../utils/prepareFeatures.js";

class PredictionController {
  static async predictPrice(req, res, next) {
    try {
      // const { uid } = req.token;
      // Por ahora probar con este uid fijo y la cuenta -> jhunior@gmail.com | jhunior123
      const uid = "hmKTa1LsxpeFqpxTYoY0zEIjXk93";

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

      const now = new Date();
      const createdAt = now.toISOString().slice(0, 19).replace("T", " ");

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
}

export default PredictionController;
