const { getTrackMetadata } = require("./track-metadata.service");

/**
 * In-memory cache holding the current playback state.
 * This state is updated whenever Liquidsoap notifies the API
 * about a new track.
 */
let currentTrack = {
  filename: null,
  status: "nothing playing",
  updatedAt: null,
  metadata: null,
};

/**
 * Updates the current playback state using the track filename.
 * Metadata is extracted and cached for subsequent API requests.
 */
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

/**
 * Returns the current cached playback state.
 */
function getCurrentTrack() {
  return currentTrack;
}

module.exports = {
  updateCurrentTrack,
  getCurrentTrack,
};