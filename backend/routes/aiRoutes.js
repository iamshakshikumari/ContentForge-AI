import express from "express" ;
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {generateArticle, generateBlog, generateImage, removeImageBackground, removeImageObject, reviewResume} from "../controllers/aiControllers.js";
import { upload } from "../configs/multer.js";
const router = express.Router() ;

router.post("/generate-article", authenticateToken, generateArticle) ;
router.post("/generate-blog-title", authenticateToken, generateBlog) ;
router.post("/generate-image", authenticateToken, generateImage) ;
router.post("/remove-image-background", upload.single('image'), authenticateToken, removeImageBackground) ;
router.post("/remove-image-object", upload.single('image'), authenticateToken, removeImageObject) ;
router.post("/resume-review", upload.single('resume'), authenticateToken, reviewResume) ;

export default router ;