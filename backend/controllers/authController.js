import { insertUser, findUserByEmail } from "../models/userModel.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import jwt from "jsonwebtoken";


export async function signup(req, res) {
  const { full_name, email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await hashPassword(password);
    const user = await insertUser({ full_name, email, password: hashedPassword, google_id: null });
    const token = jwt.sign({ id: user.id, full_name: user.full_name }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "Sign up successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: "user does not exists" });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "invalid login credentials" });

    const token = jwt.sign({ id: user.id, full_name: user.full_name }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
      },
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function logout(req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
}


export async function checkAuth(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ loggedIn: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ loggedIn: true, userId: decoded.id, username: decoded.full_name });
  } catch (err) {
    return res.status(401).json({ loggedIn: false });
  }
}