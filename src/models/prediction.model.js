import dayjs from "dayjs";
import pool from "../config/db.js";
import { groupPredictions } from "../utils/predictions.js";

class PredictionModel {
  static async predictPrice({
    uid,
    price,
    grLivArea,
    garageCars,
    totalBsmtSF,
    yearBuilt,
    overallQual,
    neighborhood,
    grLivAreaQual,
    isModern,
    isLuxury,
    avgPriceByNbhd,
    socioEconomicLevel,
    createdAt,
  }) {
    try {
      const query = `
        INSERT INTO prediction (
          price, gr_liv_area, garage_cars, total_bsmt_sf,
          year_built, overall_qual, neighborhood,
          gr_liv_area_qual, is_modern, is_luxury, avg_price_by_nbhd, socio_economic_level,
          created_at, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        price,
        grLivArea,
        garageCars,
        totalBsmtSF,
        yearBuilt,
        overallQual,
        neighborhood,
        grLivAreaQual,
        isModern,
        isLuxury,
        avgPriceByNbhd,
        socioEconomicLevel,
        createdAt,
        uid,
      ];

      const [predictionInsert] = await pool.query(query, values);

      if (predictionInsert.affectedRows === 0) {
        throw new Error("Ocurrió un problema al guardar tu predicción.");
      }

      const [predictionDate, predictionTime] = createdAt.split(" ");

      return {
        id: predictionInsert.insertId,
        price,
        grLivArea,
        garageCars,
        totalBsmtSF,
        yearBuilt,
        overallQual,
        neighborhood,
        isModern: !!isModern,
        isLuxury: !!isLuxury,
        predictionDate,
        predictionTime,
        excelId: null, // No hay excelId para predicciones individuales
      };
    } catch (error) {
      console.error("Error en predictPrice de prediction.model.js: ", error);
      throw error;
    }
  }

  static async predictMultiplePrices({ uid, excelName, predictionData }) {
    let connection;

    try {
      connection = await pool.getConnection();

      await connection.beginTransaction();

      // Registro la cantidad de filas del excel
      const [excelResult] = await connection.query(
        "INSERT INTO excel (amount_rows, name) VALUES (?, ?)",
        [predictionData.length, excelName]
      );

      const excelId = excelResult.insertId;

      const query = `
        INSERT INTO prediction (
          price, gr_liv_area, garage_cars, total_bsmt_sf,
          year_built, overall_qual, neighborhood,
          gr_liv_area_qual, is_modern, is_luxury, avg_price_by_nbhd, socio_economic_level,
          created_at, user_id, excel_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const insertResult = await Promise.all(
        predictionData.map((p) =>
          connection.query(query, [
            p.price,
            p.grLivArea,
            p.garageCars,
            p.totalBsmtSF,
            p.yearBuilt,
            p.overallQual,
            p.neighborhood,
            p.grLivAreaQual,
            p.isModern,
            p.isLuxury,
            p.avgPriceByNbhd,
            p.socioEconomicLevel,
            p.createdAt,
            uid,
            excelId,
          ])
        )
      );

      insertResult.forEach((r) => {
        const [prediction] = r;

        if (prediction.affectedRows === 0) {
          throw new Error("Ocurrió un problema al guardar tuS predicciONES.");
        }
      });

      await connection.commit();

      const resultsPredictions = predictionData.map((p, i) => {
        const [predictionDate, predictionTime] = p.createdAt.split(" ");

        return {
          id: insertResult[i][0].insertId,
          price: p.price,
          grLivArea: p.grLivArea,
          garageCars: p.garageCars,
          totalBsmtSF: p.totalBsmtSF,
          yearBuilt: p.yearBuilt,
          overallQual: p.overallQual,
          neighborhood: p.neighborhood,
          isModern: !!p.isModern,
          isLuxury: !!p.isLuxury,
          predictionDate,
          predictionTime,
          excelId, // El excelId es el mismo para todas las predicciones
          excelName, // El excelName es el mismo para todas las predicciones
        };
      });

      return resultsPredictions;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }

      console.error(
        "Error en predictMultiplePrices de prediction.model.js: ",
        error
      );
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  // Obtener una predicción simple
  static async getById({ uid, id }) {
    try {
      const query = `SELECT
                      prediction_id AS id, 
                      price,
                      gr_liv_area AS grLivArea,
                      garage_cars AS garageCars,
                      total_bsmt_sf AS totalBsmtSF,
                      year_built AS yearBuilt,
                      overall_qual AS overallQual,
                      neighborhood AS neighborhood,
                      is_modern AS isModern,
                      is_luxury AS isLuxury,
                      created_at AS createdAt,
                      excel_id AS excelId
                    FROM prediction 
                    WHERE user_id = ?
                    AND prediction_id = ?`;

      const values = [uid, id];

      const [result] = await pool.query(query, values);

      if (result.length === 0) {
        throw new Error("Predicción no encontrada.");
      }

      const prediction = { ...result[0] };

      const [predictionDate, predictionTime] = dayjs(prediction.createdAt)
        .format("YYYY-MM-DD HH:mm:ss")
        .split(" ");

      delete prediction.createdAt;

      return {
        ...prediction,
        predictionDate,
        predictionTime,
      };
    } catch (error) {
      console.error("Error en getById en prediction.model.js: ", error.message);
      throw error;
    }
  }

  static async getByExcelId({ uid, excelId }) {
    try {
      const query = `SELECT
                      p.prediction_id AS id, 
                      p.price,
                      p.gr_liv_area AS grLivArea,
                      p.garage_cars AS garageCars,
                      p.total_bsmt_sf AS totalBsmtSF,
                      p.year_built AS yearBuilt,
                      p.overall_qual AS overallQual,
                      p.neighborhood AS neighborhood,
                      p.is_modern AS isModern,
                      p.is_luxury AS isLuxury,
                      p.created_at AS createdAt,
                      p.excel_id AS excelId,
                      e.name AS excelName
                    FROM prediction p
                    INNER JOIN excel e 
                    ON p.excel_id = e.excel_id
                    WHERE p.user_id = ?
                    AND p.excel_id = ?`;

      const values = [uid, excelId];

      const [result] = await pool.query(query, values);

      if (result.length === 0) {
        throw new Error("Predicciones no encontradas.");
      }

      const predictions = result.map((p) => {
        const [predictionDate, predictionTime] = dayjs(p.createdAt)
          .format("YYYY-MM-DD HH:mm:ss")
          .split(" ");

        delete p.createdAt;

        return {
          ...p,
          predictionDate,
          predictionTime,
        };
      });

      return predictions;
    } catch (error) {
      console.error(
        "Error en getByExcelId en prediction.model.js: ",
        error.message
      );
      throw error;
    }
  }

  static async listAll({ uid, limit }) {
    try {
      let query = `SELECT
                    p.prediction_id AS id, 
                    p.price,
                    p.gr_liv_area AS grLivArea,
                    p.garage_cars AS garageCars,
                    p.total_bsmt_sf AS totalBsmtSF,
                    p.year_built AS yearBuilt,
                    p.overall_qual AS overallQual,
                    p.neighborhood AS neighborhood,
                    p.is_modern AS isModern,
                    p.is_luxury AS isLuxury,
                    p.created_at AS createdAt,
                    p.excel_id AS excelId,
                    e.name AS excelName
                  FROM prediction p
                  LEFT JOIN excel e 
                  ON p.excel_id = e.excel_id
                  WHERE p.user_id = ?
                  ORDER BY createdAt DESC`;

      const values = [uid];

      if (limit) {
        query += " LIMIT ?";
        values.push(limit);
      }

      const [result] = await pool.query(query, values);

      const [totalAmountResult] = await pool.query(
        "SELECT COUNT(*) AS totalAmount FROM prediction WHERE user_id = ?",
        [uid]
      );

      const [simpleAmountResult] = await pool.query(
        `
          SELECT COUNT(*) AS simpleAmount
          FROM prediction
          WHERE excel_id IS NULL
          AND user_id = ?
      `,
        [uid]
      );

      const [multipleAmountResult] = await pool.query(
        "SELECT COUNT(DISTINCT excel_id) AS multipleAmount FROM prediction WHERE user_id = ? AND excel_id IS NOT NULL",
        [uid]
      );

      const predictions = result.map((p) => {
        const [predictionDate, predictionTime] = dayjs(p.createdAt)
          .format("YYYY-MM-DD HH:mm:ss")
          .split(" ");

        delete p.createdAt;

        return {
          ...p,
          predictionDate,
          predictionTime,
        };
      });

      // ******
      console.log(groupPredictions(predictions));
      // console.log(
      //   groupPredictions(predictions).map((p) => ({
      //     predictions: JSON.stringify(p.predictions),
      //   }))
      // );
      // ******

      // IMPORTANTE: Ver como solucionar cuando se envía un valor para el LIMIT, porque ahí si se especifica un límite X y eso hace que se me traigan solo X predicciones de un excel de Y + Z predicciones, puede generar problemas al agrupar las predicciones de un excel, ya que no se traen todas las predicciones de ese excel y por lo tanto no se agrupan correctamente.

      // DATO: Si uso lo que retorna groupPredictions() -> Debo cambiar este "predictions" de este return por "predictionResults"

      // TODO -> SE CANCELA TODOOOOOOOOOOOO :3 , creo que mejor dejo lo que ya tengo y en el front hago que al Clickear en el HISTORIAL en una predicción que forma parte de UNA MÚLTIPLE, pues me lleve a la vista de los RESULTADOS DE UNA PREDICCIÓN MÚLTIPLE -> y lo que haría seria que al clickear coger su excelId y obtener a todos las predicciones en el front que tenga ese mismo excelId ... AUNQUEEEE MUCHO MEJOR -> PUEDO CREAR UN ENDPOINT en mi back para obtener todas las predicciones de una predicciones muñtiple en bae a su excelId y de igual manera para obtner a UN PREDICCION SIMPLE

      return {
        predictions,
        totalAmount: totalAmountResult[0].totalAmount,
        simpleAmount: simpleAmountResult[0].simpleAmount,
        multipleAmount: multipleAmountResult[0].multipleAmount,
      };
    } catch (error) {
      console.error("Error en listAll en prediction.model.js: ", error.message);
      throw error;
    }
  }
}

export default PredictionModel;
