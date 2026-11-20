// Video 2: Octavia's Three Broken Hearts
window.META = { name: 'OCTAVIA', color: '#c26ae6' };

function sea(t, dark = 0) {
  const top = dark ? '#0b3d6b' : '#1f8fb8', bot = dark ? '#06223f' : '#0d4f86';
  let s = `<defs><linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#sea)"/>`;
  for (let i = 0; i < 4; i++) { const x = 60 + i * 140 + Math.sin(t * 0.5 + i) * 20;
    s += `<path d="M${x} 0 L${x + 60} 0 L${x + 160} 700 L${x + 40} 700Z" fill="#fff" opacity=".06"/>`; }
  s += `<path d="M0 600 Q135 570 270 590 T540 585 V${H} H0Z" fill="#e8c98a"/><path d="M0 640 Q135 620 270 640 T540 630 V${H} H0Z" fill="#d9b574"/>`;
  [[30, 600], [500, 610], [80, 620]].forEach(([x, y], i) => s += tentacle(x, y, -90 + (i - 1) * 5, 240 + i * 30, 22, t, i * 2, { fill: '#3fae5c', amp: 0.5, speed: 1.6 })
    .replace(/<circle[^>]*>/g, '').replace(/#3a1850/g, '#1d5a2c'));
  for (let i = 0; i < 14; i++) {
    const x = rnd(i) * W + Math.sin(t * 2 + i) * 8, y = H - ((t * (40 + rnd(i + 5) * 60) + rnd(i + 9) * H) % (H + 40));
    s += `<circle cx="${x}" cy="${y}" r="${3 + rnd(i + 2) * 7}" fill="none" stroke="#bff3ff" stroke-width="2.5" opacity=".7"/>`;
  }
  return s;
}

function couch() {
  return `<ellipse cx="270" cy="600" rx="240" ry="18" fill="rgba(0,0,0,.25)"/>
  <rect x="70" y="330" width="400" height="170" rx="40" fill="#8e1e4f" stroke="#3a0b20" stroke-width="6"/>
  ${[0, 1, 2].map(i => `<circle cx="${150 + i * 120}" cy="${400}" r="5" fill="#5c0f31"/>`).join('')}
  <rect x="60" y="470" width="420" height="100" rx="26" fill="#b02a63" stroke="#3a0b20" stroke-width="6"/>
  <rect x="30" y="400" width="70" height="180" rx="34" fill="#a3245a" stroke="#3a0b20" stroke-width="6"/>
  <rect x="440" y="400" width="70" height="180" rx="34" fill="#a3245a" stroke="#3a0b20" stroke-width="6"/>
  <path d="M80 570 l-6 26 M460 570 l6 26" stroke="#d4a017" stroke-width="10" stroke-linecap="round"/>`;
}

function ecg(t, x, y, w, h, stopAt) {
  let pts = [];
  const flat = t > stopAt;
  for (let i = 0; i <= 120; i++) {
    const px = x + (i / 120) * w, tt = t - (1 - i / 120) * 2.2;
    let v = 0;
    if (tt < stopAt) { const ph = (tt * 1.4) % 1; v = ph > 0.4 && ph < 0.45 ? -1 : ph > 0.45 && ph < 0.5 ? 0.6 : ph > 0.5 && ph < 0.55 ? -0.2 : 0; }
    pts.push(`${px.toFixed(1)} ${(y + h / 2 + v * h * 0.38).toFixed(1)}`);
  }
  const col = flat ? '#ff4d6d' : '#3dff8f';
  return `<rect x="${x - 16}" y="${y - 16}" width="${w + 32}" height="${h + 32}" rx="18" fill="#10202c" stroke="#9fb3c8" stroke-width="5"/>
    <g stroke="#1d3a4c" stroke-width="1">${[1, 2, 3].map(i => `<line x1="${x}" x2="${x + w}" y1="${y + i * h / 4}" y2="${y + i * h / 4}"/>`).join('')}</g>
    <polyline points="${pts.join(' ')}" fill="none" stroke="${col}" stroke-width="5" stroke-linejoin="round"/>
    ${label(x + 10, y + 26, flat ? 'MAIN HEART: PAUSED' : 'MAIN HEART', { size: 20, anchor: 'start', fill: col, sw: 0 })}`;
}

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t);
  const cB = 2.6, cC = 10.7, cD = 17.6, cE = 23.4;
  let s = '';
  if (t < cB) {
    s += sea(t) + couch();
    s += g('translate(175 500) scale(0.95)', octavia(t, { m, blink: bl, forehead: true, heartGlow: 0.8 }));
    s += g('translate(468 404) scale(0.75)', crab(t, {}));
    s += label(400, 240 + Math.sin(t * 3) * 6, 'SIGH...', { size: 34, fill: '#ffd1f0', rot: 8 });
  } else if (t < cC) {
    const a = T(1), len = Tend(1) - a, br = t > a + len * 0.8;
    s += sea(t, 1);
    const k = easeOut(prog(t, cB, cB + 0.5));
    s += g(`translate(270 ${600 - 30 * k}) scale(${1.4 + 0.2 * k})`, octavia(t, { m, blink: bl, heartScale: 1.5, heartGlow: 1, broken: br, tears: br, pose: 'lie' }));
    s += card(t, a + 0.3, 270, 150, label(0, 16, 'x3 HEARTS', { size: 40, fill: '#ff3d6e', sw: 0 }), 260, 70);
    s += card(t, a + len * 0.28, 90, 470, label(0, 10, 'GILLS', { size: 24, fill: '#1f8fb8', sw: 0 }), 110, 46);
    s += card(t, a + len * 0.36, 450, 470, label(0, 10, 'GILLS', { size: 24, fill: '#1f8fb8', sw: 0 }), 110, 46);
    s += card(t, a + len * 0.5, 270, 548, label(0, 10, 'BODY', { size: 24, fill: '#c2185b', sw: 0 }), 110, 46);
    if (br) { s += g(`translate(440 260) scale(${pop(t, a + len * 0.8)}) rotate(10)`, emoji(0, 0, '💔', 70) + label(0, 70, 'TRIPLE TRAGEDY', { size: 24, fill: '#ffd21f' })); }
  } else if (t < cD) {
    const a = T(2), len = Tend(2) - a;
    s += sea(t, 1);
    const blue = easeInOut(prog(t, a + 1.0, a + 2.4));
    const col = `rgb(${Math.round(lerp(226, 40, blue))},${Math.round(lerp(40, 120, blue))},${Math.round(lerp(60, 255, blue))})`;
    const dk = pop(t, cC);
    s += g(`translate(395 300) scale(${dk})`, `<path d="M0 -120 C40 -50 80 -10 80 40 C80 90 44 120 0 120 C-44 120 -80 90 -80 40 C-80 -10 -40 -50 0 -120Z" fill="${col}" stroke="#0b1a33" stroke-width="6"/>
      <ellipse cx="-30" cy="20" rx="14" ry="28" fill="#fff" opacity=".45"/>` + label(0, 60, 'BLOOD', { size: 26, fill: '#fff', sw: 6 }));
    s += card(t, a + len * 0.45, 315, 495, label(0, -2, 'Cu', { size: 46, fill: '#d9772b', sw: 0 }) + label(0, 34, 'COPPER', { size: 18, fill: '#555', sw: 0 }) + (t > a + len * 0.45 + 0.3 ? tick(52, -44, 0.6) : ''), 140, 120, '#fff2e0');
    s += card(t, a + len * 0.58, 465, 495, label(0, -2, 'Fe', { size: 46, fill: '#777', sw: 0 }) + label(0, 34, 'IRON', { size: 18, fill: '#555', sw: 0 }) + (t > a + len * 0.58 + 0.3 ? cross(52, -44, 0.6) : ''), 140, 120);
    const fancy = t > a + len * 0.78;
    s += g('translate(140 590) scale(0.85)', octavia(t, { m, blink: bl, tears: fancy, heartGlow: 0.4 }));
    if (fancy) { s += sparkles(t, 140, 400, 120, 9, '#7fe0ff', 4); s += label(140, 190, 'FANCY', { size: 50 * pop(t, a + len * 0.78), fill: '#7fe0ff', rot: -8 }); }
  } else if (t < cE) {
    const a = T(3), len = Tend(3) - a, stop = a + len * 0.22, tired = prog(t, a + len * 0.55, a + len * 0.75);
    s += sea(t);
    s += ecg(t, 60, 130, 420, 120, stop);
    const sx = lerp(-60, 300, easeOut(prog(t, cD, a + len * 0.55))), sy = lerp(560, 420, easeOut(prog(t, cD, a + len * 0.55))) + tired * 120;
    const rot = lerp(35, 0, prog(t, cD, a + len * 0.5)) + tired * 25;
    s += g(`translate(${sx} ${sy}) rotate(${rot}) scale(0.85)`, octavia(t, { m, blink: tired > 0.5 ? 0.6 : bl, pose: tired > 0.3 ? 'lie' : 'swim', stopMain: t > stop, heartGlow: 0.7, sad: 1 }));
    if (t < a + len * 0.55) for (let i = 0; i < 4; i++) s += `<path d="M${sx - 80 - i * 30} ${sy + 60 + i * 12} h-40" stroke="#bff3ff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
    if (tired > 0.4) s += emoji(sx + 120, sy - 260, '😮‍💨', 64 * pop(t, a + len * 0.65)) + `<path d="M${sx + 80} ${sy - 210} q-8 16 0 24 q8 -8 0 -24Z" fill="#7fe0ff"/>`;
  } else {
    s += sea(t) + couch();
    const cx = lerp(640, 420, easeOut(prog(t, cE, cE + 1.2))), reach = t > cE + 1.3;
    const took = t > cE + 2.2;
    s += g('translate(175 500) scale(0.95)', octavia(t, { m, blink: bl, forehead: !took, heartGlow: 0.8, sad: took ? 0.3 : 1 }));
    if (took) s += `<path d="M${120} ${330 + Math.sin(t * 4) * 6} C100 300 140 280 150 310 C170 290 180 330 160 340Z" fill="#fff" stroke="#9aa" stroke-width="3"/>`;
    s += g(`translate(${cx} 476) scale(0.75)`, crab(t, { walking: t < cE + 1.2, reach }));
    if (t > 26.2) s += g(`translate(270 175) scale(${pop(t, 26.2, 0.4)}) rotate(-5)`,
      `<rect x="-215" y="-48" width="430" height="96" rx="18" fill="#c26ae6" stroke="#1b1b2f" stroke-width="6"/>` + label(0, 18, 'DRAMA = BIOLOGY', { size: 44, sw: 9 }));
    s += endCard(t, 27.6);
  }
  s += flash(t, [cB, cC, cD, cE]);
  return s;
};
