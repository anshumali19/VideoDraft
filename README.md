# VideoDraft: Funny Facts Shorts

Finished videos are in `output/`. To rebuild:

```
pip install piper-tts            # free offline TTS; download voices to $VOICES_DIR (see src/scripts.json)
python3 src/tts.py <name>        # voiceover  -> build/<name>/voice.wav
python3 src/envelope.py build/<name>   # lip-sync envelope
node src/render.js <name>        # frames (Playwright + SVG) -> output/<name>.mp4
node src/render.js <name> --preview 3,10,20   # still frames for checking
```

Batch helpers: `src/sheet.sh <name> 2,10,20` makes a contact sheet of preview frames; `src/queue.sh` is a render worker that
pulls names from `build/queue.txt`.

Scripts and subtitles live in `src/scripts.json`; scenes in `src/stage/<name>.js`; main characters in `src/stage/chars.js`, supporting cast and props in `src/stage/chars2.js`.
Publishing notes, captions and the posting order are in `output/UPLOAD_NOTES.md`.
