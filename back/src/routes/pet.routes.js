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
import { validateObjectIdParam } from "../middleware/validators.js";

const router = Router();

router.post("/", authMiddleware, isAdmin, createPet);

router.get("/", getPets);
router.get("/:id", validateObjectIdParam("id"), getPetById);

router.put("/:id", authMiddleware, isAdmin, validateObjectIdParam("id"), updatePet);
router.delete("/:id", authMiddleware, isAdmin, validateObjectIdParam("id"), deletePet);

router.post("/:id/adopt", authMiddleware, validateObjectIdParam("id"), adoptPet);

export default router;