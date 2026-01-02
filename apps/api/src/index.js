console.log("[API] cwd =", process.cwd());
console.log("[API] dirname =", new URL(".", import.meta.url).pathname);
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
    path: path.join(__dirname, "../.env")
});
import express from "express";
import cors from "cors";
import { messageRouter } from "./routes/message.routes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/messages", messageRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[sentinel-api] listening on ${PORT}`);
});
