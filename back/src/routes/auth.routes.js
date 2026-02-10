import { Router } from "express";
import { register, login, me, updateMe } from "../controllers/auth.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { validateRegister, validateLogin } from "../middleware/validators.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

router.get("/me", auth, me);
router.put("/me", auth, updateMe);

export default router;
