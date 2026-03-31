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
import { authRouter } from "./routes/auth.routes.js";
import { roomRouter } from "./routes/room.routes.js";
import { friendRouter } from "./routes/friend.routes.js";
import { authenticate } from "./middleware/auth.middleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use("/auth", authRouter);

// Protected routes (apply auth middleware)
app.use(authenticate); // Populates req.user

app.use("/messages", messageRouter);
app.use("/rooms", roomRouter);
app.use("/friends", friendRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[sentinel-api] listening on ${PORT}`);
})