"""Per-frame loudness envelope (0..1) of voice.wav, used to drive mouth flaps."""
import json, sys, wave, array, math, os
FPS = 30
d = sys.argv[1]
w = wave.open(os.path.join(d, "voice.wav")); sr = w.getframerate(); ch = w.getnchannels()
a = array.array("h", w.readframes(w.getnframes()))
mono = a[::ch]; hop = sr // FPS; env = []
for i in range(30 * FPS):
    seg = mono[i * hop:(i + 1) * hop]
    env.append(math.sqrt(sum(x * x for x in seg) / max(1, len(seg))) if seg else 0)
peak = sorted(env)[int(len(env) * 0.97)] or 1
env = [round(min(1, v / peak), 3) for v in env]
json.dump(env, open(os.path.join(d, "env.json"), "w"))
