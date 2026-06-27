const express = require("express");
const router = express.Router();

const {
  updateCurrentTrack,
  getCurrentTrack,
} = require("../services/radio-state.service");

const {
  getTrackCover,
} = require("../services/track-metadata.service");

router.post("/update", async (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({
      success: false,
      message: "Field 'filename' is required.",
    });
  }

  try {
    const currentTrack = await updateCurrentTrack(filename);

    return res.status(200).json({
      success: true,
      message: "Current track updated successfully.",
      data: currentTrack,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/current", (req, res) => {
  const currentTrack = getCurrentTrack();

  return res.status(200).json({
    success: true,
    data: currentTrack,
  });
});



router.get("/cover/current", async (req, res) => {
  const currentTrack = getCurrentTrack();

  if (!currentTrack.filename) {
    return res.sendStatus(404);
  }

  try {
    const cover = await getTrackCover(currentTrack.filename);

    if (!cover) {
      return res.sendStatus(404);
    }

    res.setHeader("Content-Type", cover.mimeType);
    return res.send(cover.data);

  } catch (error) {
    return res.sendStatus(404);
  }
});

router.get("/now-playing", (req, res) => {
  const currentTrack = getCurrentTrack();

  const metadata = currentTrack.metadata || {};

  return res.status(200).json({
    title: metadata.title || "Nothing playing",
    artist: metadata.artist || "Unknown Artist",
    album: metadata.album || "Unknown Album",
    genre: metadata.genre || "Unknown Genre",
    year: metadata.year || null,
    duration: metadata.duration || null,
    status: currentTrack.status,
    source: "liquidsoap",
    cover: currentTrack.metadata?.hasCover
      ? "http://localhost:3000/api/radio/cover/current"
      : null,
    updatedAt: currentTrack.updatedAt,
  });
});

module.exports = router;