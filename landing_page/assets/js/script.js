  // Exemplo de função para buscar dados do Icecast via JSON.
    // Supondo que o Icecast disponibilize o status em JSON no endpoint /status-json.xsl.
const STREAM_URL = 'http://localhost:8000/stream';
const STATUS_URL = '/status-json.xsl';
const player = document.getElementById('radioPlayer');
let wasPaused = false;

async function fetchNowPlaying() {
  try {
    const response = await fetch(STATUS_URL);
    if (!response.ok) throw new Error('Erro ao buscar status');
    const data = await response.json();
    let track = "Informação indisponível";
    if (data.icestats && data.icestats.source) {
      const source = Array.isArray(data.icestats.source) ? data.icestats.source[0] : data.icestats.source;
      track = source.title || source.artist || "Faixa desconhecida";
    }
    document.getElementById('trackInfo').textContent = track;
  } catch (err) {
    console.error(err);
    document.getElementById('trackInfo').textContent = "Erro ao carregar faixa";
  }
}

function forceReconnect() {
  const noCacheUrl = STREAM_URL + '?t=' + new Date().getTime();
  player.src = noCacheUrl;
  player.load();
  player.play().then(() => fetchNowPlaying()).catch(e => {
    console.log('Erro ao tocar:', e);
  });
}

player.addEventListener('pause', () => {
  wasPaused = true;
});

player.addEventListener('play', () => {
  if (wasPaused) {
    forceReconnect();
    wasPaused = false;
  }
});

player.addEventListener('error', () => {
  console.log('Erro detectado. Tentando reconectar em 3 segundos...');
  setTimeout(forceReconnect, 3000);
});

fetchNowPlaying();
setInterval(fetchNowPlaying, 30000);
    fetchNowPlaying();
    setInterval(fetchNowPlaying, 30000); // Atualiza a cada 30 segundos

    // Reconnect functionality
    // This function forces the audio player to reconnect to the stream
    // by appending a timestamp to the URL to prevent caching.
    // This is useful for Icecast streams that may drop connections.
    // It also handles errors and attempts to reconnect automatically.