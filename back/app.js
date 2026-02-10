import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

import authRoutes from "./src/routes/auth.routes.js";
import petRoutes from "./src/routes/pet.routes.js";
import adoptionRoutes from "./src/routes/adoption.routes.js";
import { notFound, errorHandler } from "./src/middleware/error.middleware.js";
import debugRoutes from "./src/routes/debug.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100
});
app.use(limiter);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(express.static(path.join(__dirname, "../front")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/html/index.html"));
});

app.get("/dogs.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/html/dogs.html"));
});

app.get("/cats.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/html/cats.html"));
});

app.get("/birds.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/html/birds.html"));
});

app.get("/pet.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/html/pet.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/html/login.html"));
});

app.get("/profile.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/html/profile.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/adoptions", adoptionRoutes);

app.use(notFound);
app.use(errorHandler);
app.use("/api/debug", debugRoutes);

export default app;