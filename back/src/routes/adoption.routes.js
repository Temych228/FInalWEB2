import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

import {
  sendAdoptionRequest,
  getMyAdoptionRequests,
  updateAdoptionStatus
} from "../controllers/adoption.controller.js";

const router = Router();

router.post("/:petId", authMiddleware, sendAdoptionRequest);

router.get("/me", authMiddleware, getMyAdoptionRequests);

router.put("/:userId/:requestId", authMiddleware, updateAdoptionStatus);

export default router;
