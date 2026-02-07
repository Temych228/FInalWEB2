import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/auth.routes.js";
import petRoutes from "./src/routes/pet.routes.js";
import adoptionRoutes from "./src/routes/adoption.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/adoptions", adoptionRoutes);

export default app;
