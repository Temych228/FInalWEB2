import { Router } from "express";
import { register, login, me, updateMe } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", auth, me);
router.put("/me", auth, updateMe);

export default router;  