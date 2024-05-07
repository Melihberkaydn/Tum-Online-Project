import express from "express";
import db from "../util/database.js";
import { authenticateToken } from "./auth.js"; // Import the middleware.

const commentsRoutes = express.Router();

commentsRoutes.get("/get-comments", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID from the token.

    // Query to fetch classes enrolled by the user:
    const [rows] = await db.execute(
      `SELECT B.ID, B.CLASS_NAME, B.STUDENT_ENROLLED, B.IMAGE_URL
        FROM tumonline.enrollments AS A
        JOIN tumonline.available_classes as B ON A.class_id = B.ID
        WHERE A.user_id = ?`,
      [userId]
    );

    res.json(rows); // Send the retrieved rows as a JSON response.
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user classes." });
  }
});

commentsRoutes.post("/add-comment", authenticateToken, async (req, res) => {
  const { classId, comment, time } = req.body;
  const userId = req.user.userId;

  if (!classId || !comment || !time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Call microservice
  try {
    const analysisResult = await analyzeComment(comment);
    const { keywords, sentiment } = analysisResult;

    // Add comment to the Comments table
    const [commentResult] = await db.query(
      "INSERT INTO comments (user_id, class_id, comment_text, time, sentiment) VALUES (?, ?, ?, ?, ?)",
      [userId, classId, comment, time, sentiment]
    );
    const commentId = commentResult.insertId;

    // Handle keywords
    for (const keyword of keywords) {
      // Check if the keyword already exists
      const [rows] = await db.query(
        "SELECT keyword_id FROM keywords WHERE keyword_text = ?",
        [keyword]
      );
      let keywordId;

      if (rows.length > 0) {
        keywordId = rows[0].keyword_id;
      } else {
        // Insert new keyword if it doesn't exist
        const [insertResult] = await db.query(
          "INSERT INTO keywords (keyword_text) VALUES (?)",
          [keyword]
        );
        keywordId = insertResult.insertId;
      }

      // Associate keyword with the comment
      await db.query(
        "INSERT INTO comment_keywords (comment_id, keyword_id) VALUES (?, ?)",
        [commentId, keywordId]
      );
    }

    res.status(201).json({ message: "Comment added successfully!" });
  } catch (error) {
    console.error("Failed to process comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default commentsRoutes;
