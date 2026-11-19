# VideoDraft: Funny Facts Shorts

Finished videos are in `output/`. To rebuild:

```
pip install piper-tts            # free offline TTS; download voices to $VOICES_DIR (see src/scripts.json)
python3 src/tts.py <name>        # voiceover  -> build/<name>/voice.wav
python3 src/envelope.py build/<name>   # lip-sync envelope
node src/render.js <name>        # frames (Playwright + SVG) -> output/<name>.mp4
node src/render.js <name> --preview 3,10,20   # still frames for checking
```

Scripts and subtitles live in `src/scripts.json`; scenes in `src/stage/<name>.js`; characters in `src/stage/chars.js`.
