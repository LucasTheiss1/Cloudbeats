const { getTrackMetadata } = require("./track-metadata.service");

let currentTrack = {
  filename: null,
  status: "nothing playing",
  updatedAt: null,
  metadata: null,
};

async function updateCurrentTrack(filename) {
  const metadata = await getTrackMetadata(filename);

  currentTrack = {
    filename,
    status: "playing",
    updatedAt: new Date().toISOString(),
    metadata,
  };

  return currentTrack;
}

function getCurrentTrack() {
  return currentTrack;
}

module.exports = {
  updateCurrentTrack,
  getCurrentTrack,
};