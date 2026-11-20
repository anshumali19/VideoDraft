// Video 5: Octavia's Eight Arms, Zero Patience
window.META = { name: 'OCTAVIA', color: '#c26ae6' };

function office() {
  return `<rect width="${W}" height="${H}" fill="#cfe6f2"/>
  <rect x="300" y="110" width="200" height="150" rx="10" fill="#7fc8ff" stroke="#fff" stroke-width="10"/>
  <path d="M400 110 V260 M300 185 H500" stroke="#fff" stroke-width="6"/>
  <rect x="40" y="130" width="120" height="90" fill="#fff" stroke="#9aa" stroke-width="4"/>
  <path d="M55 200 l25 -30 l20 18 l20 -36 l25 48" stroke="#2fbf4a" stroke-width="5" fill="none"/>
  <rect y="560" width="${W}" height="${H - 560}" fill="#8aa1b1"/>`;
}
const desk = () => `<rect x="20" y="470" width="500" height="26" rx="6" fill="#a8743f" stroke="#1b1b2f" stroke-width="5"/>
  <rect x="40" y="496" width="460" height="90" fill="#8a5a2e" stroke="#1b1b2f" stroke-width="5"/>`;
const PROPS = {
  laptop: `<rect x="-34" y="-28" width="68" height="44" rx="5" fill="#3b3f4a" stroke="#1b1b2f" stroke-width="3"/><rect x="-28" y="-22" width="56" height="32" fill="#9fd8ff"/><rect x="-42" y="16" width="84" height="10" rx="3" fill="#6b7280"/>`,
  tea: `<path d="M-20 -14 h40 l-6 30 h-28Z" fill="#fff" stroke="#1b1b2f" stroke-width="3"/><path d="M20 -6 q14 2 6 14" stroke="#1b1b2f" stroke-width="3" fill="none"/><rect x="-16" y="-12" width="32" height="6" fill="#c8843a"/>`,
  polish: `<rect x="-10" y="-30" width="20" height="18" rx="3" fill="#1b1b2f"/><rect x="-14" y="-12" width="28" height="30" rx="8" fill="#ff3d7f" stroke="#1b1b2f" stroke-width="3"/>`,
  phone: `<path d="M-26 -10 q-6 -20 12 -20 l6 12 l-10 6 q6 14 20 20 l6 -10 l12 6 q0 18 -20 12 q-28 -8 -26 -26Z" fill="#ff7a1a" stroke="#1b1b2f" stroke-width="3"/>`,
  coffee: `<rect x="-16" y="-20" width="32" height="38" rx="5" fill="#2f7de1" stroke="#1b1b2f" stroke-width="3"/><path d="M16 -10 q14 0 12 12 q-2 8 -12 8" stroke="#1b1b2f" stroke-width="3" fill="none"/>`,
  papers: `<rect x="-24" y="-30" width="48" height="60" fill="#fff" stroke="#1b1b2f" stroke-width="3" transform="rotate(-8)"/><rect x="-24" y="-30" width="48" height="60" fill="#fff" stroke="#1b1b2f" stroke-width="3"/><path d="M-14 -16 h28 M-14 -4 h28 M-14 8 h20" stroke="#9aa" stroke-width="3"/>`,
  pen: `<rect x="-5" y="-34" width="10" height="56" rx="3" fill="#ffd21f" stroke="#1b1b2f" stroke-width="3"/><path d="M-5 22 l5 12 l5 -12Z" fill="#1b1b2f"/>`,
  stamp: `<rect x="-20" y="0" width="40" height="14" rx="3" fill="#ff3b3b" stroke="#1b1b2f" stroke-width="3"/><rect x="-6" y="-26" width="12" height="26" fill="#8a5a2e" stroke="#1b1b2f" stroke-width="3"/><circle cx="0" cy="-30" r="10" fill="#8a5a2e" stroke="#1b1b2f" stroke-width="3"/>`,
};
// [base x, angle, length, prop, curl]
const ARMS = [[-50, 185, 190, 'laptop', 0.3], [-45, 212, 180, 'papers', -0.3], [-35, 240, 170, 'tea', -0.5], [-20, 160, 200, 'pen', 0.4],
  [20, 20, 200, 'stamp', -0.4], [35, -60, 170, 'phone', 0.5], [45, -32, 180, 'polish', 0.3], [50, -5, 190, 'coffee', -0.3]];

