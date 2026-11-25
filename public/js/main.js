(function () {
  const S = window.SITE, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  const fmt = s => `${Math.floor(s / 60)}:${pad(Math.floor(s % 60))}`;
  const isTouch = matchMedia('(hover: none)').matches;
  const narrow = () => innerWidth <= 900;

  /* ---------------- grain texture ---------------- */
  (() => {
    const c = document.createElement('canvas'); c.width = c.height = 180; const x = c.getContext('2d');
    const d = x.createImageData(180, 180);
    for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0); document.documentElement.style.setProperty('--grain', `url(${c.toDataURL()})`);
  })();

  /* ---------------- text content ---------------- */
  $$('[data-site-name]').forEach(e => e.textContent = S.name);
  $$('[data-tagline]').forEach(e => e.textContent = S.tagline);
  $$('[data-location]').forEach(e => e.textContent = S.location);
  const yr = new Date().getFullYear(); $('#yearNow').textContent = yr; $('#yearFoot').textContent = yr;
  document.title = `${S.name} — ${S.tagline.replace(/ · /g, ', ')}`;

  const ht = $('#heroTitle'); ht.setAttribute('aria-label', S.name);
  [...S.name].forEach((ch, i) => {
    const o = document.createElement('span'); o.className = 'ch'; o.setAttribute('aria-hidden', 'true');
    const n = document.createElement('span'); n.textContent = ch; n.style.transitionDelay = `${.08 * i + .15}s`;
    o.appendChild(n); ht.appendChild(o);
  });

  const st = $('[data-statement]');
  st.innerHTML = S.statement.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');

  /* ---------------- clock ---------------- */
  const tick = () => {
    let t; try { t = new Date().toLocaleTimeString('en-GB', { timeZone: S.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
    catch (e) { t = new Date().toLocaleTimeString('en-GB'); }
    $('#clock').textContent = t; $('#clock2').textContent = t.slice(0, 5) + (S.timezone ? ` — ${S.timezone.split('/').pop().replace('_', ' ')}` : '');
  };
  tick(); setInterval(tick, 1000);

  /* ---------------- photos ---------------- */
  const track = $('#photoTrack');
  const sizes = ['', 'is-tall', 'is-small', '', 'is-tall', '', 'is-small'];
  S.photos.forEach((p, i) => {
    const f = document.createElement('figure'); f.className = `photo ${sizes[i % sizes.length]}`; f.dataset.cursor = 'View';
    f.innerHTML = `<div class="photo__frame"><span class="photo__n mono">${pad(i + 1)}</span><img src="${p.src}" alt="${p.title}" loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async"/></div>
      <figcaption class="mono"><b>${p.title}</b><span class="dim">${p.place} — ${p.year}</span></figcaption>`;
    f.addEventListener('click', () => openLightbox(i));
    track.appendChild(f);
  });
  const end = document.createElement('div'); end.className = 'hscroll__end';
  end.innerHTML = `<p class="mono dim">End of reel</p><p>More on <em>film</em>,<br/>shown in person.</p><a class="mono" href="#contact" data-cursor="Ask">Request the full archive →</a>`;
  track.appendChild(end);
  $('#photoCount').textContent = `${pad(S.photos.length)} photographs`;

  /* ---------------- horizontal scroll ---------------- */
  const hs = $('#hscroll'), hp = $('#hProgress');
  let hMax = 0;
  function sizeH() {
    if (narrow()) { hs.style.height = ''; track.style.transform = ''; return; }
    hMax = track.scrollWidth - innerWidth;
    hs.style.height = `${hMax + innerHeight}px`;
  }
  const imgs = $$('.photo img');
  imgs.forEach(im => im.complete ? 0 : im.addEventListener('load', sizeH));
  addEventListener('resize', sizeH); addEventListener('load', sizeH); sizeH();

  /* ---------------- reveal observers ---------------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-seen'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  $$('.photo').forEach(p => io.observe(p));

  /* ---------------- scroll loop ---------------- */
  const words = $$('.statement__text .w');
  const sections = ['image', 'sound', 'motion', 'contact'].map(id => document.getElementById(id));
  const navLinks = $$('.nav__links a');
  function onScroll() {
    const y = scrollY, vh = innerHeight;
    // horizontal
    if (!narrow()) {
      const r = hs.getBoundingClientRect();
      const p = Math.min(Math.max(-r.top / (hs.offsetHeight - vh), 0), 1);
      track.style.transform = `translate3d(${-p * hMax}px,0,0)`;
      hp.style.transform = `scaleX(${p})`;
      // inner parallax
      imgs.forEach(im => {
        const b = im.parentElement.getBoundingClientRect();
        const c = (b.left + b.width / 2) / innerWidth - .5;
        im.style.transform = `translate3d(${c * -6}%,0,0) scale(1.18)`;
      });
    }
    // statement word light-up
    const sr = st.getBoundingClientRect();
    const sp = Math.min(Math.max((vh * .85 - sr.top) / (sr.height + vh * .35), 0), 1);
    words.forEach((w, i) => w.classList.toggle('is-lit', i / words.length < sp));
    // nav current
    let cur = -1; sections.forEach((s, i) => { if (s.getBoundingClientRect().top < vh * .5) cur = i; });
    navLinks.forEach((a, i) => a.classList.toggle('is-current', i === cur));
  }

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  function startLenis() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.Lenis && !reduced) {
      lenis = new Lenis({ lerp: .085, smoothWheel: true, syncTouch: true, syncTouchLerp: .075, touchInertiaMultiplier: 28, gestureOrientation: 'vertical' });
      lenis.on('scroll', onScroll);
    }
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ripple: tiles wobble very slightly with scroll speed, settle when still */
    const disp = document.getElementById('rippleDisp'), turb = document.getElementById('rippleTurb');
    let amp = 0, lastY = scrollY, on = false;
    const raf = t => {
      if (lenis) lenis.raf(t);
      const v = lenis ? lenis.velocity : scrollY - lastY; lastY = scrollY;
      const target = reduced ? 0 : Math.min(Math.abs(v) * .32, 7);
      amp += (target - amp) * (target > amp ? .18 : .07);
      if (amp > .12) {
        if (!on) { document.body.classList.add('is-rippling'); on = true; }
        const s = t / 1000;
        disp.setAttribute('scale', amp.toFixed(2));
        turb.setAttribute('baseFrequency', `${(.0035 + Math.sin(s * .9) * .001).toFixed(5)} ${(.022 + Math.sin(s * 1.7) * .005).toFixed(5)}`);
      } else if (on) { document.body.classList.remove('is-rippling'); on = false; amp = 0; }
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); const t = id === '#top' ? 0 : document.querySelector(id);
    if (t === null) return; e.preventDefault();
    if (lenis) lenis.scrollTo(t, { duration: 1.6 }); else (t === 0 ? scrollTo({ top: 0, behavior: 'smooth' }) : t.scrollIntoView({ behavior: 'smooth' }));
  }));

  /* ---------------- cursor ---------------- */
  if (!isTouch) {
    document.documentElement.classList.add('has-cursor');
    const cur = $('#cursor'), ring = cur.querySelector('.cursor__ring'), dot = cur.querySelector('.cursor__dot'), lab = $('#cursorLabel');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() { rx += (mx - rx) * .18; ry += (my - ry) * .18; dot.style.transform = `translate3d(${mx}px,${my}px,0)`; ring.style.transform = `translate3d(${rx}px,${ry}px,0)`; requestAnimationFrame(loop); })();
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor]');
      if (t) { lab.textContent = t.dataset.cursor; cur.classList.add('is-active'); } else cur.classList.remove('is-active');
    });
    document.addEventListener('pointerleave', () => cur.classList.remove('is-active'));
  }

  /* ---------------- lightbox ---------------- */
  const lb = $('#lightbox'), lbImg = $('#lbImg'); let lbI = 0;
  function showLb(i) {
    lbI = (i + S.photos.length) % S.photos.length; const p = S.photos[lbI];
    lbImg.classList.remove('is-in');
    const im = new Image(); im.onload = () => { lbImg.src = p.src; lbImg.alt = p.title; requestAnimationFrame(() => lbImg.classList.add('is-in')); }; im.src = p.src;
    $('#lbIndex').textContent = `${pad(lbI + 1)} / ${pad(S.photos.length)}`; $('#lbTitle').textContent = p.title; $('#lbPlace').textContent = `${p.place} — ${p.year}`;
  }
  function openLightbox(i) { showLb(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); lenis && lenis.stop(); }
  function closeLightbox() { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); lenis && lenis.start(); }
  $('#lbPrev').onclick = () => showLb(lbI - 1); $('#lbNext').onclick = () => showLb(lbI + 1); $('#lbClose').onclick = closeLightbox;
  let tx = 0; lb.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) showLb(lbI + (d < 0 ? 1 : -1)); });

  /* ---------------- player ---------------- */
  const SND = window.Sound, player = $('#player'), list = $('#tracks');
  S.tracks.forEach((t, i) => {
    const li = document.createElement('li'); li.className = 'track'; li.dataset.cursor = 'Play';
    li.innerHTML = `<span class="track__n"><span class="track__num">${pad(i + 1)}</span><span class="track__bars"><i></i><i></i><i></i></span></span>
      <span class="track__t">${t.title}</span><span class="track__s mono">${t.sub}</span><span class="track__d">${fmt(t.duration)}</span>`;
    li.addEventListener('click', () => { if (SND.index === i && SND.playing) SND.pause(); else { if (SND.index !== i) loadTrack(i); SND.play(); } });
    list.appendChild(li);
  });
  $('#trackCount').textContent = `${pad(S.tracks.length)} pieces`;

  function loadTrack(i) {
    i = (i + S.tracks.length) % S.tracks.length; const t = S.tracks[i];
    SND.load(t, i);
    const words = t.title.split(' ');
    $('#nowTitle').innerHTML = words.map((w, k) => k === words.length - 1 ? `<em>${w}</em>` : w).join(' ');
    $('#nowSub').textContent = `${t.sub} · ${t.bpm || ''} BPM`;
    $('#coverImg').style.backgroundImage = `url(${t.cover})`;
    $$('.track').forEach((el, k) => el.classList.toggle('is-current', k === i));
    $('#tDur').textContent = fmt(SND.duration);
  }
  function toggle() { if (SND.track == null) loadTrack(0); SND.playing ? SND.pause() : SND.play(); }
  // pre-fill UI without creating an AudioContext
  (() => { const t = S.tracks[0]; const w = t.title.split(' ');
    $('#nowTitle').innerHTML = w.map((x, k) => k === w.length - 1 ? `<em>${x}</em>` : x).join(' ');
    $('#nowSub').textContent = `${t.sub} · ${t.bpm} BPM`; $('#coverImg').style.backgroundImage = `url(${t.cover})`;
    $('#tDur').textContent = fmt(t.duration); list.children[0].classList.add('is-current'); })();

  $('#playBtn').onclick = toggle; $('#playerCover').onclick = toggle; $('#soundToggle').onclick = toggle;
  $('#nextBtn').onclick = () => { const was = SND.playing || !SND.track; loadTrack((SND.index ?? 0) + 1); if (was) SND.play(); };
  $('#prevBtn').onclick = () => { const was = SND.playing || !SND.track; loadTrack((SND.index ?? 0) - 1); if (was) SND.play(); };
  $('#seek').addEventListener('click', e => { if (!SND.track) loadTrack(0); const r = e.currentTarget.getBoundingClientRect(); SND.seek((e.clientX - r.left) / r.width); });
  SND.on((s, ev) => {
    player.classList.toggle('is-playing', s.playing);
    $('#soundToggle').classList.toggle('is-on', s.playing);
  });
  SND.on((s, ev) => { if (ev === 'ended') $('#nextBtn').click(); });

  // visualizer
  const viz = $('#viz'), vx = viz.getContext('2d');
  let freq = null, wave = null;
  function drawViz() {
    requestAnimationFrame(drawViz);
    const r = viz.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio, 2);
    if (viz.width !== Math.round(r.width * dpr)) { viz.width = Math.round(r.width * dpr); viz.height = Math.round(r.height * dpr); }
    const W = viz.width, H = viz.height; vx.clearRect(0, 0, W, H);
    if (SND.track && !SND.playing && !SND.ctx) return;
    // progress
    if (SND.track) {
      const el = SND.elapsed, d = SND.duration;
      if (SND.playing && el >= d && !SND.track.audio) { $('#nextBtn').click(); }
      $('#seekFill').style.width = `${Math.min(el / d, 1) * 100}%`; $('#tCur').textContent = fmt(Math.min(el, d));
    }
    if (!SND.analyser || !SND.playing) return;
    const A = SND.analyser; freq = freq || new Uint8Array(A.frequencyBinCount); wave = wave || new Uint8Array(A.fftSize);
    A.getByteFrequencyData(freq); A.getByteTimeDomainData(wave);
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) * .27, N = 120;
    let bass = 0; for (let i = 2; i < 12; i++) bass += freq[i]; bass /= 2550;
    // radial bars
    vx.save(); vx.translate(cx, cy);
    for (let i = 0; i < N; i++) {
      const k = i < N / 2 ? i : N - i; const v = freq[Math.floor(3 + k * 2.6)] / 255;
      const a = (i / N) * Math.PI * 2 - Math.PI / 2, len = R * .08 + v * v * R * .9;
      vx.strokeStyle = `rgba(236,230,220,${.25 + v * .75})`; vx.lineWidth = Math.max(1.5 * dpr, (W / N) * .28);
      vx.beginPath(); vx.moveTo(Math.cos(a) * (R + bass * 18 * dpr), Math.sin(a) * (R + bass * 18 * dpr));
      vx.lineTo(Math.cos(a) * (R + len), Math.sin(a) * (R + len)); vx.stroke();
    }
    // inner waveform ring
    vx.beginPath();
    for (let i = 0; i <= 256; i++) {
      const s = (wave[Math.floor(i / 256 * (wave.length - 1))] - 128) / 128; const a = (i / 256) * Math.PI * 2;
      const rr = R * .78 + s * R * .35; const x = Math.cos(a) * rr, y = Math.sin(a) * rr; i ? vx.lineTo(x, y) : vx.moveTo(x, y);
    }
    vx.strokeStyle = '#ff5a1f'; vx.lineWidth = 1.5 * dpr; vx.shadowColor = '#ff5a1f'; vx.shadowBlur = 18 * dpr; vx.stroke();
    vx.restore();
  }
  drawViz();

  /* ---------------- films ---------------- */
  const films = $('#films');
  S.films.forEach((f, i) => {
    const el = document.createElement('article'); el.className = 'film'; el.dataset.cursor = 'Play';
    el.innerHTML = `<div class="film__frame">
        <div class="film__poster" style="background-image:url(${f.poster})"></div>
        <div class="film__scrub">${f.frames.map(s => `<div style="background-image:url(${s})"></div>`).join('')}</div>
        <span class="film__bars film__bars--t"></span><span class="film__bars film__bars--b"></span>
        <span class="film__runtime mono">${f.runtime}</span>
        <span class="film__tc mono"><span class="dot"></span><span class="tc">Hover to scrub</span></span>
      </div>
      <div class="film__meta"><h3 class="film__title">${f.title}</h3><span class="mono dim">${f.role} — ${f.year}</span></div>`;
    const frame = el.querySelector('.film__frame'), scr = [...el.querySelectorAll('.film__scrub div')], tc = el.querySelector('.tc');
    if (!isTouch) {
      frame.addEventListener('pointermove', e => {
        const r = frame.getBoundingClientRect(), p = Math.min(Math.max((e.clientX - r.left) / r.width, 0), .999);
        el.classList.add('is-scrubbing'); scr.forEach((d, k) => d.classList.toggle('on', k === Math.floor(p * scr.length)));
        const [m, s] = f.runtime.split(':').map(Number), tot = p * (m * 60 + s);
        tc.textContent = `${pad(Math.floor(tot / 60))}:${pad(Math.floor(tot % 60))}:${pad(Math.floor((tot % 1) * 24))}`;
      });
      frame.addEventListener('pointerleave', () => { el.classList.remove('is-scrubbing'); tc.textContent = 'Hover to scrub'; });
    }
    el.addEventListener('click', () => openCinema(i));
    films.appendChild(el);
  });
  $('#filmCount').textContent = `${pad(S.films.length)} films`;

  /* ---------------- cinema ---------------- */
  const cine = $('#cinema'), cc = $('#cinemaCanvas'), cx2 = cc.getContext('2d');
  let cineRaf = 0, cineFilm = null, cineStart = 0, cineImgs = [], resumeAfter = null;
  function openCinema(i) {
    const f = S.films[i]; cineFilm = f;
    $('#cineTitle').textContent = `${f.title} — ${f.role}, ${f.year}`;
    cine.classList.add('is-open'); cine.setAttribute('aria-hidden', 'false'); lenis && lenis.stop();
    if (f.embed) {
      cine.classList.add('has-embed');
      const sep = f.embed.includes('?') ? '&' : '?';
      $('#cinemaEmbed').innerHTML = `<iframe src="${f.embed}${sep}autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      if (SND.playing) { SND.pause(); resumeAfter = null; }
      return;
    }
    cine.classList.remove('has-embed');
    cineImgs = f.frames.map(src => { const im = new Image(); im.src = src; return im; });
    resumeAfter = SND.playing ? SND.index : null;
    if (f.track != null) { loadTrack(f.track); SND.play(); }
    cineStart = performance.now(); cancelAnimationFrame(cineRaf); cineLoop();
  }
  function closeCinema() {
    cine.classList.remove('is-open', 'has-embed'); cine.setAttribute('aria-hidden', 'true'); lenis && lenis.start();
    $('#cinemaEmbed').innerHTML = ''; cancelAnimationFrame(cineRaf);
    if (cineFilm && cineFilm.track != null && !cineFilm.embed && resumeAfter == null) SND.pause();
    cineFilm = null;
  }
  $('#cineClose').onclick = closeCinema;
  const SHOT = 6.5, FADE = 1.6;
  function drawCover(im, scale, ox, oy, alpha) {
    if (!im.complete || !im.naturalWidth) return;
    const W = cc.width, H = cc.height, ir = im.naturalWidth / im.naturalHeight, r = W / H;
    let w, h; if (ir > r) { h = H; w = H * ir; } else { w = W; h = W / ir; }
    w *= scale; h *= scale;
    cx2.globalAlpha = alpha; cx2.drawImage(im, (W - w) / 2 + ox * W, (H - h) / 2 + oy * H, w, h);
  }
  function cineLoop() {
    cineRaf = requestAnimationFrame(cineLoop);
    const r = cc.getBoundingClientRect(), dpr = Math.min(devicePixelRatio, 2);
    if (cc.width !== Math.round(r.width * dpr)) { cc.width = Math.round(r.width * dpr); cc.height = Math.round(r.height * dpr); }
    const t = (performance.now() - cineStart) / 1000, n = cineImgs.length, total = n * SHOT;
    const W = cc.width, H = cc.height;
    cx2.globalAlpha = 1; cx2.fillStyle = '#000'; cx2.fillRect(0, 0, W, H);
    const lt = t % total, k = Math.floor(lt / SHOT), local = lt - k * SHOT;
    const draw = (idx, lt2, a) => { const dir = idx % 2 ? 1 : -1, p = lt2 / (SHOT + FADE);
      drawCover(cineImgs[idx % n], 1.08 + p * .14, dir * (p - .5) * .05, (idx % 3 - 1) * p * .02, a); };
    draw(k, local + FADE, 1);
    if (local > SHOT - FADE) draw(k + 1, local - (SHOT - FADE), (local - (SHOT - FADE)) / FADE);
    // flicker + grain + vignette
    cx2.globalAlpha = 1;
    const g = cx2.createRadialGradient(W / 2, H / 2, H * .2, W / 2, H / 2, W * .65);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${.55 + Math.random() * .05})`);
    cx2.fillStyle = g; cx2.fillRect(0, 0, W, H);
    cx2.fillStyle = `rgba(255,200,150,${Math.random() * .025})`; cx2.fillRect(0, 0, W, H);
    for (let i = 0; i < 2; i++) { if (Math.random() < .3) { cx2.fillStyle = 'rgba(255,255,255,.08)'; cx2.fillRect(Math.random() * W, 0, 1 * dpr, H); } }
    // fade in from black
    if (t < 1.5) { cx2.fillStyle = `rgba(0,0,0,${1 - t / 1.5})`; cx2.fillRect(0, 0, W, H); }
    // title card
    if (t < 4.5) {
      const a = Math.min(t / 1, 1) * Math.min((4.5 - t) / 1, 1);
      cx2.globalAlpha = a; cx2.fillStyle = '#ece6dc'; cx2.textAlign = 'center'; cx2.textBaseline = 'middle';
      cx2.font = `italic ${Math.round(H * .14)}px "Instrument Serif", serif`; cx2.fillText(cineFilm.title, W / 2, H / 2);
      cx2.font = `${Math.round(H * .028)}px "JetBrains Mono", monospace`; cx2.fillText(`${S.name.toUpperCase()}  ·  ${cineFilm.year}`, W / 2, H / 2 + H * .12);
      cx2.globalAlpha = 1;
    }
    const fps = 24, tf = Math.floor(t * fps);
    $('#cineTc').textContent = `${pad(Math.floor(tf / 86400))}:${pad(Math.floor(tf / 1440) % 60)}:${pad(Math.floor(tf / 24) % 60)}:${pad(tf % 24)}`;
    $('#cineProg').style.width = `${(lt / total) * 100}%`;
  }

  /* ---------------- contact ---------------- */
  $('#mailLink').href = $('#mailText').href = `mailto:${S.email}`; $('#mailText').textContent = S.email;
  const mq = $('#marquee'); const chunk = `<span>Let's make something</span><span>—</span><span>Say hello</span><span>—</span>`;
  mq.innerHTML = chunk.repeat(4);
  $('#socials').innerHTML = S.socials.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener" data-cursor="Open">${s.label}</a></li>`).join('');

  /* ---------------- keyboard ---------------- */
  addEventListener('keydown', e => {
    if (lb.classList.contains('is-open')) { if (e.key === 'Escape') closeLightbox(); if (e.key === 'ArrowRight') showLb(lbI + 1); if (e.key === 'ArrowLeft') showLb(lbI - 1); return; }
    if (cine.classList.contains('is-open')) { if (e.key === 'Escape') closeCinema(); return; }
    if (e.key === ' ' && e.target === document.body) { e.preventDefault(); toggle(); }
  });

  /* ---------------- loader ---------------- */
  const critical = ['/media/hero.jpg', ...S.photos.slice(0, 4).map(p => p.src), S.tracks[0].cover];
  let loaded = 0, shown = 0, done = false;
  critical.forEach(src => { const im = new Image(); im.onload = im.onerror = () => loaded++; im.src = src; });
  const t0 = performance.now();
  (function lt() {
    const target = Math.min(loaded / critical.length, (performance.now() - t0) / 1400) * 100;
    shown += (target - shown) * .12; if (target >= 100 && shown > 99.4) shown = 100;
    $('#loaderCount').textContent = pad(Math.round(shown), 3); $('#loaderBar').style.width = `${shown}%`;
    if (shown >= 100 && !done) {
      done = true;
      setTimeout(() => {
        $('#loader').classList.add('is-done'); document.body.classList.remove('is-loading');
        setTimeout(() => document.body.classList.add('is-in'), 250);
        sizeH(); startLenis();
      }, 250);
      return;
    }
    if (performance.now() - t0 > 6000) loaded = critical.length; // never hang
    requestAnimationFrame(lt);
  })();
})();
