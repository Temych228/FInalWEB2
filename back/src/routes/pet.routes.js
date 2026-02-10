import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
  adoptPet           
} from "../controllers/pet.controller.js";

const router = Router();

router.post("/", authMiddleware, createPet);
router.get("/", getPets);
router.get("/:id", getPetById);
router.put("/:id", authMiddleware, updatePet);
router.delete("/:id", authMiddleware, deletePet);

router.post("/:id/adopt", authMiddleware, adoptPet);

export default router;
