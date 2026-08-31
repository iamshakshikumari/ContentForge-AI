import OpenAI from "openai";
import sql from "../configs/db.js";
import { v2 as cloudinary } from "cloudinary";
import pdfParse from "pdf-parse-fork";
import fs from "fs";
import axios from "axios";

// for article, blog-title & resume review
const AI = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

const TEXT_MODEL = "qwen/qwen3.8-27b";

export async function generateArticle(req, res) {
    try {
        const { prompt, length } = req.body;
        const userId = req.body.userId || req.user?.id;

        if (!userId) return res.status(400).json({ success: false, message: "User ID missing" });

        const response = await AI.chat.completions.create({
            model: TEXT_MODEL,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: Number(length) || 1000,
        });

        const content = response.choices[0].message.content;

        await sql`INSERT INTO creations (user_id, prompt, content, type, google_id)
        VALUES (${userId}, ${prompt}, ${content}, 'article', 'NULL')`;

        res.status(201).json({ success: true, content });
    } catch (error) {
        console.error("AI error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: error.message || "Failed to generate article" });
    }
}

export async function generateBlog(req, res) {
    try {
        const { prompt } = req.body;
        const userId = req.body.userId || req.user?.id;

        if (!userId) return res.status(400).json({ success: false, message: "User ID missing" });

        const response = await AI.chat.completions.create({
            model: TEXT_MODEL,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 300,
        });

        const content = response.choices[0].message.content;

        await sql`INSERT INTO creations (user_id, prompt, content, type, google_id)
        VALUES (${userId}, ${prompt}, ${content}, 'blog-title', 'NULL')`;

        res.status(201).json({ success: true, content });
    } catch (error) {
        console.error("AI error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: error.message || "Failed to generate blog title" });
    }
}

export async function generateImage(req, res) {
    try {
        const { prompt } = req.body;
        const userId = req.body.userId || req.user?.id;

        if (!process.env.CLIPDROP_API_KEY) {
            return res.status(400).json({ success: false, message: "CLIPDROP_API_KEY is not configured in backend/.env" });
        }
        if (!process.env.CLOUDINARY_API_KEY) {
            return res.status(400).json({ success: false, message: "Cloudinary credentials (CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, CLOUDINARY_SECRET_KEY) are not configured in backend/.env" });
        }

        const formData = new FormData();
        formData.append('prompt', prompt);
        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API_KEY,
            },
            responseType: "arraybuffer",
        });
        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

        const { secure_url } = await cloudinary.uploader.upload(base64Image);

        await sql`INSERT INTO creations (user_id, prompt, content, type, google_id)
        VALUES (${userId}, ${prompt}, ${secure_url}, 'image', 'NULL')`;

        res.status(201).json({ success: true, content: secure_url });
    } catch (error) {
        console.error("Image generation error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: error.message || "Failed to generate image" });
    }
}

export async function removeImageBackground(req, res) {
    try {
        const userId = req.body.userId || req.user?.id;
        const image = req.file;

        if (!image) {
            return res.status(400).json({ success: false, message: "Please upload an image." });
        }

        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
            return res.status(400).json({ 
                success: false, 
                message: "Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_SECRET_KEY to backend/.env" 
            });
        }

        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [{
                effect: 'background_removal',
                background_removal: 'remove_the_background'
            }]
        });

        await sql`INSERT INTO creations (user_id, prompt, content, type, google_id)
        VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image', 'NULL')`;

        res.status(201).json({ success: true, content: secure_url });
    } catch (error) {
        console.error("Remove background error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: error.message || "Failed to remove background from image" });
    }
}

export async function removeImageObject(req, res) {
    try {
        const userId = req.body.userId || req.user?.id;
        const prompt = req.body.prompt;
        const image = req.file;

        if (!image) {
            return res.status(400).json({ success: false, message: "Please upload an image." });
        }

        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
            return res.status(400).json({ 
                success: false, 
                message: "Cloudinary is not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_SECRET_KEY to backend/.env" 
            });
        }

        const { public_id } = await cloudinary.uploader.upload(image.path);

        const imageURL = cloudinary.url(public_id, {
            transformation: [{ effect: `gen_remove:${prompt}` }],
            resource_type: "image"
        });

        await sql`INSERT INTO creations (user_id, prompt, content, type, google_id)
        VALUES (${userId}, ${`Removed ${prompt} from image`}, ${imageURL}, 'image', 'NULL')`;

        res.status(201).json({ success: true, content: imageURL });
    } catch (error) {
        console.error("Remove object error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: error.message || "Failed to remove object from image" });
    }
}

export async function reviewResume(req, res) {
    try {
        const userId = req.body.userId || req.user?.id;
        const resume = req.file;

        if (!resume) {
            return res.status(400).json({ success: false, message: "Please upload a resume (PDF format)." });
        }

        if (resume.size > 5 * 1024 * 1024) {
            return res.status(400).json({ success: false, message: 'Resume file size exceeds allowed size (5MB).' });
        }

        const dataBuffer = fs.readFileSync(resume.path);
        const pdfData = await pdfParse(dataBuffer);
        const fullText = pdfData.text;

        const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses and areas for improvement. Resume Content:\n\n${fullText}`;

        const response = await AI.chat.completions.create({
            model: TEXT_MODEL,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1500,
        });

        const content = response.choices[0].message.content;

        await sql`INSERT INTO creations (user_id, prompt, content, type, google_id)
        VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review', 'NULL')`;

        res.status(201).json({ success: true, content });
    } catch (error) {
        console.error("Resume review error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: error.message || "Failed to review resume" });
    }
}