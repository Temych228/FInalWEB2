import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

import app from "./app.js";
import connectDB from "./src/config/db.js";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

console.log("ENV CHECK:", process.env.MONGO_URI);

const port = process.env.PORT || 3000;

try {
  await connectDB();
  console.log("MongoDB connected");

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
} catch (err) {
  console.error("Startup error:", err);
  process.exit(1);
}
