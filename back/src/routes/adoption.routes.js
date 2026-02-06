import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  sendAdoptionRequest,
  getMyAdoptionRequests,
  updateAdoptionStatus
} from "../controllers/adoption.controller.js";

const router = Router();

router.post("/:petId", auth, sendAdoptionRequest);
router.get("/me", auth, getMyAdoptionRequests);
router.put("/:userId/:requestId", auth, updateAdoptionStatus);

export default router;
