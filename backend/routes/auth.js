import jwt from "jsonwebtoken";
import express from "express";
import JWT_SECRET_KEY from "../util/secret_key.js";
import db from "../util/database.js";
import bcrypt from "bcrypt";

const authRoutes = express.Router();

const secretKey = JWT_SECRET_KEY;

authRoutes.post("/signup", async (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;

  if (!username || !password || !email || !firstName || !lastName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if the user already exists:
    const [existingUsers] = await db.execute(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res
        .status(409)
        .json({ error: "Username or email already in use" });
    }

    // Hash the password:
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new user into the database:
    await db.execute(
      "INSERT INTO users (username, password, email, firstName, lastName) VALUES (?, ?, ?, ?, ?)",
      [username, hashedPassword, email, firstName, lastName]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred during signup" });
  }
});

authRoutes.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("User Logged In: ", user)

    const token = jwt.sign({ id: user.userid, role: user.role }, secretKey, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});


export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    
    req.user = user; // Save user info for later use.
    console.log("Authenticated. Decoded Token: ", req.user);
    next();
  });
}

export default authRoutes;
