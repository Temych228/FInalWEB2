import { Router } from "express";
import { auth } from "../middleware/auth.middleware.js";
import {
  createPet,
  getPets,
  getPetById,
  updatePet,
  deletePet
} from "../controllers/pet.controller.js";

const router = Router();

router.post("/", auth, createPet);
router.get("/", getPets);
router.get("/:id", getPetById);
router.put("/:id", auth, updatePet);
router.delete("/:id", auth, deletePet);

export default router;
