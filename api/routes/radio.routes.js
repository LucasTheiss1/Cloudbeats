const express = require("express");
const path = require("path");
const { getTrackMetadata } = require("../services/metadata.service");

const router = express.Router();

router.get("/now-playing", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "..", "music", "Os Paralamas Do Sucesso, Djavan - Uma Brasileira.mp3");
    const metadata = await getTrackMetadata(filePath);

    res.json({
      ...metadata,
      source: "local-mp3",
      status: "playing"
    });
  } catch (error) {
    res.status(500).json({
      error: "Could not read track metadata",
      details: error.message
    });
  }
});

module.exports = router;