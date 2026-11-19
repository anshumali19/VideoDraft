// Video 1: Pidge and the Mirror Test
window.META = { name: 'PIDGE', color: '#7d5bd6' };

function rooftop(t, warm = 0) {
  let city = '';
  for (let i = 0; i < 9; i++) {
    const x = i * 64 - 20, h = 150 + rnd(i) * 170, y = 560 - h;
    city += `<rect x="${x}" y="${y}" width="58" height="${h}" fill="${i % 2 ? '#5a6a9a' : '#4b5a88'}"/>`;
    for (let r = 0; r < Math.floor(h / 30) - 1; r++) for (let c = 0; c < 3; c++)
      if (rnd(i * 31 + r * 7 + c) > 0.45) city += `<rect x="${x + 8 + c * 17}" y="${y + 14 + r * 30}" width="9" height="13" fill="#ffd98a" opacity=".85"/>`;
  }
  const clouds = [0, 1, 2].map(i => { const x = ((t * 8 + i * 220) % 700) - 100, y = 150 + i * 70;
    return `<g fill="#fff" opacity=".85"><ellipse cx="${x}" cy="${y}" rx="50" ry="20"/><ellipse cx="${x + 30}" cy="${y - 12}" rx="34" ry="20"/></g>`; }).join('');
  return `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb2ff"/><stop offset="1" stop-color="${warm ? '#ffc58a' : '#bfe4ff'}"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <circle cx="440" cy="190" r="46" fill="#fff3b0" opacity=".9"/>${clouds}${city}
  <rect x="0" y="540" width="${W}" height="${H - 540}" fill="#9d8f84"/>
  <rect x="0" y="540" width="${W}" height="22" fill="#c9b8a8"/>
  <g stroke="#8a7d72" stroke-width="2">${[0, 1, 2, 3, 4].map(i => `<line x1="0" y1="${620 + i * 70}" x2="${W}" y2="${620 + i * 70}"/>`).join('')}</g>
  <g transform="translate(40 330)"><rect x="0" y="40" width="70" height="90" rx="10" fill="#8b5a3c" stroke="#3b2a1a" stroke-width="4"/>
    <path d="M-6 44 L35 0 L76 44Z" fill="#6e4630" stroke="#3b2a1a" stroke-width="4"/>
    <path d="M10 130 L4 212 M60 130 L66 212" stroke="#3b2a1a" stroke-width="6"/></g>`;
}

function mirror(t, x, y, pidgeOpts, s = 1.15) {
  const mw = 150, mh = 300;
  return `<defs><clipPath id="mclip"><rect x="${x - mw / 2}" y="${y - mh}" width="${mw}" height="${mh}" rx="70"/></clipPath>
    <linearGradient id="glass" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#dff4ff"/><stop offset="1" stop-color="#9fc9e8"/></linearGradient></defs>
  <path d="M${x - 40} ${y + 8} L${x - 60} ${y + 40} M${x + 40} ${y + 8} L${x + 60} ${y + 40}" stroke="#6e4630" stroke-width="10" stroke-linecap="round"/>
  <rect x="${x - mw / 2 - 12}" y="${y - mh - 12}" width="${mw + 24}" height="${mh + 24}" rx="80" fill="#c99a3c" stroke="#5a3f12" stroke-width="5"/>
  <rect x="${x - mw / 2}" y="${y - mh}" width="${mw}" height="${mh}" rx="70" fill="url(#glass)"/>
  <g clip-path="url(#mclip)" opacity=".75">${g(`translate(${x} ${y - 12}) scale(${-s * 0.72} ${s * 0.72})`, pidge(pidgeOpts))}</g>
  <path d="M${x - 50} ${y - 250} l40 -30 M${x - 54} ${y - 220} l60 -44" stroke="#fff" stroke-width="7" opacity=".6" stroke-linecap="round"/>`;
}

