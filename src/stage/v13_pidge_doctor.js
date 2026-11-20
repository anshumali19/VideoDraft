// Video 13: Pidge, Doctor of Medicine
window.META = { name: 'PIDGE', color: '#7d5bd6' };

const coat = `<path d="M-60 -112 C-70 -60 -66 -20 -50 -6 L50 -6 C66 -20 70 -60 60 -112 L24 -112 L0 -60 L-24 -112Z" fill="#fff" stroke="#2b2f3d" stroke-width="4"/>
  <path d="M-24 -112 L-6 -70 M24 -112 L6 -70" stroke="#2b2f3d" stroke-width="3"/><rect x="20" y="-60" width="22" height="14" rx="3" fill="#e8f2ff" stroke="#2b2f3d" stroke-width="2"/>
  <path d="M-40 -84 q-4 30 10 40 q14 6 18 -8" stroke="#3b3f4a" stroke-width="4" fill="none"/><circle cx="-12" cy="-52" r="7" fill="#c0c0c0" stroke="#2b2f3d" stroke-width="2"/>`;
const specs = `<g fill="none" stroke="#1b1b2f" stroke-width="4"><circle cx="-18" cy="-172" r="18"/><circle cx="18" cy="-172" r="18"/><path d="M0 -172 h0"/></g>`;
function clinic() {
  return `<rect width="${W}" height="${H}" fill="#dff3ee"/><rect y="0" width="${W}" height="120" fill="#cbeae2"/>
    <rect y="560" width="${W}" height="${H - 560}" fill="#a9c7d8"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M0 ${580 + i * 60} H${W}" stroke="#98b6c7" stroke-width="3"/>`).join('')}
    <g transform="translate(70 180)"><rect x="-30" y="-30" width="60" height="60" rx="8" fill="#fff" stroke="#1b1b2f" stroke-width="3"/><path d="M-6 -18 h12 v12 h12 v12 h-12 v12 h-12 v-12 h-12 v-12 h12Z" fill="#ff3b3b"/></g>`;
}
function xray(x, y, w, h, spot = 0) {
  return `<rect x="${x - 10}" y="${y - 10}" width="${w + 20}" height="${h + 20}" rx="12" fill="#3b3f4a" stroke="#1b1b2f" stroke-width="5"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0b1626"/>
    <ellipse cx="${x + w * 0.32}" cy="${y + h * 0.52}" rx="${w * 0.2}" ry="${h * 0.38}" fill="#6f8aa3" opacity=".7"/>
    <ellipse cx="${x + w * 0.68}" cy="${y + h * 0.52}" rx="${w * 0.2}" ry="${h * 0.38}" fill="#6f8aa3" opacity=".7"/>
    <path d="M${x + w / 2} ${y + 10} V${y + h - 10}" stroke="#c9d6e2" stroke-width="${w * 0.04}"/>
    ${[0, 1, 2, 3, 4].map(i => `<path d="M${x + w * 0.14} ${y + h * (0.25 + i * 0.13)} Q${x + w / 2} ${y + h * (0.18 + i * 0.13)} ${x + w * 0.86} ${y + h * (0.25 + i * 0.13)}" stroke="#c9d6e2" stroke-width="${w * 0.018}" fill="none" opacity=".8"/>`).join('')}
    <circle cx="${x + w * 0.7}" cy="${y + h * 0.42}" r="${w * 0.035}" fill="#f2f6ff"/>
    ${spot > 0 ? `<circle cx="${x + w * 0.7}" cy="${y + h * 0.42}" r="${w * 0.1 * spot}" fill="none" stroke="#ffd21f" stroke-width="6"/>` : ''}`;
}

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t);
  const c1 = T(1) - 0.3, c2 = T(2) - 0.3, c3 = T(3) - 0.3, c4 = T(4) - 0.3;
  let s = '';
  const doc = (o = {}) => pidge(Object.assign({ m, blink: bl, outfit: coat, face: specs, brow: 0.5 }, o));
  if (t < c1) {
    s += clinic() + xray(250, 150, 240, 190);
    s += g('translate(420 500) scale(0.75)', person(t, { coat: true, glasses: true, expr: 'nervous', sweat: true, shirt: '#7fb7a3' }));
    s += `<rect x="70" y="540" width="200" height="22" fill="#8a5a2e"/><path d="M100 562 v40 M240 562 v40" stroke="#8a5a2e" stroke-width="10"/>`;
    s += g('translate(170 545) scale(1.05)', doc({ wing: 'cross' }));
    s += card(t, 0.4, 170, 130, label(0, 12, 'DR. PIDGE', { size: 36, fill: '#7d5bd6', sw: 0 }), 230, 62);
  } else if (t < c2) {
    const a = T(1), len = Tend(1) - a;
    s += clinic() + xray(60, 120, 420, 330, easeOut(prog(t, a + len * 0.45, a + len * 0.6)));
    s += g('translate(110 600) scale(0.9)', doc({ wing: 'point', pointAng: -40 }));
    s += `<path d="M250 470 L335 275" stroke="#8a5a2e" stroke-width="6" stroke-linecap="round" opacity="${t > a + len * 0.3 ? 1 : 0}"/>`;
    if (t > a + len * 0.62) s += card(t, a + len * 0.62, 390, 510, label(-14, 10, 'SPOTTED IT', { size: 24, fill: '#1b1b2f', sw: 0 }) + tick(80, 0, 0.5), 230, 56, '#eaffd9');
  } else if (t < c3) {
    const a = T(2), len = Tend(2) - a;
    s += clinic();
    s += card(t, a + 0.1, 120, 230, emoji(0, -6, '🙂', 64) + tick(40, 50, 0.55), 140, 150);
    s += card(t, a + 0.5, 270, 230, emoji(0, -6, '🧔', 64) + tick(40, 50, 0.55), 140, 150);
    s += card(t, a + 0.9, 420, 230, emoji(0, -6, '👩', 64) + tick(40, 50, 0.55), 140, 150);
    ['A', 'B', 'C'].forEach((L, i) => s += card(t, a + len * 0.5 + i * 0.3, 120 + i * 150, 420, label(0, 26, L, { size: 76, fill: ['#ff3b3b', '#2f7de1', '#2fbf4a'][i], sw: 0 }), 120, 120, '#fffbe6'));
    s += g('translate(470 600) scale(0.55)', doc({ wing: 'cross' }));
  } else if (t < c4) {
    const a = T(3), len = Tend(3) - a;
    s += burst(t, '#ff6b5a', '#ff8f6b');
    s += g(`translate(${270 + Math.sin(t * 50) * 3} 960) scale(2.5)`, doc({ wing: 'cross', brow: 1.4 }));
    s += label(270, 180, 'BIRD-BRAIN?!', { size: 60 * pop(t, a + 0.3), fill: '#ffd21f', rot: -6 });
    if (t > a + len * 0.55) s += card(t, a + len * 0.55, 270, 300, label(0, -8, 'BETTER EYE THAN', { size: 24, fill: '#1b1b2f', sw: 0 }) + label(0, 26, 'YOUR INTERNS', { size: 30, fill: '#c0392b', sw: 0 }), 300, 100);
  } else {
    const a = T(4), len = Tend(4) - a;
    s += clinic();
    s += g('translate(150 600) scale(1.0)', doc({ wing: 'cross', brow: 0.2 }));
    s += g(`translate(390 360) rotate(4) scale(${pop(t, a + len * 0.5)})`, `<rect x="-120" y="-150" width="240" height="300" fill="#fffdf2" stroke="#1b1b2f" stroke-width="5"/>` +
      label(0, -100, 'INVOICE', { size: 34, fill: '#1b1b2f', sw: 0 }) + `<path d="M-90 -76 h180" stroke="#1b1b2f" stroke-width="3"/>` +
      label(-90, -36, 'CONSULTATION', { size: 18, fill: '#555', sw: 0, anchor: 'start' }) + label(-90, -6, 'X-RAY REVIEW', { size: 18, fill: '#555', sw: 0, anchor: 'start' }) +
      `<path d="M-90 20 h180" stroke="#1b1b2f" stroke-width="3"/>` + label(-90, 60, 'TOTAL:', { size: 22, fill: '#1b1b2f', sw: 0, anchor: 'start' }) + emoji(50, 52, '🍞', 40) + label(90, 64, 'x10', { size: 22, fill: '#c0392b', sw: 0, anchor: 'end' }) +
      `<path d="M-90 100 h180" stroke="#1b1b2f" stroke-width="2" stroke-dasharray="6 6"/>`);
    s += banner(t, a + 0.3, 'CALL ME DOCTOR', '#7d5bd6', 140, 380);
    s += endCard(t, 28.5);
  }
  s += flash(t, [c1, c2, c3, c4]);
  return s;
};
