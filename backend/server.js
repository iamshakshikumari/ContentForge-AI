import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js" ;
import userRoutes from "./routes/userRoutes.js" ;
import connectCloudinary from "./configs/cloudinary.js";
import { initializeDatabase } from "./init_db.js";

dotenv.config(); 

const app = express();

await connectCloudinary();
await initializeDatabase();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "ContentForge AI Backend is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes) ;
app.use("/api/user", userRoutes) ;

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
});