function monet(x, y, w, h) {
  let dabs = '';
  for (let i = 0; i < 26; i++) {
    const px = x + 12 + rnd(i) * (w - 24), py = y + h * 0.45 + rnd(i + 50) * (h * 0.5);
    dabs += `<ellipse cx="${px}" cy="${py}" rx="${10 + rnd(i + 3) * 10}" ry="${5 + rnd(i + 7) * 4}" fill="${['#5f9e5a', '#7dbb6b', '#3f7f4f'][i % 3]}"/>`;
    if (i % 4 === 0) dabs += `<circle cx="${px}" cy="${py - 3}" r="4" fill="#ff9ec4"/>`;
  }
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#7fb8c9"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h * 0.4}" fill="#9fcfa8"/>
    <path d="M${x + 10} ${y + h * 0.42} Q${x + w / 2} ${y + h * 0.12} ${x + w - 10} ${y + h * 0.42}" stroke="#4f8f6a" stroke-width="9" fill="none"/>
    ${dabs}`;
}
function picasso(x, y, w, h) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#f2c94c"/>
    <path d="M${x} ${y} L${x + w * 0.6} ${y} L${x + w * 0.3} ${y + h} L${x} ${y + h}Z" fill="#2d9cdb"/>
    <path d="M${x + w * 0.25} ${y + h * 0.15} L${x + w * 0.75} ${y + h * 0.2} L${x + w * 0.8} ${y + h * 0.75} L${x + w * 0.3} ${y + h * 0.85}Z" fill="#f2994a" stroke="#222" stroke-width="4"/>
    <path d="M${x + w * 0.5} ${y + h * 0.18} L${x + w * 0.78} ${y + h * 0.5} L${x + w * 0.5} ${y + h * 0.82}Z" fill="#eb5757" stroke="#222" stroke-width="4"/>
    <circle cx="${x + w * 0.38}" cy="${y + h * 0.35}" r="13" fill="#fff" stroke="#222" stroke-width="4"/><circle cx="${x + w * 0.38}" cy="${y + h * 0.35}" r="5" fill="#222"/>
    <path d="M${x + w * 0.58} ${y + h * 0.52} l22 -10 l4 18Z" fill="#fff" stroke="#222" stroke-width="4"/>
    <path d="M${x + w * 0.35} ${y + h * 0.68} q16 10 30 -2" stroke="#222" stroke-width="5" fill="none"/>`;
}
function frame(x, y, w, h, inner) {
  return `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" fill="#b8862e" stroke="#4a3210" stroke-width="5"/>
    <rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" fill="#e2b85c"/>${inner}`;
}

