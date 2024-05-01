import express from "express";
import db from "../util/database.js";

const router = express.Router();

router.get("/classes", async (req, res) => {
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

router.get("/user-classes", async (req, res) => {
  const fileContent = await fs.readFile("./data/user-classes.json");

  const classes = JSON.parse(fileContent);

  res.status(200).json({ classes });
});

router.put("/user-classes", async (req, res) => {
  const classes = req.body.classes;

  await fs.writeFile("./data/user-classes.json", JSON.stringify(classes));

  res.status(200).json({ message: "User classes updated!" });
});

export default router;
