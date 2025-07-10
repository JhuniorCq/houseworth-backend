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

      return {
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
      };
    } catch (error) {
      console.error("Error en predictPrice de prediction.model.js: ", error);
      throw error;
    }
  }
}

export default PredictionModel;
