const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let currentTrack = {
  filename: null,
  updatedAt: null,
};

app.post("/api/radio/update", (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({
      success: false,
      message: "Field 'filename' is required.",
    });
  }

  currentTrack = {
    filename,
    updatedAt: new Date().toISOString(),
  };

  console.log("Current track updated:", currentTrack);

  return res.status(200).json({
    success: true,
    message: "Current track updated successfully.",
    data: currentTrack,
  });
});

app.get("/api/radio/current", (req, res) => {
  return res.status(200).json({
    success: true,
    data: currentTrack,
  });
});

app.listen(PORT, () => {
  console.log(`CloudBeats API running on port ${PORT}`);
});