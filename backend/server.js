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

app.get("/api/health-db", async (req, res) => {
  const dbUrl = (process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || "").trim().replace(/^["']|["']$/g, '');
  const masked = dbUrl.replace(/:([^:@]+)@/, (m, p) => `:${p.slice(0, 5)}...${p.slice(-3)}@`);
  if (!dbUrl) {
    return res.status(500).json({ status: "error", message: "No DATABASE_URL or NEON_DATABASE_URL set in environment" });
  }
  try {
    const { neon } = await import("@neondatabase/serverless");
    const client = neon(dbUrl);
    const result = await client`SELECT 1 as connected, current_database() as db, current_user as user`;
    return res.json({ status: "connected", maskedUrl: masked, result });
  } catch (err) {
    return res.status(500).json({ status: "failed", maskedUrl: masked, error: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes) ;
app.use("/api/user", userRoutes) ;

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
});
