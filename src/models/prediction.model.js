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
                    WHERE user_id = ?`;

      const values = [uid];

      const [result] = await pool.query(query, [values]);

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
      console.error("Error en listAll en prediction.model.js: ", error.message);
      throw error;
    }
  }
}

export default PredictionModel;