function eightArms(t, speed = 2.2, amp = 0.35, hi = -1) {
  let tents = '', props = '';
  ARMS.forEach(([bx, ang, len, prop, curl], i) => {
    tents += tentacle(bx, -40, ang, len, 30, t, i * 1.7, { curl, amp, speed: speed + i * 0.3, fill: '#b05bd6' });
    const [x, y] = window._tip;
    props += g(`translate(${x} ${y}) rotate(${Math.sin(t * speed + i) * 10})`, (i === hi ? `<circle r="44" fill="#ffd21f" opacity=".55"/>` : '') + PROPS[prop]);
  });
  return [tents, props];
}

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t);
  const c1 = T(1) - 0.3, c2 = T(2) - 0.3, c3 = T(3) - 0.3, c4 = T(4) - 0.3;
  let s = '';
  if (t < c1) {
    s += office();
    const [tents, props] = eightArms(t);
    s += g('translate(270 450) scale(0.9)', octavia(t, { m, blink: bl, pose: 'custom', tents, sad: 0.4, heartGlow: 0.3 }) + props);
    s += desk();
    s += banner(t, 0.4, 'MULTITASKING', '#c26ae6', 120, 380);
  } else if (t < c2) {
    const a = T(1), len = Tend(1) - a, k = easeOut(prog(t, a + 0.3, a + 1.6));
    s += office();
    s += g('translate(270 330)', `<circle r="150" fill="#ffd6f0" stroke="#1b1b2f" stroke-width="6"/>
      <path d="M0 0 L0 -150 A150 150 0 ${k * 240 > 180 ? 1 : 0} 1 ${150 * Math.sin(k * 240 * Math.PI / 180)} ${-150 * Math.cos(k * 240 * Math.PI / 180)}Z" fill="#b05bd6" stroke="#1b1b2f" stroke-width="5"/>
      ${k > 0.98 ? label(55, 60, 'ARMS', { size: 40 }) + label(55, 5, '2/3', { size: 58, fill: '#ffd21f' }) + label(-72, -50, 'HEAD', { size: 26, fill: '#c2185b', sw: 0 }) : ''}`);
    s += card(t, a + 0.1, 270, 135, label(0, 13, 'NEURONS', { size: 36, fill: '#7d5bd6', sw: 0 }), 260, 62);
  } else if (t < c3) {
    const a = T(2), len = Tend(2) - a, hi = t > a + len * 0.45 ? (t > a + len * 0.7 ? 5 : 2) : -1;
    s += office();
    const [tents, props] = eightArms(t, 2.2, 0.35, hi);
    s += g('translate(270 450) scale(0.9)', octavia(t, { m, blink: bl, pose: 'custom', tents, sad: 0.6, heartGlow: 0.3 }) + props);
    s += desk();
    s += card(t, a + 0.2, 270, 120, label(0, 12, 'EACH ARM THINKS', { size: 30, fill: '#7d5bd6', sw: 0 }), 330, 60);
    if (hi === 2) s += card(t, a + len * 0.45, 110, 250, label(0, 10, 'ARM #3', { size: 28, fill: '#c2185b', sw: 0 }), 130, 52);
    if (hi === 5) s += card(t, a + len * 0.7, 430, 250, label(0, 10, 'ARM #6', { size: 28, fill: '#c2185b', sw: 0 }), 130, 52) + label(430, 210, '???', { size: 40, fill: '#ffd21f' });
  } else if (t < c4) {
    s += burst(t, '#ff6b8a', '#ff8fa6');
    const [tents, props] = eightArms(t, 7, 0.6);
    s += g(`translate(${270 + Math.sin(t * 40) * 2} 640) scale(1.7)`, octavia(t, { m, blink: 0, pose: 'custom', tents, sad: 1, heartGlow: 0.3 }) + props);
    s += g('translate(400 120)', `<path d="M0 0 q-12 22 0 32 q12 -10 0 -32Z" fill="#7fe0ff" stroke="#1b1b2f" stroke-width="3"/>`);
    s += card(t, T(3) + 0.1, 270, 150, label(0, 12, 'PLEASE... BEHAVE', { size: 34, fill: '#c2185b', sw: 0 }), 360, 66);
  } else {
    const a = T(4), len = Tend(4) - a;
    s += `<rect width="${W}" height="${H}" fill="#eef3f8"/>`;
    // org chart
    s += `<rect x="190" y="110" width="160" height="70" rx="12" fill="#fff" stroke="#1b1b2f" stroke-width="4" stroke-dasharray="10 8"/>` + label(270, 140, 'MANAGER', { size: 22, fill: '#888', sw: 0 }) + label(270, 168, '???', { size: 26, fill: '#ff3b3b', sw: 0 });
    s += `<path d="M270 180 V220 M60 220 H480" stroke="#1b1b2f" stroke-width="4"/>`;
    for (let i = 0; i < 8; i++) {
      const x = 60 + (i % 4) * 140, y = 270 + Math.floor(i / 4) * 120;
      if (i < 4) s += `<path d="M${x} 220 V${y - 30}" stroke="#1b1b2f" stroke-width="4"/>`;
      s += card(t, a + 0.3 + i * 0.12, x, y, label(0, -4, `ARM ${i + 1}`, { size: 20, fill: '#7d5bd6', sw: 0 }) + g('translate(0 26) scale(0.6)', Object.values(PROPS)[i]), 110, 90, '#f6e9ff');
    }
    s += g('translate(270 590) scale(0.55)', octavia(t, { m, blink: bl, pose: 'swim', sad: 1, tears: true }));
    s += banner(t, a + len * 0.82, 'SEND HELP', '#ff3b3b', 520, 300, 40);
    s += endCard(t, 28.9);
  }
  s += flash(t, [c1, c2, c3, c4]);
  return s;
};
