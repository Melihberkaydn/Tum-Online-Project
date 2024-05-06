import bodyParser from "body-parser";
import express from "express";
import axios from "axios"; // npm install axios
import classesRoutes from "./routes/classes.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(express.static("images"));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});

app.use(classesRoutes);
app.use(authRoutes);


app.get("/image/:id", async (req, res) => {
  const { id } = req.params; // Get the Google Drive ID.

  try {
    const response = await axios.get(
      `https://drive.google.com/uc?id=${id}`,
      { responseType: "arraybuffer" } // Fetch as a binary buffer.
    );

    // Set appropriate headers:
    res.set("Content-Type", response.headers["content-type"]);
    res.send(response.data); // Send the image data to the client.
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch image." });
  }
});

// 404
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  res.status(404).json({ message: "404 - Not Found" });
});

app.listen(3000);
