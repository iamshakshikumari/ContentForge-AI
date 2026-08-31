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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
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
