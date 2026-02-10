import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";
import {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet,
  adoptPet           
} from "../controllers/pet.controller.js";

const router = Router();

router.post("/", authMiddleware, isAdmin, createPet);

router.get("/", getPets);
router.get("/:id", getPetById);

router.put("/:id", authMiddleware, isAdmin, updatePet);
router.delete("/:id", authMiddleware, isAdmin, deletePet);

router.post("/:id/adopt", authMiddleware, adoptPet);

export default router;