function burst(t, c1, c2) {
  let s = `<rect width="${W}" height="${H}" fill="${c1}"/>`;
  const n = 18, rot = t * 12;
  for (let i = 0; i < n; i += 2) {
    const a1 = (i / n) * 360 + rot, a2 = ((i + 1) / n) * 360 + rot, r = 1100, cx = 270, cy = 380;
    const p = a => `${cx + Math.cos(a * Math.PI / 180) * r} ${cy + Math.sin(a * Math.PI / 180) * r}`;
    s += `<path d="M${cx} ${cy} L${p(a1)} L${p(a2)}Z" fill="${c2}"/>`;
  }
  return s;
}

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t);
  const cA = 3.0, cB = 5.3, cC = 6.05, cD = 12.3, cE = 19.0, cF = 24.0;
  let s = '';

  if (t < cA) { // rooftop, mirror
    const z = 1 + 0.05 * prog(t, 0, cA);
    const look = t < 0.6 ? 1 : 0;
    s += g(`translate(270 600) scale(${z}) translate(-270 -600)`,
      rooftop(t) + mirror(t, 410, 560, { m: 0, blink: bl, wing: 'cross', look: -look }) +
      g('translate(190 575) scale(1.45)', pidge({ m, blink: bl, wing: 'cross', look })));
  } else if (t < cB) { // human laughing
    s += burst(t, '#8fd3ff', '#b7e4ff');
    s += `<rect x="0" y="600" width="${W}" height="${H - 600}" fill="#6ab0e0"/>`;
    s += g('translate(300 470) scale(1.15)', human(t));
    const bk = pop(t, cA + 0.1);
    s += g(`translate(150 190) scale(${bk})`, `<path d="M-120 -50 h240 a20 20 0 0 1 20 20 v60 a20 20 0 0 1 -20 20 h-150 l-20 34 l-6 -34 h-64 a20 20 0 0 1 -20 -20 v-60 a20 20 0 0 1 20 -20Z" fill="#fff" stroke="#1b1b2f" stroke-width="5"/>` +
      label(10, 20, 'BIRD-BRAIN!', { size: 34, fill: '#ff3b3b', sw: 0 }));
    ['HA!', 'HA!', 'HA!'].forEach((h, i) => { const k = pop(t, cA + 0.4 + i * 0.35);
      if (t > cA + 0.4 + i * 0.35) s += label(380 + i * 30, 300 + i * 70 + Math.sin(t * 20 + i) * 6, h, { size: 40 * k, fill: '#ffd21f', rot: 12 }); });
  } else if (t < cC) { // angry close-up
    s += burst(t, '#ff6b5a', '#ff8f6b');
    const sh = Math.sin(t * 60) * 3;
    s += g(`translate(${270 + sh} 900) scale(2.6)`, pidge({ m, blink: 0, wing: 'cross', brow: 1.4 }));
    s += label(430, 230, '?!', { size: 110, fill: '#ffd21f', rot: 10 });
  } else if (t < cD) { // mirror test + cards
    const len = Tend(2) - T(2), a = T(2);
    s += rooftop(t) + mirror(t, 410, 560, { m: 0, blink: bl, wing: 'down', look: -1 }) +
      g('translate(190 575) scale(1.25)', pidge({ m, blink: bl, wing: 'down', look: t < a + len * 0.5 ? 1 : 0, brow: 0.6 }));
    s += card(t, a + 0.8, 270, 262, label(0, 14, 'MIRROR TEST', { size: 26, fill: '#7d5bd6', sw: 0 }), 220, 56);
    s += card(t, a + len * 0.52, 110, 170, emoji(0, -14, '🐶', 58) + (t > a + len * 0.52 + 0.25 ? cross(0, 40, 0.8) : ''), 120, 130);
    s += card(t, a + len * 0.68, 270, 170, emoji(0, -14, '🐱', 58) + (t > a + len * 0.68 + 0.25 ? cross(0, 40, 0.8) : ''), 120, 130);
    s += card(t, a + len * 0.84, 430, 170, emoji(0, -14, '🐦', 58) + (t > a + len * 0.84 + 0.25 ? tick(0, 42, 0.8) : ''), 120, 130, '#fff7c2');
    if (t > a + len * 0.84) s += sparkles(t, 430, 170, 80, 8, '#ffd21f', 2);
  } else if (t < cE) { // gallery
    s += `<rect width="${W}" height="${H}" fill="#f4e6cf"/><rect x="0" y="520" width="${W}" height="${H - 520}" fill="#7b4a2a"/>
      <rect x="0" y="505" width="${W}" height="18" fill="#5a341c"/>
      <path d="M0 160 H${W}" stroke="#e2cfae" stroke-width="6"/>`;
    s += frame(42, 220, 190, 230, monet(42, 220, 190, 230)) + frame(308, 220, 190, 230, picasso(308, 220, 190, 230));
    s += `<path d="M137 120 L137 206 M403 120 L403 206" stroke="#999" stroke-width="2"/>`;
    const a = T(3), len = Tend(3) - a;
    s += card(t, a + len * 0.6, 137, 150, label(0, 12, 'MONET', { size: 28, fill: '#2d6a8a', sw: 0 }), 150, 54);
    s += card(t, a + len * 0.85, 403, 150, label(0, 12, 'PICASSO', { size: 28, fill: '#c0392b', sw: 0 }), 170, 54);
    const pointRight = t > a + len * 0.82;
    s += g(`translate(270 600) scale(${pointRight ? 1.2 : -1.2} 1.2)`, pidge({ m, blink: bl, wing: 'point', brow: 0.3, pointAng: -40 }));
    if (t > a + len * 0.6 + 0.3) s += tick(210, 300, 1.1);
    if (t > a + len * 0.85 + 0.3) s += tick(476, 300, 1.1);
  } else if (t < cF) { // "Can YOU do that?"
    s += burst(t, '#ffd21f', '#ffe36b');
    const smug = t > T(4) + 0.95;
    const k = easeOut(prog(t, cE, cE + 0.4));
    s += g(`translate(270 ${980 - 60 * k}) scale(${2.2 + 0.3 * k})`, pidge({ m, blink: smug ? 0.55 : bl, wing: 'cross', brow: smug ? 0.2 : 0.5, browUp: smug ? 0 : 12, look: 0 }));
    s += label(445, 250 + Math.sin(t * 4) * 8, '?', { size: 140, fill: '#7d5bd6', rot: 14 });
    if (smug) s += label(110, 230, 'EXACTLY.', { size: 46 * pop(t, T(4) + 0.95), fill: '#fff', rot: -10 });
  } else { // graduation cap
    s += rooftop(t, 1);
    const hold = prog(t, cF + 0.3, cF + 1.0), place = easeInOut(prog(t, cF + 1.5, cF + 2.3));
    const wing = place > 0 && place < 1 ? 'hold' : place >= 1 ? 'cross' : (hold > 0 ? 'hold' : 'down');
    const capX = lerp(104, 0, place), capY = lerp(-214, -212, place) - Math.sin(place * Math.PI) * 60, capS = lerp(0.55, 0.8, place);
    s += g('translate(270 590) scale(1.5)', pidge({ m, blink: bl, wing, brow: lerp(0.8, 0.1, place), cap: hold > 0 ? 1 : 0, capX, capY, capS, capRot: lerp(20, -8, place) }));
    if (place >= 1) s += sparkles(t, 270, 270, 120, 10, '#ffd21f', 3);
    if (t > cF + 2.6) s += g(`translate(270 175) scale(${pop(t, cF + 2.6, 0.4)}) rotate(-6)`,
      `<rect x="-215" y="-48" width="430" height="96" rx="18" fill="#ff7a1a" stroke="#1b1b2f" stroke-width="6"/>` + label(0, 18, 'FEATHERED GENIUS', { size: 44, sw: 9 }));
    if (t > 28.9) s += g(`translate(270 860) scale(${pop(t, 28.9, 0.3)})`,
      `<rect x="-200" y="-36" width="400" height="72" rx="36" fill="#ff2d55" stroke="#1b1b2f" stroke-width="5"/>` + label(0, 14, 'FOLLOW FOR MORE!', { size: 34, sw: 7 }));
  }
  s += flash(t, [cA, cB, cC, cD, cE, cF]);
  return s;
};
