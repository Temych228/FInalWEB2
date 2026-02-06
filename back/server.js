import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./src/config/db.js";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

dotenv.config({ path: "./back/.env" });

console.log("ENV CHECK:", process.env.MONGO_URI);

const port = 3000;

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
