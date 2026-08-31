import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
    try {
        const { userId } = req.body;
        const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;
        return res.status(201).json({ success: true, creations });

    } catch (error) {
        res.status(500).json({ success: false, message: error.response?.data || error.message });
    }
}

export const deleteUserCreation = async (req, res) => {
    try {
        const { id } = req.body;
        const creations = await sql`DELETE FROM creations WHERE id = ${id}`;
        return res.status(201).json({ success: true, creations });

    } catch (error) {
        res.status(500).json({ success: false, message: error.response?.data || error.message });
    }
}