import dayjs from "dayjs";
import PredictionModel from "../models/prediction.model.js";
import {
  makePrediction,
  makePredictions,
} from "../services/prediction.service.js";
import { prepareFeatures } from "../utils/prepareFeatures.js";
import { read, utils } from "xlsx";
import { EXPECTED_COLUMNS_EXCEL } from "../utils/constants.js";

class PredictionController {
  static async predictPrice(req, res, next) {
    try {
      const { uid } = req.token;

      // Obtención de campos derivados de los ingresados por el usuario
      const features = prepareFeatures({ ...req.body });

      const { price } = await makePrediction(features);

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
    // TODO: Validar que el archivo que se recibe es un Excel
    try {
      const { uid } = req.token;

      const excelBuffer = req.file.buffer;
      const workbook = read(excelBuffer, { type: "buffer" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows = utils.sheet_to_json(sheet);

      const firstRow = rows[0];

      // TODO: Hacer que el back revise que los valores de cada columna sean los correctos -> En especial de neighborhood y overallQual
      // TODO: Luego validar que el excel solo contenga las columnas solicitadas
      // TODO: Hacer que desde un comienzo las columnas que vienen pasen por el .trim() para quitarle los espacios, y estos valores resultantes para las nuevas columans son los que tendré de manera fija hasta el final
      console.log(firstRow);

      if (!firstRow) {
        const error = new Error("El archivo excel está vacío.");
        error.status = 400;

        throw error;
      }

      // Validar la existencia de las columnas solicitadas
      const actualColumns = Object.keys(firstRow);
      const missingColumns = EXPECTED_COLUMNS_EXCEL.filter(
        (col) => !actualColumns.includes(col)
      );

      if (missingColumns.length > 0) {
        const error = new Error(
          `El archivo excel no contiene las siguientes columnas requeridas: ${missingColumns.join(
            ", "
          )}.`
        );
        error.status = 400;

        throw error;
      }

      console.log(rows);

      // Realizar la predicción de cada vivienda
      const featuresList = rows.map((row) => prepareFeatures({ ...row }));

      const predictionResponse = await makePredictions(featuresList);

      console.log("Predicciones: ", predictionResponse);

      // La cantidad de elementos de predictionResponse es la misma que de featuresList
      const predictionData = predictionResponse.map((p, i) => {
        const price = p.price;

        const {
          GrLivArea_Qual: grLivAreaQual,
          Is_Modern: isModern,
          Is_Luxury: isLuxury,
          AvgPriceByNbhd: avgPriceByNbhd,
          SocioEconomicLevel: socioEconomicLevel,
        } = featuresList[i];

        const createdAt = dayjs().format("YYYY-MM-DD HH:mm:ss");

        return {
          price,
          ...rows[i],
          grLivAreaQual,
          isModern,
          isLuxury,
          avgPriceByNbhd,
          socioEconomicLevel,
          createdAt,
        };
      });

      console.log(predictionData);

      const resultsPredictions = await PredictionModel.predictMultiplePrices({
        uid,
        predictionData,
      });

      console.log("Resultados de las predicciones: ", resultsPredictions);

      res.status(200).json({
        success: true,
        message: "Predicciones realiadas con éxito.",
        data: resultsPredictions,
      });
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
      // const uid = "hmKTa1LsxpeFqpxTYoY0zEIjXk93"; // Para pruebas

      let { limit } = req.query;

      limit = limit && Number(limit) ? Number(limit) : undefined;

      const predictionResults = await PredictionModel.listAll({ uid, limit });

      res.status(200).json({
        success: true,
        message: "Predicciones realizadas con éxito.",
        data: predictionResults,
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
