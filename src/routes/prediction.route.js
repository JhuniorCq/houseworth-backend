import { Router } from "express";
import PredictionController from "../controllers/prediction.controller.js";
import { verifyFirebaseToken } from "../middlewares/verifyToken.middleware.js";
import { upload } from "../config/multer.js";

const router = Router();

router.post("/", verifyFirebaseToken, PredictionController.predictPrice);
router.post(
  "/multiple",
  verifyFirebaseToken,
  upload.single("excelFile"),
  PredictionController.predictMultiplePrices
);
router.get("/:id", verifyFirebaseToken, PredictionController.getById);
router.get(
  "/multiple/:excelId",
  verifyFirebaseToken,
  PredictionController.getByExcelId
);
router.get("/", verifyFirebaseToken, PredictionController.listAll);

export default router;
