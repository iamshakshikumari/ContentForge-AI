import express from "express" ;
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { deleteUserCreation, getUserCreations } from "../controllers/userController.js";

const router = express.Router() ;

router.post("/get-user-creations", authenticateToken, getUserCreations) ;
router.post("/delete-item", authenticateToken, deleteUserCreation) ;

export default router ;