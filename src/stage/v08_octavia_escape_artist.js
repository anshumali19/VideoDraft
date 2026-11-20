// Video 8: Octavia the Escape Artist
window.META = { name: 'OCTAVIA', color: '#c26ae6' };

const GAP_X = 395;
function tankRoom(t, inner = '') {
  return `<rect width="${W}" height="${H}" fill="#24345c"/>
  <rect y="560" width="${W}" height="${H - 560}" fill="#3a2f4a"/>
  <rect x="60" y="560" width="420" height="40" fill="#5a4636" stroke="#1b1b2f" stroke-width="4"/>
  <defs><clipPath id="tankclip"><rect x="70" y="225" width="400" height="335"/></clipPath></defs>
  <rect x="70" y="225" width="400" height="335" fill="#5fc3e8" opacity=".85"/>
  <path d="M70 540 Q200 520 470 545 V560 H70Z" fill="#e8c98a"/>
  <g clip-path="url(#tankclip)">${inner}</g>
  <rect x="70" y="225" width="400" height="335" fill="none" stroke="#d6f3ff" stroke-width="8"/>
  <path d="M100 260 l40 -20 M100 290 l70 -36" stroke="#fff" stroke-width="6" opacity=".5" stroke-linecap="round"/>
  <rect x="60" y="205" width="${GAP_X - 12 - 60}" height="22" fill="#4b5563" stroke="#1b1b2f" stroke-width="4"/>
  <rect x="${GAP_X + 12}" y="205" width="${480 - GAP_X - 12}" height="22" fill="#4b5563" stroke="#1b1b2f" stroke-width="4"/>`;
}
const XRAY = `<filter id="xray"><feColorMatrix type="matrix" values="0.05 0.05 0.05 0 0  0.25 0.25 0.25 0 0.25  0.35 0.35 0.35 0 0.45  0 0 0 1 0"/></filter>`;

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t);
  const c1 = T(1) - 0.3, c2 = T(2) - 0.3, c3 = T(3) - 0.3, c4 = T(4) - 0.3;
  let s = '';
  if (t < c1) {
    const peek = easeOut(prog(t, 0.2, 1.2));
    s += tankRoom(t, g(`translate(200 ${560 - 40 * peek}) scale(0.75)`, octavia(t, { m, blink: bl, pose: 'stand', sad: 0, heartGlow: 0.3 })) +
      g(`translate(${380 + Math.sin(t) * 20} 470) scale(0.7)`, fish(t, { color: '#ffb03b', guard: true })));
    s += label(270, 150, 'ADORABLE.', { size: 56 * pop(t, T(0) + 1.2), fill: '#ff8fc7', rot: -6 });
  } else if (t < c2) {
    const a = T(1), len = Tend(1) - a;
    s += `<defs>${XRAY}</defs><rect width="${W}" height="${H}" fill="#0b1626"/>` +
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<path d="M0 ${i * 70 + 100} H${W}" stroke="#13304a" stroke-width="2"/>`).join('');
    s += `<g filter="url(#xray)">${g('translate(270 560) scale(1.15)', octavia(t, { m, blink: bl, pose: 'stand', sad: 0, hearts: false }))}</g>`;
    s += g('translate(270 445)', `<path d="M-14 -8 L14 -8 L0 18Z" fill="#fff" stroke="#ffd21f" stroke-width="4"/><circle r="${30 + 4 * Math.sin(t * 6)}" fill="none" stroke="#ffd21f" stroke-width="5"/>`);
    s += card(t, a + 0.1, 270, 150, label(0, 14, 'BONES: 0', { size: 42, fill: '#1f8fb8', sw: 0 }), 260, 70);
    if (t > a + len * 0.25) s += card(t, a + len * 0.25, 420, 360, label(0, 10, 'BEAK', { size: 30, fill: '#c2185b', sw: 0 }), 120, 56);
    if (t > a + len * 0.55) s += banner(t, a + len * 0.55, 'IF IT FITS, I FIT', '#c26ae6', 250, 400, 40);
  } else if (t < c3) {
    const a = T(2), len = Tend(2) - a, k = prog(t, c2 + 0.3, c3 - 0.6);
    // squeeze up through the gap in the lid
    const y = lerp(470, 245, easeInOut(k)), squeeze = Math.max(0.4, 1 - Math.abs(y - 260) / 260 * 1.5);
    s += tankRoom(t, '');
    s += g(`translate(${GAP_X} ${y}) scale(${squeeze * 0.48} ${0.48 * (1 + (1 - squeeze) * 0.8)})`, octavia(t, { m, blink: bl, pose: 'swim', sad: 0 }));
    s += card(t, a + 0.2, 180, 320, emoji(-56, 0, '🚪', 40) + label(20, 12, 'CRACK', { size: 26, fill: '#1b1b2f', sw: 0 }), 200, 70);
    s += card(t, a + len * 0.55, 180, 420, emoji(-62, 0, '🛣️', 40) + label(20, 12, 'PIPE', { size: 26, fill: '#1b1b2f', sw: 0 }), 200, 70);
  } else if (t < c4) {
    const a = T(3), len = Tend(3) - a, k = easeInOut(prog(t, a + len * 0.35, a + len * 0.8));
    s += `<rect width="${W}" height="${H}" fill="#24345c"/><rect y="280" width="${W}" height="${H - 400}" fill="#3a2f4a"/>`;
    s += `<path d="M120 300 V440 Q120 480 160 480 H${W + 20}" stroke="#7a8794" stroke-width="56" fill="none"/>
      <path d="M120 300 V440 Q120 480 160 480 H${W + 20}" stroke="#5a6774" stroke-width="40" fill="none"/>
      <rect x="80" y="284" width="80" height="18" rx="4" fill="#9aa6b2" stroke="#1b1b2f" stroke-width="3"/>
      <rect x="430" y="520" width="120" height="${H}" fill="#2a8fd0"/>${label(480, 560, 'SEA', { size: 26 })}`;
    // path: drop down the drain, then slide along the pipe to the sea
    const px = k < 0.4 ? 120 : lerp(120, 520, (k - 0.4) / 0.6), py = k < 0.4 ? lerp(240, 470, k / 0.4) : 480;
    s += g(`translate(${px} ${py}) rotate(${k < 0.4 ? 0 : -90}) scale(0.35 0.22)`, octavia(t, { m, blink: bl, pose: 'swim', sad: 0 }));
    s += card(t, a + 0.2, 300, 160, label(0, -4, 'INKY', { size: 46, fill: '#c26ae6', sw: 0 }) + label(0, 34, 'NEW ZEALAND · 2016', { size: 20, fill: '#555', sw: 0 }), 330, 110, '#fff');
    if (t > a + len * 0.85) {
      s += g(`translate(400 330) scale(0.9)`, fish(t, { color: '#ffb03b', guard: true, whistle: true }));
      s += label(400, 260, 'TWEET?!', { size: 36 * pop(t, a + len * 0.85), fill: '#ffd21f', rot: 8 });
    }
  } else {
    s += `<rect width="${W}" height="${H}" fill="#ffb27a"/><circle cx="270" cy="380" r="90" fill="#ffe08a"/>
      <rect y="420" width="${W}" height="${H - 420}" fill="#2a8fd0"/>` + [0, 1, 2, 3].map(i => `<path d="M${-40 + ((t * 30 + i * 150) % 640)} ${470 + i * 30} q20 -10 40 0" stroke="#bfe8ff" stroke-width="5" fill="none"/>`).join('');
    const wave = tentacle(60, -150, -70 + Math.sin(t * 6) * 25, 130, 30, t, 0, { amp: 0.1, curl: 1.4, fill: '#b05bd6' });
    s += g(`translate(250 ${560 + Math.sin(t * 2) * 6}) scale(0.9)`, wave + octavia(t, { m, blink: bl, pose: 'swim', sad: 0 }));
    s += banner(t, c4 + 0.4, 'BYE, HUMANS!', '#c26ae6', 175, 360);
    s += emoji(430, 300, '🦐', 50 * pop(t, T(4) + 1.3));
    s += endCard(t, 28.4);
  }
  s += flash(t, [c1, c2, c3, c4]);
  return s;
};
