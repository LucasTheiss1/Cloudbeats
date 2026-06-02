#!/bin/bash
find /home/ubuntu/online_radio/music -type f -iname "*.mp3" | sort > /home/ubuntu/online_radio/music/playlist.m3u
echo "Playlist atualizada."
