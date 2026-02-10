import { Router } from "express";
import Pet from "../models/Pet.js";

const router = Router();

router.get("/pets", async (req, res) => {
  try {
    const pets = await Pet.find().lean();
    const normalized = pets.map(p => ({
      ...p,
      photoUrl: p.photoUrl || null
    }));
    res.json(normalized);
  } catch (err) {
    console.error("DEBUG /pets error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/pet/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).lean();
    if (!pet) return res.status(404).json({ message: "Not found" });
    res.json(pet);
  } catch (err) {
    console.error("DEBUG /pet/:id error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;