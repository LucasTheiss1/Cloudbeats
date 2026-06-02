settings.server.telnet := true
settings.frame.duration := 0.04

volume = interactive.float("volume", 1.0)
live_mode = interactive.float("live_mode", 0.0)

settings.harbor.bind_addrs := ["0.0.0.0"]


myplaylist = playlist(mode="random", reload_mode="watch", "/media/notebook/Data/Backup/Music/teste_projct_radio/playlist.m3u")

primeira_playlist = playlist(mode="random", reload_mode="watch", "/media/notebook/Data/Backup/Music/teste_projct_radio/primeira_playlist/playlist.m3u")
segunda_playlist = playlist(mode="random", reload_mode="watch", "/media/notebook/Data/Backup/Music/teste_projct_radio/segunda_playlist/playlist.m3u")
terceira_playlist = playlist(mode="random", reload_mode="watch", "/media/notebook/Data/Backup/Music/teste_projct_radio/terceira_playlist/playlist.m3u")


auto_radio = switch( [  
  ({12h05-16h25},  primeira_playlist), 
  ({17h25-20h30},  segunda_playlist), 
  ({20h30-23h55},  terceira_playlist),
  ({true},  myplaylist)
  ])

auto_radio = fallback(track_sensitive = false, [auto_radio, blank()])

live_source = input.harbor(
  "live",
  port=9000,
  password="hackme",
  buffer=2.0,
  max=5.0
)

radio = switch(track_sensitive=false, [
  ({live_mode() > 0.5}, live_source),
  ({true}, auto_radio)
])

radio = fallback(track_sensitive=false, [radio, auto_radio, blank()])

radio = amplify(volume, radio)

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

output.icecast(%mp3(bitrate=64),
  host="icecast",
  port=8000,
  password="hackme",
  mount="stream",
  name="Radio cloudbeats",
  url="http://localhost",
  description="Radio Lucas",
  radio
)




interactive.harbor(port=8080)
