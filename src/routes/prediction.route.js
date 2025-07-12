import { Router } from "express";
import PredictionController from "../controllers/prediction.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyToken.middleware.js";

const router = Router();

router.post("/", verifyFirebaseToken, PredictionController.predictPrice);
router.post(
  "/multiple",
  verifyFirebaseToken,
  PredictionController.predictMultiplePrices
);
router.get("/", verifyFirebaseToken, PredictionController.listAll);

export default router;
