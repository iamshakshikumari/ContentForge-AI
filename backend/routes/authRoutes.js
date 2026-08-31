import express from "express";
import { checkAuth, login, logout, signup } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout) ;
router.get("/check-auth", checkAuth);

export default router;
