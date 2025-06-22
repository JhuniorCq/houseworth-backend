class PredictionController {
  static async predictPrice(req, res, next) {
    try {
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
