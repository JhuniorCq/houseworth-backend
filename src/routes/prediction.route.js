import { Router } from "express";
import PredictionController from "../controllers/prediction.controller.js";

const router = Router();

router.post("/", PredictionController.predictPrice);
router.post("/multiple");

export default router;
