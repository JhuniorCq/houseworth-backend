import dayjs from "dayjs";
import pool from "../config/db.js";

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
      };
    } catch (error) {
      console.error("Error en predictPrice de prediction.model.js: ", error);
      throw error;
    }
  }

  static async predictMultiplePrices({ uid, predictionData }) {
    let connection;

    try {
      connection = await pool.getConnection();

      await connection.beginTransaction();

      // Registro la cantidad de filas del excel
      const [excelResult] = await connection.query(
        "INSERT INTO excel (amount_rows) VALUES (?)",
        [predictionData.length]
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

      const resultsPredictions = predictionData.map((p) => {
        const [predictionDate, predictionTime] = p.createdAt.split(" ");

        return {
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

  static async listAll({ uid }) {
    try {
      const query = `SELECT 
                      price,
                      gr_liv_area AS grLivArea,
                      garage_cars AS garageCars,
                      total_bsmt_sf AS totalBsmtSF,
                      year_built AS yearBuilt,
                      overall_qual AS overallQual,
                      neighborhood AS neighborhood,
                      is_modern AS isModern,
                      is_luxury AS isLuxury,
                      created_at AS createdAt
                    FROM prediction 
                    WHERE user_id = ?
                    ORDER BY createdAt DESC`;

      const values = [uid];

      const [result] = await pool.query(query, values);

      const [additionalResult] = await pool.query(
        `
          SELECT
            COUNT(*) AS total_predictions,
            COUNT(CASE WHEN p.excel_id IS NULL THEN 1 END) AS simple_predictions,
            COALESCE(SUM(CASE WHEN p.excel_id IS NOT NULL THEN 1 END), 0) AS multiple_predictions
          FROM prediction p
          WHERE p.user_id = ?`,
        [uid]
      );

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
        "SELECT COUNT(*) AS multipleAmount FROM excel"
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
