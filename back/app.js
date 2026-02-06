import express from "express";
import authRoutes from "./src/routes/auth.routes.js";
import petRoutes from "./src/routes/pet.routes.js";
import adoptionRoutes from "./src/routes/adoption.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/adoptions", adoptionRoutes);

export default app;
