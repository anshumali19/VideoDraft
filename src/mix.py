"""Final audio mix: voice + ducked character music bed + sound effects at the
pop-up/cut times the renderer recorded (build/<name>/sfx.json). Replaces the
audio of output/<name>.mp4 in place (the video stream is copied untouched).

    python3 src/mix.py <name> [<name> ...]
"""
import json, os, subprocess, sys, wave
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUD = os.path.join(ROOT, "build", "audio")
SR = 44100


def read_wav(p):
    with wave.open(p) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        return x[:: w.getnchannels()] if w.getnchannels() > 1 else x


def main(name):
    cfg = json.load(open(os.path.join(ROOT, "src", "scripts.json")))[name]
    who = name.split("_")[1]  # pidge / octavia / slowmo
    d = os.path.join(ROOT, "build", name)
    events = json.load(open(os.path.join(d, "sfx.json")))
    pop, whoosh = read_wav(os.path.join(AUD, "pop.wav")), read_wav(os.path.join(AUD, "whoosh.wav"))
    track = np.zeros(int(30 * SR), np.float32)
    last = -9
    for e in sorted(events, key=lambda e: e["t"]):
        if e["t"] - last < 0.12:  # never machine-gun pops
            continue
        s = whoosh if e["kind"] == "whoosh" else pop
        i = int(max(0, e["t"] - (0.12 if e["kind"] == "whoosh" else 0)) * SR)
        j = min(len(track), i + len(s)); track[i:j] += s[: j - i] * (0.55 if e["kind"] == "whoosh" else 0.4)
        last = e["t"]
    sfx_path = os.path.join(d, "sfx.wav")
    with wave.open(sfx_path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(track, -1, 1) * 32767).astype(np.int16).tobytes())

    mp4 = os.path.join(ROOT, "output", f"{name}.mp4")
    tmp = mp4 + ".tmp.mp4"
    music_gain = cfg.get("music_gain", 0.13)
    filt = (f"[1:a]aresample={SR},pan=mono|c0=c0,asplit=2[v1][v2];"
            f"[2:a]volume={music_gain}[mu];[mu][v1]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=350[duck];"
            f"[v2][duck][3:a]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11,"
            f"aresample={SR},pan=stereo|c0=c0|c1=c0[out]")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp4, "-i", os.path.join(d, "voice.wav"),
                    "-i", os.path.join(AUD, f"music_{who}.wav"), "-i", sfx_path,
                    "-filter_complex", filt, "-map", "0:v", "-map", "[out]", "-c:v", "copy",
                    "-c:a", "aac", "-b:a", "192k", "-t", "30", "-movflags", "+faststart", tmp], check=True)
    os.replace(tmp, mp4)
    print("mixed", name, f"({len(events)} sfx events)")


if __name__ == "__main__":
    for n in sys.argv[1:]:
        main(n)
