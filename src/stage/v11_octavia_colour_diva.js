// Video 11: Octavia the Colour-Changing Diva
window.META = { name: 'OCTAVIA', color: '#c26ae6' };

function spots(colors, n = 18, seed = 1, rmax = 16) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = -70 + rnd(i + seed) * 140, y = -240 + rnd(i * 2 + seed) * 170;
    if (Math.abs(x) < 70 && y > -200 && y < -110 && Math.abs(x) > 8 && Math.abs(Math.abs(x) - 34) < 30) continue; // keep eyes clear
    s += `<circle cx="${x}" cy="${y}" r="${4 + rnd(i + 7) * rmax}" fill="${colors[i % colors.length]}" opacity=".8"/>`;
  }
  return s;
}
const LOOKS = {
  purple: { skin: '#c26ae6', skinD: '#8f3fb8', texture: '' },
  orange: { skin: '#ff9a3c', skinD: '#d9772b', texture: spots(['#ffc27a'], 10, 3, 10) },
  red: { skin: '#ef4a5a', skinD: '#b3261e', texture: spots(['#ff8a95'], 12, 5, 8) },
  teal: { skin: '#2ec4b6', skinD: '#1a8f85', texture: spots(['#7fe8de'], 12, 9, 8) },
  rock: { skin: '#8d8f98', skinD: '#6b6e78', texture: spots(['#6b6e78', '#a9abb3', '#5c5f69'], 22, 11, 16) },
  weed: { skin: '#4fa84a', skinD: '#357a32', texture: spots(['#2f7d2c', '#7ccf6a'], 20, 13, 12) },
  sand: { skin: '#e3c48a', skinD: '#c7a66a', texture: spots(['#c7a66a', '#f2dcae', '#b8975a'], 26, 17, 6) },
};
function reef(t, kind = 'reef') {
  let s = `<rect width="${W}" height="${H}" fill="#1f8fb8"/><rect y="0" width="${W}" height="200" fill="#46b3d6" opacity=".5"/>
    <path d="M0 600 Q135 570 270 590 T540 585 V${H} H0Z" fill="#e3c48a"/>`;
  if (kind === 'rock' || kind === 'reef') s += `<path d="M300 600 C280 420 360 330 460 340 C560 350 560 520 540 600Z" fill="#8d8f98" stroke="#4b4e58" stroke-width="5"/>` + spots(['#6b6e78', '#a9abb3'], 14, 21, 14).replace(/cx="(-?[\d.]+)" cy="(-?[\d.]+)"/g, (_, x, y) => `cx="${+x + 450}" cy="${+y + 660}"`);
  if (kind === 'weed') for (let i = 0; i < 9; i++) s += tentacle(30 + i * 60, 620, -90 + (i - 4) * 3, 380 + rnd(i) * 120, 26, t, i, { fill: '#4fa84a', amp: 0.4, speed: 1.4 }).replace(/<circle[^>]*>/g, '').replace(/#3a1850/g, '#2b6b2a');
  if (kind === 'sand') s += `<rect y="380" width="${W}" height="${H - 380}" fill="#e3c48a"/>` + spots(['#c7a66a', '#f2dcae'], 40, 31, 6).replace(/cx="(-?[\d.]+)" cy="(-?[\d.]+)"/g, (_, x, y) => `cx="${(+x + 70) * 3.8}" cy="${(+y + 240) * 2 + 380}"`);
  if (kind === 'reef') s += `<path d="M40 600 q-10 -80 20 -120 q10 40 -4 120Z M80 600 q10 -60 40 -80 q-10 40 -30 80Z" fill="#ff7aa2"/>`;
  return s;
}

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t);
  const c1 = T(1) - 0.3, c2 = T(2) - 0.3, c3 = T(3) - 0.3, c4 = T(4) - 0.3;
  let s = '';
  const octo = (look, x = 230, y = 555, sc = 0.95, extra = {}) =>
    g(`translate(${x} ${y}) scale(${sc})`, octavia(t, Object.assign({ m, blink: bl, pose: 'stand', sad: 0, heartGlow: 0.3 }, LOOKS[look], extra)));
  if (t < c1) {
    s += reef(t) + octo('purple');
    s += g(`translate(${90 + Math.sin(t) * 10} 300) scale(0.5) scale(-1 1)`, fish(t, { color: '#ffd21f' }));
    s += label(270, 170, 'WATCH THIS.', { size: 54 * pop(t, 0.3), fill: '#ff8fc7', rot: -6 });
  } else if (t < c2) {
    const a = T(1), seq = ['purple', 'orange', 'red', 'teal', 'rock', 'orange', 'purple'];
    const look = seq[Math.floor((t - c1) / 0.45) % seq.length];
    s += reef(t) + octo(look);
    s += sparkles(t, 230, 420, 150, 8, '#fff', 5);
    s += card(t, a + 0.3, 400, 170, emoji(0, -20, '⏱️', 44) + label(0, 40, '< 1 SEC', { size: 32, fill: '#c2185b', sw: 0 }), 170, 130);
  } else if (t < c3) {
    const a = T(2), len = (Tend(2) - a), part = t < a + len * 0.36 ? 0 : t < a + len * 0.72 ? 1 : 2;
    const kind = ['rock', 'weed', 'sand'][part], txt = ['ROCK', 'SEAWEED', 'SAND'][part];
    s += reef(t, kind) + octo(kind, 230, 555, 0.95, { sad: 0 });
    const at = [a, a + len * 0.36, a + len * 0.72][part];
    s += card(t, at + 0.1, 270, 170, label(-20, 14, txt, { size: 38, fill: '#1b1b2f', sw: 0 }) + tick(txt.length * 13 + 10, 2, 0.6), 300, 72);
  } else if (t < c4) {
    const a = T(3), len = Tend(3) - a;
    s += `<defs><filter id="grey"><feColorMatrix type="saturate" values="0"/></filter></defs>`;
    s += `<g filter="url(#grey)">${reef(t) + octo('orange')}</g>`;
    s += card(t, a + 0.3, 270, 160, label(0, 12, 'PLOT TWIST', { size: 40, fill: '#c2185b', sw: 0 }), 300, 68);
    if (t > a + len * 0.45) s += card(t, a + len * 0.45, 400, 330, emoji(0, -10, '👁️', 54) + label(0, 44, 'NO COLOUR', { size: 20, fill: '#1b1b2f', sw: 0 }) + cross(44, -40, 0.5), 160, 130);
  } else {
    const a = T(4), len = Tend(4) - a, bow = t > a + len * 0.6 ? Math.sin(prog(t, a + len * 0.6, a + len * 0.6 + 1.2) * Math.PI) : 0;
    s += `<rect width="${W}" height="${H}" fill="#2a1240"/><path d="M200 0 L340 0 L460 600 L80 600Z" fill="#fff6c2" opacity=".18"/>
      <rect y="560" width="${W}" height="${H - 560}" fill="#6b1d4a"/><path d="M0 0 h80 v300 q-40 -40 -80 0Z M540 0 h-80 v300 q40 -40 80 0Z" fill="#b02a63"/>`;
    s += g(`translate(270 590) rotate(${bow * 18}) translate(-270 -590)`, octo(['purple', 'orange', 'teal'][Math.floor(t * 1.5) % 3], 270, 590, 0.95, { sad: 0 }));
    s += g('translate(90 470) scale(0.6) scale(-1 1)', fish(t, { color: '#ffd21f', clap: true })) + g('translate(460 450) scale(0.5)', fish(t + 0.3, { color: '#7fe0ff', clap: true }));
    s += banner(t, a + len * 0.4, 'PURE TALENT', '#c26ae6', 175, 360);
    if (t > a + len * 0.75) s += emoji(450, 330, '👏', 56 * pop(t, a + len * 0.75)) + emoji(90, 330, '👏', 56 * pop(t, a + len * 0.8));
    s += endCard(t, 28.2);
  }
  s += flash(t, [c1, c2, c3, c4]);
  return s;
};
