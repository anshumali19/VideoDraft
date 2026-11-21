"""Procedural (copyright-free) music beds and sound effects.

    python3 src/audio_assets.py      -> build/audio/{music_pidge,music_octavia,music_slowmo,pop,whoosh}.wav

Everything is synthesised from sine waves and noise, so there is nothing to license.
"""
import os, wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "build", "audio")
DUR = 30.0
rng = np.random.default_rng(7)


def note_hz(n):  # MIDI note number -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)


def env(n, attack, decay):
    t = np.arange(n) / SR
    a = np.minimum(1, t / max(attack, 1e-4))
    return a * np.exp(-t * decay)


def tone(freq, dur, decay=6.0, harmonics=((1, 1.0), (2, 0.35), (3, 0.15)), attack=0.004):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * freq * k * t) for k, a in harmonics)
    return s * env(n, attack, decay)


def kick(dur=0.25):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 50 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14)


def hat(dur=0.05):
    n = int(dur * SR)
    x = np.diff(rng.standard_normal(n + 1))
    return x * np.exp(-np.arange(n) / SR * 90) * 0.25


def place(buf, sig, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf): return
    j = min(len(buf), i + len(sig)); buf[i:j] += sig[: j - i] * gain


def finish(x, peak=0.9):
    n = len(x); fade = int(1.2 * SR)
    x[-fade:] *= np.linspace(1, 0, fade)
    x[: int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))
    return x / (np.max(np.abs(x)) + 1e-9) * peak


def music_pidge():
    """Bouncy C-major pluck groove, 108 bpm."""
    bpm = 108; b = 60 / bpm; x = np.zeros(int(DUR * SR))
    prog = [(48, [60, 64, 67, 72]), (45, [57, 60, 64, 69]), (41, [53, 57, 60, 65]), (43, [55, 59, 62, 67])]
    t, bar = 0.0, 0
    while t < DUR:
        root, ch = prog[bar % 4]
        for beat in range(4):
            tb = t + beat * b
            place(x, kick(), tb, 0.55 if beat % 2 == 0 else 0.0)
            place(x, tone(note_hz(root), b * 0.9, decay=5, harmonics=((1, 1), (2, 0.5))), tb, 0.45 if beat % 2 == 0 else 0.25)
            for half in (0, 1):
                th = tb + half * b / 2
                place(x, hat(), th, 0.5 if half else 0.25)
                place(x, tone(note_hz(ch[(beat * 2 + half) % 4] + 12), 0.25, decay=14), th, 0.18)
        t += 4 * b; bar += 1
    return finish(x)


def music_octavia():
    """Dramatic A-minor waltz ('telenovela'), 92 bpm in 3/4."""
    bpm = 92; b = 60 / bpm; x = np.zeros(int(DUR * SR))
    prog = [(45, [57, 60, 64]), (50, [62, 65, 69]), (52, [56, 59, 64]), (45, [57, 60, 64])]
    t, bar = 0.0, 0
    while t < DUR:
        root, ch = prog[bar % 4]
        place(x, tone(note_hz(root), b * 2.5, decay=2.5, harmonics=((1, 1), (2, 0.4), (3, 0.2))), t, 0.5)
        for beat in (1, 2):
            for nn in ch:
                place(x, tone(note_hz(nn), b * 0.7, decay=8, harmonics=((1, 1), (2, 0.25))), t + beat * b, 0.11)
        # slow pad, the drama
        for nn in ch:
            pad = tone(note_hz(nn + 12), b * 3, decay=0.6, harmonics=((1, 1), (2, 0.1)), attack=0.4)
            place(x, pad, t, 0.05)
        t += 3 * b; bar += 1
    return finish(x)


def music_slowmo():
    """Lazy F-major marimba, 66 bpm, lots of space."""
    bpm = 66; b = 60 / bpm; x = np.zeros(int(DUR * SR))
    prog = [(41, [65, 69, 72, 76]), (40, [64, 67, 71, 74]), (38, [62, 65, 69, 72]), (36, [60, 64, 67, 71])]
    t, bar = 0.0, 0
    marimba = ((1, 1.0), (4, 0.25), (10, 0.05))
    while t < DUR:
        root, ch = prog[bar % 4]
        place(x, tone(note_hz(root), b * 2, decay=2.0, harmonics=((1, 1), (2, 0.3))), t, 0.4)
        for i, beat in enumerate((0, 1.5, 2, 3)):
            place(x, tone(note_hz(ch[i]), 0.6, decay=7, harmonics=marimba), t + beat * b + 0.03 * (i % 2), 0.2)
        t += 4 * b; bar += 1
    return finish(x)


def sfx_pop():
    n = int(0.09 * SR); t = np.arange(n) / SR
    f = 500 + 900 * (t / t[-1])
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40)
    return s / np.max(np.abs(s)) * 0.9


def sfx_whoosh():
    n = int(0.4 * SR)
    noise = rng.standard_normal(n)
    spec = np.fft.rfft(noise); fr = np.fft.rfftfreq(n, 1 / SR)
    spec[(fr < 300) | (fr > 5000)] = 0
    s = np.fft.irfft(spec, n)
    e = np.sin(np.linspace(0, np.pi, n)) ** 2
    s = s * e
    return s / np.max(np.abs(s)) * 0.8


def write(path, x):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    write(os.path.join(OUT, "music_pidge.wav"), music_pidge())
    write(os.path.join(OUT, "music_octavia.wav"), music_octavia())
    write(os.path.join(OUT, "music_slowmo.wav"), music_slowmo())
    write(os.path.join(OUT, "pop.wav"), sfx_pop())
    write(os.path.join(OUT, "whoosh.wav"), sfx_whoosh())
    print("wrote", OUT)
