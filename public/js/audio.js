/* SoundEngine — generative WebAudio patches (placeholder music until real
   tracks are added) + support for real audio files via `track.audio`. */
(function () {
  const MINOR = [0, 2, 3, 5, 7, 8, 10];
  const midi = n => 440 * Math.pow(2, (n - 69) / 12);

  function rng(seed) { // deterministic so each track always sounds the same
    let s = seed >>> 0 || 1;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }

  const PATCHES = {
    pulse: { prog: [0, 5, 2, 6], kick: [0, 6, 8, 11], clap: [4, 12], hat: 'off', bass: [0, 3, 6, 10, 14], arp: 16, pad: .5, bell: 0, root: 45, delay: .38, swing: .04 },
    drift: { prog: [0, 3, 5, 4], kick: [], clap: [], hat: null, bass: [0], arp: 0, pad: 1, bell: 1, root: 41, delay: .55, crackle: true },
    glass: { prog: [0, 5, 3, 6], kick: [0, 10], clap: [8], hat: 'sparse', bass: [0, 8], arp: 0, pad: .6, bell: 2, root: 43, delay: .5, rim: true },
    night: { prog: [0, 6, 5, 4], kick: [0, 4, 8, 12], clap: [4, 12], hat: 'open', bass: 'roll', arp: 8, pad: .45, bell: 0, root: 40, delay: .33 }
  };

  class SoundEngine {
    constructor() {
      this.ctx = null; this.playing = false; this.track = null; this.listeners = new Set();
      this.offset = 0; this.startedAt = 0; this.bus = null; this.timer = null; this.audioEl = null;
    }
    on(fn) { this.listeners.add(fn); }
    emit(ev) { this.listeners.forEach(fn => fn(this, ev)); }

    init() {
      if (this.ctx) return;
      const C = window.AudioContext || window.webkitAudioContext;
      const ctx = this.ctx = new C();
      this.master = ctx.createGain(); this.master.gain.value = .8;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 3.5; comp.attack.value = .01; comp.release.value = .25;
      this.analyser = ctx.createAnalyser(); this.analyser.fftSize = 1024; this.analyser.smoothingTimeConstant = .82;
      this.master.connect(comp); comp.connect(this.analyser); this.analyser.connect(ctx.destination);

      // reverb
      this.verb = ctx.createConvolver();
      const len = ctx.sampleRate * 3.4, ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
      this.verb.buffer = ir;
      const vg = ctx.createGain(); vg.gain.value = .55; this.verb.connect(vg); vg.connect(this.master);

      // tape delay
      this.delay = ctx.createDelay(2); const fb = ctx.createGain(); fb.gain.value = .38;
      const dlp = ctx.createBiquadFilter(); dlp.type = 'lowpass'; dlp.frequency.value = 2600;
      this.delay.connect(dlp); dlp.connect(fb); fb.connect(this.delay);
      const dg = ctx.createGain(); dg.gain.value = .4; dlp.connect(dg); dg.connect(this.master); dg.connect(this.verb);

      this.noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const nd = this.noise.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    }

    get elapsed() {
      if (!this.track) return 0;
      if (this.track.audio && this.audioEl) return this.audioEl.currentTime;
      if (!this.ctx) return this.offset;
      return this.offset + (this.playing ? this.ctx.currentTime - this.startedAt : 0);
    }
    get duration() {
      if (this.track && this.track.audio && this.audioEl && isFinite(this.audioEl.duration)) return this.audioEl.duration;
      return this.track ? this.track.duration : 0;
    }

    load(track, index) {
      this.init();
      this._stopVoices();
      this.track = track; this.index = index; this.offset = 0;
      if (track.audio) {
        if (!this.audioEl) {
          this.audioEl = new Audio(); this.audioEl.crossOrigin = 'anonymous';
          this.ctx.createMediaElementSource(this.audioEl).connect(this.master);
          this.audioEl.addEventListener('ended', () => this.emit('ended'));
        }
        this.audioEl.src = track.audio;
      }
      this.emit();
    }

    async play() {
      this.init();
      if (this.ctx.state !== 'running') await this.ctx.resume();
      if (this.playing) return;
      this.playing = true;
      if (this.track.audio) { this.audioEl.play(); }
      else this._startVoices();
      this.emit();
    }

    pause() {
      if (!this.playing) return;
      this.offset = this.elapsed;
      this.playing = false;
      if (this.track.audio) this.audioEl.pause(); else this._stopVoices();
      this.emit();
    }

    seek(frac) {
      const t = frac * this.duration;
      if (this.track.audio && this.audioEl) { this.audioEl.currentTime = t; return; }
      const was = this.playing;
      if (was) this._stopVoices();
      this.offset = t;
      if (was) this._startVoices();
      this.emit();
    }

    /* ---------- generative sequencer ---------- */
    _startVoices() {
      const ctx = this.ctx, tr = this.track;
      this.p = PATCHES[tr.patch] || PATCHES.drift;
      this.rand = rng((tr.title.length * 7919) + (tr.key || 0));
      this.bus = ctx.createGain(); this.bus.gain.setValueAtTime(0, ctx.currentTime);
      this.bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.2);
      this.bus.connect(this.master);
      this.sendV = ctx.createGain(); this.sendV.gain.value = .5; this.bus.connect(this.sendV); this.sendV.connect(this.verb);
      this.delay.delayTime.setValueAtTime(60 / tr.bpm * (this.p.delay > .5 ? 1 : .75), ctx.currentTime);
      this.stepDur = 60 / tr.bpm / 4;
      this.startedAt = ctx.currentTime;
      this.step = Math.floor(this.offset / this.stepDur);
      this.nextTime = ctx.currentTime + .05;
      this.melody = Array.from({ length: 64 }, () => this.rand());
      if (this.p.crackle) this._crackle();
      const tick = () => {
        while (this.nextTime < ctx.currentTime + .12) { this._schedule(this.step, this.nextTime); this.nextTime += this.stepDur; this.step++; }
      };
      tick(); this.timer = setInterval(tick, 25);
    }

    _stopVoices() {
      clearInterval(this.timer); this.timer = null;
      if (this.bus && this.ctx) {
        const b = this.bus, now = this.ctx.currentTime;
        b.gain.cancelScheduledValues(now); b.gain.setValueAtTime(b.gain.value, now); b.gain.linearRampToValueAtTime(0, now + .35);
        setTimeout(() => { try { b.disconnect(); } catch (e) {} }, 500);
        if (this.crackleSrc) { try { this.crackleSrc.stop(now + .4); } catch (e) {} this.crackleSrc = null; }
      }
      this.bus = null;
    }

    _chord(bar) {
      const p = this.p, deg = p.prog[bar % p.prog.length], root = p.root + (this.track.key || 0);
      const n = i => { const d = deg + i; return root + MINOR[d % 7] + 12 * Math.floor(d / 7); };
      return [n(0), n(2), n(4), n(6)];
    }

    _schedule(step, t) {
      const p = this.p, s = step % 16, bar = Math.floor(step / 16), ch = this._chord(bar);
      const sw = (s % 2 === 1 && p.swing) ? p.swing * this.stepDur * 4 : 0; t += sw;
      const barDur = this.stepDur * 16;
      if (s === 0 && p.pad) ch.forEach((n, i) => this._pad(n + 12, t, barDur * 1.05, p.pad * (i === 3 ? .5 : 1)));
      if (p.kick.includes(s)) this._kick(t);
      if (p.clap.includes(s)) this._clap(t);
      if (p.hat === 'off' && s % 4 === 2) this._hat(t, .05, .22);
      if (p.hat === 'off' && s % 2 === 1) this._hat(t, .02, .07);
      if (p.hat === 'open' && s % 4 === 2) this._hat(t, .18, .2);
      if (p.hat === 'open' && s % 2 === 1) this._hat(t, .02, .06);
      if (p.hat === 'sparse' && (s === 6 || s === 14)) this._hat(t, .04, .09);
      if (p.rim && s === 12) this._rim(t);
      if (p.bass === 'roll') { if (s % 4 !== 0) this._bass(ch[0] - 12, t, this.stepDur * .9, .5); }
      else if (p.bass.includes(s)) this._bass(ch[0] - 12, t, p.bass.length === 1 ? barDur : this.stepDur * 2.5, p.bass.length === 1 ? .55 : .7);
      if (p.arp && s % (16 / p.arp) === 0) {
        const pat = [0, 1, 2, 3, 2, 1, 3, 0];
        const n = ch[pat[(s / (16 / p.arp)) % 8]] + 24 + (this.melody[(step) % 64] > .82 ? 12 : 0);
        this._pluck(n, t, .16);
      }
      if (p.bell && (s === 0 || s === 6 || s === 10) && this.melody[(step * 3) % 64] > (p.bell === 2 ? .25 : .5)) {
        const n = ch[Math.floor(this.melody[step % 64] * 4)] + 24 + (p.bell === 2 ? 12 : 0);
        this._bell(n, t, p.bell === 2 ? .12 : .09);
      }
    }

    _env(g, t, a, peak, d) { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }

    _pad(n, t, dur, amt) {
      const ctx = this.ctx, g = ctx.createGain(), f = ctx.createBiquadFilter();
      f.type = 'lowpass'; f.frequency.setValueAtTime(500, t); f.frequency.linearRampToValueAtTime(1400, t + dur * .5); f.frequency.linearRampToValueAtTime(600, t + dur); f.Q.value = .7;
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(.045 * amt, t + 1.2); g.gain.setValueAtTime(.045 * amt, t + dur - .6); g.gain.linearRampToValueAtTime(0.0001, t + dur + 1.2);
      [-7, 7].forEach(dt => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = midi(n); o.detune.value = dt; o.connect(f); o.start(t); o.stop(t + dur + 1.3); });
      f.connect(g); g.connect(this.bus);
    }
    _bass(n, t, dur, amt) {
      const ctx = this.ctx, o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = midi(n); o2.frequency.value = midi(n);
      f.type = 'lowpass'; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(180, t + Math.min(dur, .4));
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(.32 * amt, t + .01); g.gain.setValueAtTime(.32 * amt, t + dur * .7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); o2.connect(f); f.connect(g); g.connect(this.bus);
      o.start(t); o2.start(t); o.stop(t + dur + .05); o2.stop(t + dur + .05);
    }
    _pluck(n, t, amt) {
      const ctx = this.ctx, o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
      o.type = 'square'; o.frequency.value = midi(n);
      f.type = 'lowpass'; f.Q.value = 6; f.frequency.setValueAtTime(3200, t); f.frequency.exponentialRampToValueAtTime(300, t + .22);
      this._env(g, t, .004, amt * .5, .3);
      o.connect(f); f.connect(g); g.connect(this.bus); g.connect(this.delay);
      o.start(t); o.stop(t + .4);
    }
    _bell(n, t, amt) {
      const ctx = this.ctx, c = ctx.createOscillator(), m = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
      c.frequency.value = midi(n); m.frequency.value = midi(n) * 3.5;
      mg.gain.setValueAtTime(midi(n) * 2.2, t); mg.gain.exponentialRampToValueAtTime(1, t + 1.6);
      m.connect(mg); mg.connect(c.frequency);
      this._env(g, t, .005, amt, 2.6);
      c.connect(g); g.connect(this.bus); g.connect(this.delay);
      c.start(t); m.start(t); c.stop(t + 2.8); m.stop(t + 2.8);
    }
    _kick(t) {
      const ctx = this.ctx, o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.setValueAtTime(155, t); o.frequency.exponentialRampToValueAtTime(42, t + .12);
      this._env(g, t, .002, .9, .42);
      o.connect(g); g.connect(this.master); o.start(t); o.stop(t + .5);
      if (this.bus) { // sidechain pump
        this.bus.gain.setValueAtTime(.45, t); this.bus.gain.linearRampToValueAtTime(1, t + .22);
      }
    }
    _noise(t, dur) { const s = this.ctx.createBufferSource(); s.buffer = this.noise; s.start(t, Math.random() * .5); s.stop(t + dur); return s; }
    _hat(t, dec, amt) {
      const ctx = this.ctx, f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = 'highpass'; f.frequency.value = 7500; this._env(g, t, .001, amt * .5, dec);
      this._noise(t, dec + .05).connect(f); f.connect(g); g.connect(this.bus);
    }
    _clap(t) {
      const ctx = this.ctx, f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = 'bandpass'; f.frequency.value = 1500; f.Q.value = .9;
      g.gain.setValueAtTime(0.0001, t);
      [0, .012, .024].forEach(o => { g.gain.setValueAtTime(.34, t + o); g.gain.exponentialRampToValueAtTime(.05, t + o + .01); });
      g.gain.exponentialRampToValueAtTime(0.0001, t + .26);
      this._noise(t, .3).connect(f); f.connect(g); g.connect(this.bus); g.connect(this.verb);
    }
    _rim(t) {
      const ctx = this.ctx, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.value = 1700; this._env(g, t, .001, .12, .05);
      o.connect(g); g.connect(this.bus); g.connect(this.delay); o.start(t); o.stop(t + .1);
    }
    _crackle() {
      const ctx = this.ctx, len = ctx.sampleRate * 2, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() < .0009 ? (Math.random() * 2 - 1) * .7 : (Math.random() * 2 - 1) * .006;
      const s = ctx.createBufferSource(); s.buffer = b; s.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 3000; f.Q.value = .4;
      const g = ctx.createGain(); g.gain.value = .35;
      s.connect(f); f.connect(g); g.connect(this.bus); s.start(); this.crackleSrc = s;
    }
  }

  window.Sound = new SoundEngine();
})();
