import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "../src/config/db.js";

dotenv.config();
connectDB();

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
