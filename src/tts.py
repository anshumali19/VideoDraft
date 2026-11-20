"""Synthesise per-chunk voiceover with Piper (free, offline TTS) and lay each
chunk onto a 30 s track at its subtitle start time. Chunks that run longer than
their subtitle window are re-synthesised faster until they fit."""
import json, os, re, subprocess, sys, wave, array

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICES = os.environ["VOICES_DIR"]
OUT = os.path.join(ROOT, "build")
SR_OUT = 44100
TOTAL = 30.0

def synth(text, voice, ls, path):
    subprocess.run([sys.executable, "-m", "piper", "-m", os.path.join(VOICES, voice + ".onnx"),
                    "--length-scale", str(ls), "--sentence-silence", "0.15", "-f", path],
                   input=text.encode(), check=True, capture_output=True)

def dur(path):
    with wave.open(path) as w:
        return w.getnframes() / w.getframerate()

def chunk_audio(text, cfg, ls, path):
    pause = cfg.get("pause")
    if not pause or "..." not in text:
        synth(text, cfg["voice"], ls, path); return
    # sloth mode: speak each fragment separately, join with explicit silences
    parts = [p.strip() for p in text.split("...") if p.strip()]
    tmp = []
    for i, p in enumerate(parts):
        f = f"{path}.{i}.wav"; synth(p, cfg["voice"], ls, f); tmp.append(f)
    frames, params = [], None
    for f in tmp:
        with wave.open(f) as w:
            params = w.getparams(); frames.append(w.readframes(w.getnframes()))
        os.remove(f)
    sil = b"\x00\x00" * int(params.framerate * pause)
    with wave.open(path, "wb") as w:
        w.setparams(params); w.writeframes(sil.join(frames))

def main(name):
    cfg = json.load(open(os.path.join(ROOT, "src", "scripts.json")))[name]
    for attempt in range(5):
        try:
            return build(name, cfg)
        except Overflow as e:
            print(e, "-> retrying faster")
            cfg["length_scale"] = round(cfg["length_scale"] * 0.95, 3)
            cfg["gap"] = round(cfg.get("gap", 0.35) * 0.6, 3)
            if cfg.get("pause"): cfg["pause"] = round(cfg["pause"] * 0.7, 3)
            cfg["anchor"] = False
    sys.exit(f"{name}: could not fit in 30 s")

class Overflow(Exception): pass

def build(name, cfg):
    d = os.path.join(OUT, name); os.makedirs(d, exist_ok=True)
    timing = []; cursor = 0.15
    for i, c in enumerate(cfg["chunks"]):
        ls = cfg["length_scale"]; p = os.path.join(d, f"c{i}.wav")
        if not (os.environ.get("REUSE") and os.path.exists(p)):
            chunk_audio(c["say"], cfg, ls, p)
        L = dur(p)
        st = max(cursor, c["start"] + 0.1) if cfg.get("anchor", True) else cursor
        timing.append({"i": i, "start": round(st, 2), "len": round(L, 2)})
        cursor = st + L + cfg.get("gap", 0.35)
        print(name, i, f"start={st:.2f} len={L:.2f} end={st+L:.2f}")
    end = timing[-1]["start"] + timing[-1]["len"]
    if end > TOTAL - 0.6:
        raise Overflow(f"{name}: voiceover ends at {end:.2f}s, too long")
    if not cfg.get("anchor", True) and len(timing) > 1:
        # spread any spare time across the pauses so the track fills ~29 s
        extra = min(1.4, max(0.0, (TOTAL - 1.0 - end) / (len(timing) - 1)))
        for k, tm in enumerate(timing):
            tm["start"] = round(tm["start"] + extra * k, 2)
        print(name, f"spread +{extra:.2f}s per pause, ends {timing[-1]['start'] + timing[-1]['len']:.2f}")
    # mix with ffmpeg: delay each chunk, optional pitch shift, pad to 30 s
    inputs, filt = [], []
    pitch = cfg.get("pitch", 1.0)
    for t in timing:
        inputs += ["-i", os.path.join(d, f"c{t['i']}.wav")]
        ms = int(t["start"] * 1000)
        ps = (f"asetrate=22050*{pitch},aresample={SR_OUT},atempo={1/pitch:.4f}," if pitch != 1.0
              else f"aresample={SR_OUT},")
        filt.append(f"[{t['i']}]{ps}adelay={ms}|{ms}[a{t['i']}]")
    mix = "".join(f"[a{t['i']}]" for t in timing)
    filt.append(f"{mix}amix=inputs={len(timing)}:normalize=0,apad,atrim=0:{TOTAL},"
                f"loudnorm=I=-16:TP=-1.5[out]")
    subprocess.run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(filt),
                    "-map", "[out]", "-ac", "2", "-ar", str(SR_OUT), os.path.join(d, "voice.wav")], check=True)
    json.dump(timing, open(os.path.join(d, "timing.json"), "w"), indent=1)

if __name__ == "__main__":
    for n in sys.argv[1:]: main(n)
