const mm = require("music-metadata");
const fs = require("fs");
const path = require("path");

/**
 * Extracts metadata from an audio file.
 * If embedded artwork is available, it is saved to the public
 * covers directory and its relative URL is returned.
 */
async function getTrackMetadata(filePath) {
  const metadata = await mm.parseFile(filePath);
  const picture = metadata.common.picture?.[0];

  let coverUrl = null;

  if (picture) {
    const extension = picture.format.split("/")[1] || "jpg";
    const coverFileName = `cover.${extension}`;
    const coverPath = path.join(__dirname, "..", "public", "covers", coverFileName);

    fs.writeFileSync(coverPath, picture.data);
    coverUrl = `/covers/${coverFileName}`;
  }

  return {
    title: metadata.common.title || "Unknown Title",
    artist: metadata.common.artist || "Unknown Artist",
    album: metadata.common.album || "Unknown Album",
    duration: metadata.format.duration || null,
    cover: coverUrl
  };
}

module.exports = { getTrackMetadata };