const express = require("express");
const router = express.Router();

router.get("/now-playing", (req, res) => {
  res.json({
    title: "Unknown Title",
    artist: "Unknown Artist",
    source: "Liquidsoap/Icecast",
    status: "playing"
  });
});

module.exports = router;