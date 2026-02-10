import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

import {
  sendAdoptionRequest,
  getMyAdoptionRequests,
  updateAdoptionStatus
} from "../controllers/adoption.controller.js";
import { validateObjectIdParam } from "../middleware/validators.js";

const router = Router();

router.post("/:petId", authMiddleware, validateObjectIdParam("petId"), sendAdoptionRequest);

router.get("/me", authMiddleware, getMyAdoptionRequests);

router.put(
  "/:userId/:requestId",
  authMiddleware,
  validateObjectIdParam("userId"),
  validateObjectIdParam("requestId"),
  updateAdoptionStatus
);

export default router;
