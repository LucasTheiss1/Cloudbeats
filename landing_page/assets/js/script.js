/* jshint esversion: 6 */

// Example function to retrieve data from Icecast via JSON.
const STREAM_URL = 'http://localhost:8000/stream';
// Assuming Icecast provides its status in JSON format through the /status-json.xsl endpoint.
const STATUS_URL = '/status-json.xsl';
// players and controls
const player = document.getElementById('radioPlayer');
const playLiveBtn = document.getElementById('playLiveBtn');
const playIcon = document.getElementById('playIcon');
const playText = document.getElementById('playText');
const volumeControl = document.getElementById('volumeControl');
// track info elements
const albumTitle = document.getElementById('albumTitle');
const albumCover = document.getElementById('albumCover');
const listenerCount = document.getElementById('listenerCount');
// Progress bar elements
const currentTime = document.getElementById('currentTime');
const progressFill = document.getElementById('progressFill');
const progressDot = document.getElementById('progressDot');
// Sticky bar bottom of the audio player
const mainPlayer = document.querySelector(".now-playing-section");
const bottomPlayer = document.querySelector(".bottom-player");
const bottomPlayLiveBtn = document.getElementById('bottomPlayLiveBtn');
const bottomPlayIcon = document.getElementById('bottomPlayIcon');
const bottomVolumeControl = document.getElementById('bottomVolumeControl');
const bottomAlbumTitle = document.getElementById('bottomAlbumTitle');
const bottomTrackInfo = document.getElementById ('bottomTrackInfo');

const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      bottomPlayer.classList.remove("is-visible");
    } else {
      bottomPlayer.classList.add("is-visible");
    }
  },
  {
    threshold: 0.2,
  }
);

observer.observe(mainPlayer);

// Set initial volume
player.volume = volumeControl.value;


// Timer variables for live stream progress
let liveTimer = null;
let liveSeconds = 0;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function startLiveTimer() {
  clearInterval(liveTimer);

  liveTimer = setInterval(() => {
    liveSeconds++;
    currentTime.textContent = formatTime(liveSeconds);

    const progress = (liveSeconds % 240) / 240 * 100;
    progressFill.style.width = `${progress}%`;
    progressDot.style.left = `${progress}%`;
  }, 1000);
}

function stopLiveTimer() {
  clearInterval(liveTimer);
}


// Function to update track information on the page
function updateTrackInfo(track) {
  document.getElementById('trackInfo').textContent = track;
  document.getElementById('bottomTrackInfo').textContent = track;
}

function updateAlbumTitle(title) {
  albumTitle.textContent = title;
  bottomAlbumTitle.textContent = title;
}

function updateAlbumCover(imageUrl) {
  if (imageUrl) {
    albumCover.src = imageUrl;
  }
  
}

function updateListeners(count) {
  listenerCount.textContent = `${count} listeners`;
}

// Function to update the play/pause button state
function updatePlayerButton(isPlaying) {
  if (isPlaying) {
    playIcon.className = 'fa-solid fa-pause';
    playText.textContent = 'Pause Live';
  } else {
    playIcon.className = 'fa-solid fa-play';
    playText.textContent = 'Play Live';
  }
}

playLiveBtn.addEventListener('click', async () => {
  try {
    if (player.paused) {
        await player.play();
        updatePlayerButton(true);
        fetchNowPlaying();
      } else {
        player.pause();
        updatePlayerButton(false);
      }
  } catch (e) {
    console.log('Err:', e);
    updatePlayerButton(false);
  }
});

volumeControl.addEventListener('input', () => {
  player.volume = volumeControl.value;
});

async function fetchNowPlaying() {
  try {
    const response = await fetch(STATUS_URL);
    if (!response.ok) throw new Error('Error fetching status');
    const data = await response.json();
    let track = "Information unavailable";
    let stationName = "CloudBeats";
    let listeners = 0;

    if (data.icestats && data.icestats.source) {
      const source = Array.isArray(data.icestats.source)
        ? data.icestats.source[0]
        : data.icestats.source;
    
      track = source.title || "Unknown Track";
      stationName = source.server_name || "CloudBeats";
      listeners = source.listeners || 0;
}

updateTrackInfo(track);
updateAlbumTitle(stationName);
updateListeners(listeners);
  } catch (err) {
    console.error(err);
    updateTrackInfo("Error loading track");
  }
}

// Reconnect functionality and synchronization with play/pause state
function forceReconnect() {
  const noCacheUrl = STREAM_URL + '?t=' + new Date().getTime();

  player.src = noCacheUrl;
  player.load();

  player.play()
    .then(() => {
      updatePlayerButton(true);
      fetchNowPlaying();
    })
    .catch(e => {
      console.log('Error playing stream:', e);
      updatePlayerButton(false);
    });
}

player.addEventListener('pause', () => {
  updatePlayerButton(false);
  stopLiveTimer();
});

player.addEventListener('playing', () => {
  updatePlayerButton(true);
  startLiveTimer();
});

player.addEventListener('error', () => {
  console.log('Error detected. Trying to reconnect in 3 seconds...');
  setTimeout(forceReconnect, 3000);
});

fetchNowPlaying();
setInterval(fetchNowPlaying, 30000);
// Update every 30 seconds

if (bottomPlayLiveBtn) {
  bottomPlayLiveBtn.addEventListener('click', () => {
    playLiveBtn.click();
  });
}

if (bottomVolumeControl) {
  bottomVolumeControl.addEventListener('input', () => {
    volumeControl.value = bottomVolumeControl.value;
    volumeControl.dispatchEvent(new Event('input'));
  });
}

player.addEventListener('playing', () => {
  if (bottomPlayIcon) {
    bottomPlayIcon.className = 'fa-solid fa-pause';
  }
});

player.addEventListener('pause', () => {
  if (bottomPlayIcon) {
    bottomPlayIcon.className = 'fa-solid fa-play';
  }
});