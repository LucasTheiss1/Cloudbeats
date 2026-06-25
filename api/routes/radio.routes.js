const express = require("express");
const router = express.Router();

const {
  updateCurrentTrack,
  getCurrentTrack,
} = require("../services/radio-state.service");

router.post("/update", (req, res) => {
  const { filename } = req.body;

  if (!filename) {
    return res.status(400).json({
      success: false,
      message: "Field 'filename' is required.",
    });
  }

  const currentTrack = updateCurrentTrack(filename);

  return res.status(200).json({
    success: true,
    message: "Current track updated successfully.",
    data: currentTrack,
  });
});

router.get("/current", (req, res) => {
  const currentTrack = getCurrentTrack();

  return res.status(200).json({
    success: true,
    data: currentTrack,
  });
});

module.exports = router;