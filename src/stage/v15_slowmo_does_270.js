// Video 15: Slowmo Does a 270
window.META = { name: 'SLOWMO', color: '#a07a52' };

const sideBranch = y => `<path d="M560 ${y} C480 ${y + 6} 420 ${y - 4} 360 ${y + 4}" stroke="#6b4a2e" stroke-width="22" fill="none" stroke-linecap="round"/><ellipse cx="400" cy="${y - 14}" rx="22" ry="10" fill="#3b9a5f"/>`;
function vertebrae(t, x, y, n, extra, at) {
  let s = '';
  for (let i = 0; i < n + extra; i++) {
    const isX = i >= n, k = isX ? pop(t, at + (i - n) * 0.4) : 1;
    if (isX && t < at + (i - n) * 0.4) continue;
    s += g(`translate(${x} ${y + i * 44}) scale(${k})`, `<rect x="-46" y="-16" width="92" height="32" rx="14" fill="${isX ? '#ffd21f' : '#f4ecd8'}" stroke="#1b1b2f" stroke-width="4"/><path d="M-46 0 h-16 M46 0 h16" stroke="#1b1b2f" stroke-width="6" stroke-linecap="round"/>`);
  }
  return s;
}

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t, 1);
  const c1 = T(1) - 0.3, c2 = T(2) - 0.3, c3 = T(3) - 0.3, c4 = T(4) - 0.3;
  let s = '';
  if (t < c1) {
    s += jungle(t) + branch(200) + sideBranch(360);
    s += g('translate(200 200) scale(0.95)', slowmo(t, { m, blink: bl }));
    s += g('translate(440 352) scale(0.8)', birdie(t, {}));
    s += label(400, 200, 'IMPRESSIVE?', { size: 40 * pop(t, T(0) + 1.2), fill: '#ffd21f', rot: 6 });
  } else if (t < c2) {
    const a = T(1), len = Tend(1) - a, k = easeInOut(prog(t, a + 0.5, a + len * 0.95)), ang = 270 * k;
    s += g(`translate(${W - 40 * k} 0)`, jungle(t) + branch(200)) + g(`translate(${-40 * k} 0)`, jungle(t).replace(/<rect width="540" height="960" fill="url\(#jg\)"\/>/, `<rect width="540" height="960" fill="url(#jg)"/>`) + branch(200) + sideBranch(360));
    s += g(`translate(${200 - 40 * k} 200) scale(0.95)`, slowmo(t, { m, blink: bl, headTurn: ang }));
    s += g(`translate(${440 - 40 * k} 352) scale(0.8)`, birdie(t, {}));
    s += card(t, a + 0.3, 400, 500, `<circle cx="0" cy="-6" r="44" fill="none" stroke="#e2dcf5" stroke-width="12"/>
      <path d="M0 -50 A44 44 0 ${ang > 180 ? 1 : 0} 1 ${44 * Math.sin(ang * Math.PI / 180)} ${-6 - 44 * Math.cos(ang * Math.PI / 180)}" stroke="#a07a52" stroke-width="12" fill="none"/>` +
      label(0, 4, `${Math.round(ang)}°`, { size: 26, fill: '#1b1b2f', sw: 0 }), 150, 130);
  } else if (t < c3) {
    const a = T(2);
    s += `<rect width="${W}" height="${H}" fill="#1f2a44"/>` + [...Array(10)].map((_, i) => `<path d="M0 ${i * 70 + 100} H${W}" stroke="#2a3a5c" stroke-width="2"/>`).join('');
    s += vertebrae(t, 270, 200, 7, 2, a + 1.2);
    s += card(t, a + 0.1, 270, 130, label(0, 12, 'SLOTH NECK', { size: 36, fill: '#a07a52', sw: 0 }), 260, 62);
    if (t > a + 1.2) s += label(430, 520, 'EXTRA!', { size: 40 * pop(t, a + 1.2), fill: '#ffd21f', rot: -8 });
  } else if (t < c4) {
    const a = T(3), len = Tend(3) - a, faint = easeOut(prog(t, a + len * 0.35, a + len * 0.5));
    s += jungle(t) + branch(200) + sideBranch(360);
    s += g('translate(200 200) scale(0.95)', slowmo(t, { m, blink: bl, headTurn: 270 }));
    s += g(`translate(440 ${352 + faint * 6}) scale(0.8)`, birdie(t, { faint }));
    if (faint > 0.9) s += label(470, 260, 'x_x', { size: 30, fill: '#fff' });
    s += card(t, a + 0.3, 400, 500, label(0, -10, 'BODY', { size: 26, fill: '#1b1b2f', sw: 0 }) + label(0, 24, 'NOT MOVING', { size: 22, fill: '#c0392b', sw: 0 }), 190, 90);
    if (t > a + len * 0.7) s += banner(t, a + len * 0.7, 'MOVING IS... A LOT', '#a07a52', 140, 420, 36);
  } else {
    const a = T(4), len = Tend(4) - a, pct = 1 + Math.floor(prog(t, a, 30) * 3);
    s += jungle(t) + branch(200);
    s += g('translate(270 200) scale(0.95)', slowmo(t, { m, blink: bl, sleepy: prog(t, a + len * 0.6, a + len) }));
    s += g('translate(270 140)', `<rect x="-200" y="-26" width="400" height="52" rx="26" fill="#fff" stroke="#1b1b2f" stroke-width="5"/>
      <rect x="-194" y="-20" width="${388 * pct / 100 + 14}" height="40" rx="20" fill="#a07a52"/>` + label(0, 12, `NEXT POST: ${pct}%`, { size: 26, fill: '#1b1b2f', sw: 0 }));
    s += endCard(t, 27.6);
  }
  s += flash(t, [c1, c2, c3, c4]);
  return s;
};
