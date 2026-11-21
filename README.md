# VideoDraft: Funny Facts Shorts

Finished videos are in `output/`. To rebuild:

```
pip install piper-tts            # free offline TTS; download voices to $VOICES_DIR (see src/scripts.json)
python3 src/tts.py <name>        # voiceover  -> build/<name>/voice.wav
python3 src/envelope.py build/<name>   # lip-sync envelope
node src/render.js <name>        # frames (Playwright + SVG) -> output/<name>.mp4
node src/render.js <name> --preview 3,10,20   # still frames for checking
python3 src/audio_assets.py      # once: code-generated music beds + pop/whoosh (no licensing needed)
python3 src/mix.py <name>        # voice + ducked music + sound effects -> replaces the MP4's audio
node src/render.js <name> --cover   # output/covers/<name>.png (hook frame, 1080x1920)
```

Per-video options in `src/scripts.json`: `hook` (two lines shown from frame 1), `num` (series number), `hookY`, `music_gain`.

Batch helpers: `src/sheet.sh <name> 2,10,20` makes a contact sheet of preview frames; `src/queue.sh` is a render worker that
pulls names from `build/queue.txt`.

Scripts and subtitles live in `src/scripts.json`; scenes in `src/stage/<name>.js`; main characters in `src/stage/chars.js`, supporting cast and props in `src/stage/chars2.js`.
Publishing notes, captions and the posting order are in `output/UPLOAD_NOTES.md`.
