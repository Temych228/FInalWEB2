import { body, validationResult, param } from "express-validator";
import mongoose from "mongoose";

export const validateRegister = [
  body("username").isLength({ min: 2 }).withMessage("Username too short"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").exists().withMessage("Password required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];

export const validateObjectIdParam = (name = "id") => [
  param(name)
    .custom((value, { req }) => {
      if (!value) throw new Error(`${name} param is required`);
      if (!mongoose.Types.ObjectId.isValid(String(value))) {
        throw new Error(`${name} is not a valid ObjectId`);
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const arr = errors.array().map(e => ({ param: e.param, msg: e.msg }));
      return res.status(400).json({ errors: arr });
    }
    next();
  }
];