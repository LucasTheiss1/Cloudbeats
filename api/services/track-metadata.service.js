const fs = require("fs");

async function getTrackMetadata(filename) {
  if (!fs.existsSync(filename)) {
    throw new Error(`File not found: ${filename}`);
  }

  const { parseFile } = await import("music-metadata");
  const metadata = await parseFile(filename);

  const common = metadata.common || {};
  const format = metadata.format || {};

  return {
    filename,
    title: common.title || "Unknown Title",
    artist: common.artist || "Unknown Artist",
    album: common.album || "Unknown Album",
    genre: common.genre?.[0] || "Unknown Genre",
    year: common.year || null,
    duration: format.duration ? Math.round(format.duration) : null,
    hasCover: common.picture && common.picture.length > 0,
  };
}

async function getTrackCover(filename) {
  if (!fs.existsSync(filename)) {
    throw new Error(`File not found: ${filename}`);
  }

  const { parseFile } = await import("music-metadata");
  const metadata = await parseFile(filename);

  const picture = metadata.common.picture?.[0];

  if (!picture) {
    return null;
  }

  return {
    data: picture.data,
    mimeType: picture.format,
  };
}

module.exports = {
  getTrackMetadata,
  getTrackCover,
};
