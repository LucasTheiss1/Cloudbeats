myplaylist = playlist(mode="random", reload_mode="watch", "/mnt/Data/Backup/Music/music/playlist.m3u")


radio = myplaylist
radio = fallback(track_sensitive = false, [radio, blank()])


nivelado = compress(
  attack=50.0,
  release=300.0,
  threshold=-20.0,
  ratio=20.0,
  gain=5.0,
  knee=0.0,
  window=0.1,
  radio
)

output.icecast(%mp3,
  host="icecast",
  port=8000,
  password="hackme",
  mount="stream",
  name="Radio cloudbeats",
  url="http://localhost",
  description="Radio Lucas",
  radio
)

