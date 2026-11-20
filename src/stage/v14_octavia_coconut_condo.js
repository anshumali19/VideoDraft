// Video 14: Octavia's Coconut Condo
window.META = { name: 'OCTAVIA', color: '#c26ae6' };

function halfShell(x, y, s = 1, rot = 0, open = 'up') {
  const d = open === 'up' ? 'M-60 0 A60 50 0 0 0 60 0Z' : 'M-60 0 A60 50 0 0 1 60 0Z';
  return g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, `<path d="${d}" fill="#7a4a24" stroke="#2e1a0c" stroke-width="5"/>
    <path d="M-60 0 H60" stroke="#f4ecd8" stroke-width="10"/>
    ${[-40, -20, 0, 20, 40].map(i => `<path d="M${i} ${open === 'up' ? 10 : -10} l${i / 6} ${open === 'up' ? 20 : -20}" stroke="#a8743f" stroke-width="3"/>`).join('')}`);
}
function shark(t, x, y, s = 1) {
  return g(`translate(${x} ${y}) scale(${s})`, `<path d="M-160 0 C-100 -60 60 -60 120 -10 L170 -50 L160 0 L170 50 L120 10 C60 50 -100 50 -160 0Z" fill="#7d8fa3" stroke="#1b1b2f" stroke-width="5"/>
    <path d="M-20 -40 L10 -100 L40 -36Z" fill="#7d8fa3" stroke="#1b1b2f" stroke-width="5"/>
    <path d="M-160 0 C-100 30 0 36 80 20" fill="#e8eef4" stroke="none"/><circle cx="-110" cy="-12" r="8" fill="#1b1b2f"/>
    <path d="M-150 10 l10 6 l8 -6 l8 6 l8 -6 l8 6" stroke="#1b1b2f" stroke-width="3" fill="#fff"/>
    ${[0, 1, 2].map(i => `<path d="M${-70 + i * 12} -10 v18" stroke="#1b1b2f" stroke-width="3"/>`).join('')}`);
}
function closedCoconut(t, x, y, s = 1, peek = 1) {
  return g(`translate(${x} ${y}) scale(${s})`, `<ellipse cx="0" cy="8" rx="80" ry="12" fill="rgba(0,0,0,.2)"/>
    <path d="M-80 -60 A80 70 0 0 1 80 -60Z" fill="#7a4a24" stroke="#2e1a0c" stroke-width="5"/>
    <path d="M-80 -50 A80 60 0 0 0 80 -50Z" fill="#7a4a24" stroke="#2e1a0c" stroke-width="5"/>
    <rect x="-70" y="-62" width="140" height="${12 * peek}" fill="#2a1240"/>
    ${peek > 0.5 ? `<circle cx="-24" cy="-56" r="6" fill="#fff"/><circle cx="24" cy="-56" r="6" fill="#fff"/><circle cx="-23" cy="-56" r="3" fill="#1b1b2f"/><circle cx="25" cy="-56" r="3" fill="#1b1b2f"/>` : ''}
    ${[-50, -20, 10, 40].map(i => `<path d="M${i} -100 l4 14 M${i} -30 l4 14" stroke="#a8743f" stroke-width="3"/>`).join('')}`);
}

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t);
  const c1 = T(1) - 0.3, c2 = T(2) - 0.3, c3 = T(3) - 0.3, c4 = T(4) - 0.3;
  let s = '';
  if (t < c1) {
    const a = T(0), len = Tend(0) - a;
    s += sea(t);
    s += g('translate(400 420)', `<path d="M0 0 V180" stroke="#6b4a2e" stroke-width="10"/><rect x="-90" y="-80" width="180" height="110" rx="10" fill="#fff" stroke="#1b1b2f" stroke-width="5"/>` +
      label(0, -36, 'FOR SALE', { size: 30, fill: '#c0392b', sw: 0 }) + label(0, 10, '$$$$$$', { size: 30, fill: '#2fbf4a', sw: 0 }));
    s += emoji(400, 270, '🏠', 60);
    s += g('translate(170 560) scale(0.85)', octavia(t, { m, blink: bl, pose: 'stand', sad: 1, heartGlow: 0.3 }));
    if (t > a + len * 0.25) s += label(180, 200, 'CRAZY!', { size: 50 * pop(t, a + len * 0.25), fill: '#ffd21f', rot: -8 });
  } else if (t < c2) {
    const a = T(1), len = Tend(1) - a, x = lerp(-80, 620, prog(t, c1, c2));
    s += sea(t);
    const bob = Math.abs(Math.sin(t * 9)) * 10;
    s += g(`translate(${x} ${540 - bob}) scale(0.75)`, octavia(t, { m, blink: bl, pose: 'stand', sad: 0, heartGlow: 0.3 }) + halfShell(-100, -50, 0.9, -20, 'up') + halfShell(100, -50, 0.9, 20, 'up'));
    s += card(t, a + 0.2, 270, 160, label(0, 14, 'VEINED OCTOPUS', { size: 36, fill: '#7d5bd6', sw: 0 }), 380, 70);
    if (t > a + len * 0.55) s += card(t, a + len * 0.55, 270, 260, emoji(-90, 0, '🥥', 44) + label(30, 12, 'PORTABLE HOME', { size: 24, fill: '#1b1b2f', sw: 0 }), 300, 66);
  } else if (t < c3) {
    const a = T(2);
    s += burst(t, '#ffd21f', '#ffe36b');
    s += g('translate(270 560) scale(1.0)', octavia(t, { m, blink: bl, pose: 'stand', sad: 0, heartGlow: 0.3 }) + halfShell(-110, -40, 0.9, -10, 'up') + halfShell(110, -40, 0.9, 10, 'up'));
    s += banner(t, a + 0.1, 'TOOL USE', '#7a4a24', 160, 300);
    if (t > a + 1.4) s += card(t, a + 1.4, 420, 290, emoji(0, -12, '🛠️', 50) + tick(0, 44, 0.6), 130, 130);
  } else if (t < c4) {
    const a = T(3), len = Tend(3) - a, close = prog(t, a + len * 0.45, a + len * 0.55);
    s += sea(t, 1);
    const sx = lerp(720, 380, easeOut(prog(t, a + len * 0.3, a + len * 0.6)));
    if (close < 1) s += g('translate(180 560) scale(0.8)', octavia(t, { m, blink: bl, pose: 'stand', sad: 1, heartGlow: 0.3 }));
    else s += closedCoconut(t, 180, 560, 1.1, 1);
    s += shark(t, sx, 330 + Math.sin(t * 2) * 10, 0.9);
    if (close >= 1) s += label(sx - 40, 220, '?', { size: 70, fill: '#fff' });
    s += card(t, a + 0.3, 140, 150, label(0, 12, 'SILLY? YES.', { size: 30, fill: '#c2185b', sw: 0 }), 230, 60);
    if (t > a + len * 0.6) s += card(t, a + len * 0.6, 400, 150, label(0, 12, 'SAFE? YES.', { size: 30, fill: '#2fbf4a', sw: 0 }), 230, 60);
  } else {
    s += sea(t);
    s += closedCoconut(t, 270, 560, 1.5, 1);
    s += g('translate(420 560)', `<path d="M0 0 V-90" stroke="#6b4a2e" stroke-width="8"/><rect x="-30" y="-130" width="60" height="44" rx="10" fill="#2f7de1" stroke="#1b1b2f" stroke-width="4"/>` + label(0, -98, 'O.', { size: 18, sw: 0 }));
    s += card(t, c4 + 0.6, 130, 380, label(0, -10, 'MORTGAGE:', { size: 20, fill: '#555', sw: 0 }) + label(0, 26, '$0', { size: 40, fill: '#2fbf4a', sw: 0 }), 170, 100);
    s += banner(t, c4 + 0.3, 'YOUR MOVE, HUMANS', '#c26ae6', 175, 450, 38);
    s += endCard(t, 28.9);
  }
  s += flash(t, [c1, c2, c3, c4]);
  return s;
};
