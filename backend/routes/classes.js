import express from "express";
import db from "../util/database.js";
import { authenticateToken } from "./auth.js"; // Import the middleware.

const classesRoutes = express.Router();

classesRoutes.get("/classes", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM available_classes");

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching classes." });
  }
});

// ENROLL TO CLASSES
classesRoutes.post("/enroll", authenticateToken, async (req, res) => {
  const { classId } = req.body; // Extract the class ID from the request.

  if (!classId) {
    return res.status(400).json({ error: "Class ID is required" });
  }

  try {
    // Check if the class exists:
    const [classRows] = await db.execute("SELECT * FROM available_classes WHERE ID = ?", [classId]);

    if (classRows.length === 0) {
      return res.status(404).json({ error: "Class not found" });
    }

    //Check if the user is already enrolled:
    const [enrollmentRows] = await db.execute(
      "SELECT * FROM enrollments WHERE user_id = ? AND class_id = ?",
      [req.user.id, classId]
    );

    if (enrollmentRows.length > 0) {
      return res.status(409).json({ error: "User already enrolled in this class" });
    }

    // Insert the enrollment:
    await db.execute(
      "INSERT INTO enrollments (user_id, class_id) VALUES (?, ?)",
      [req.user.id, classId]
    );

    res.status(201).json({ message: "Enrolled successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while enrolling" });
  }
});


// dROP CLASSES
classesRoutes.delete("/drop-class", authenticateToken, async (req, res) => {
  const { classId } = req.body; // Extract the class ID from the request.

  if (!classId) {
    return res.status(400).json({ error: "Class ID is required" });
  }

  try {
    // Check if the user is enrolled in this class:
    const [enrollmentRows] = await db.execute(
      "SELECT * FROM enrollments WHERE user_id = ? AND class_id = ?",
      [req.user.id, classId]
    );

    if (enrollmentRows.length === 0) {
      return res.status(404).json({ error: "User is not enrolled in this class" });
    }

    // Remove the enrollment:
    await db.execute("DELETE FROM enrollments WHERE user_id = ? AND class_id = ?", [req.user.id, classId]);

    res.status(200).json({ message: "Dropped class successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while dropping the class" });
  }
});

classesRoutes.get("/enrolled-classes", authenticateToken, async (req, res) => {
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
    res.status(500).json({ error: "An error occurred while fetching user classes." });
  }
});


export default classesRoutes;
