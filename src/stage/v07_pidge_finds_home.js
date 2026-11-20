// Video 7: Pidge Always Finds Home
window.META = { name: 'PIDGE', color: '#7d5bd6' };

function street(t) {
  let s = `<rect width="${W}" height="${H}" fill="#a8dcff"/>`;
  [['#f2a65a', 0, 230], ['#7fb7a3', 150, 300], ['#e57373', 300, 260], ['#9fa8da', 430, 320]].forEach(([c, x, h]) => {
    s += `<rect x="${x}" y="${560 - h}" width="${140}" height="${h}" fill="${c}" stroke="#1b1b2f" stroke-width="4"/>`;
    for (let r = 0; r < 3; r++) s += `<rect x="${x + 20}" y="${580 - h + r * 70}" width="36" height="40" fill="#e8f6ff" stroke="#1b1b2f" stroke-width="3"/><rect x="${x + 80}" y="${580 - h + r * 70}" width="36" height="40" fill="#e8f6ff" stroke="#1b1b2f" stroke-width="3"/>`;
  });
  return s + `<rect y="560" width="${W}" height="${H - 560}" fill="#b9b4ad"/>`;
}
function compass(t, x, y, r = 46) {
  const a = Math.sin(t * 3) * 20;
  return `<circle cx="${x}" cy="${y}" r="${r + 22}" fill="#fff6a8" opacity="${0.35 + 0.2 * Math.sin(t * 6)}"/>
    <circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#c99a3c" stroke-width="8"/>
    ${label(x, y - r + 22, 'N', { size: 18, fill: '#c0392b', sw: 0 })}
    <g transform="rotate(${a} ${x} ${y})"><path d="M${x} ${y - r + 26} l10 ${r - 26} h-20Z" fill="#ff3b3b"/><path d="M${x} ${y + r - 26} l10 ${-(r - 26)} h-20Z" fill="#3b3f4a"/></g>
    <circle cx="${x}" cy="${y}" r="5" fill="#1b1b2f"/>`;
}
const mapProp = `<g transform="rotate(180)"><path d="M-40 -30 l26 6 l26 -6 l28 6 v60 l-28 -6 l-26 6 l-26 -6Z" fill="#f4e3b5" stroke="#1b1b2f" stroke-width="3"/>
  <path d="M-30 10 q20 -20 50 0" stroke="#c0392b" stroke-width="3" stroke-dasharray="5 4" fill="none"/>${label(0, -6, 'MAP', { size: 14, fill: '#1b1b2f', sw: 0 })}</g>`;

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t);
  const c1 = T(1) - 0.3, c2 = T(2) - 0.3, c3 = T(3) - 0.2, c4 = T(4) - 0.3;
  let s = '';
  if (t < c1) {
    s += street(t);
    s += g('translate(390 470) scale(0.95)', person(t, { cap: true, phone: 'dead', expr: 'nervous', shirt: '#2fbf8f' }));
    s += g('translate(150 600) scale(1.2)', pidge({ m, blink: bl, wing: 'hold', brow: 0.8, look: 0.6 }) + g('translate(104 -210) rotate(15)', mapProp));
    s += label(130, 220, 'LOST?', { size: 64 * pop(t, 0.3), fill: '#ffd21f', rot: -8 });
    if (t > 2) s += label(340, 250, 'AGAIN?', { size: 46 * pop(t, 2), fill: '#fff', rot: 8 });
  } else if (t < c2) {
    const a = T(1), k = easeInOut(prog(t, a, Tend(1) + 1));
    s += `<rect width="${W}" height="${H}" fill="#7cc6f2"/>
      <path d="M-20 700 C60 560 20 420 120 360 C200 300 180 160 300 120 C420 90 500 160 560 120 V${H} H-20Z" fill="#b7df8a" stroke="#6b9a4a" stroke-width="6"/>
      <circle cx="200" cy="500" r="40" fill="#9ccf6e"/><circle cx="380" cy="300" r="50" fill="#9ccf6e"/>`;
    const P = u => [lerp(90, 450, u) + Math.sin(u * 5) * 50, lerp(560, 190, u)];
    let d = ''; for (let i = 0; i <= 40; i++) { const u = i / 40 * k, [x, y] = P(u); d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); }
    s += `<path d="${d}" stroke="#c0392b" stroke-width="6" stroke-dasharray="12 10" fill="none"/>`;
    s += `<circle cx="90" cy="560" r="12" fill="#1b1b2f"/>` + emoji(450, 160, '🏠', 60);
    const [px, py] = P(k);
    s += g(`translate(${px} ${py + 40}) scale(0.55)`, pidge({ m, blink: bl, wing: 'flap', t, brow: 0.4 }));
    s += card(t, a + 0.3, 330, 515, label(0, 14, Math.round(1000 * Math.min(1, k * 1.25)).toLocaleString('en') + (k > 0.79 ? '+ KM' : ' KM'), { size: 40, fill: '#7d5bd6', sw: 0 }), 260, 70);
  } else if (t < c3) {
    const a = T(2), len = Tend(2) - a;
    s += `<rect width="${W}" height="${H}" fill="#8fd3ff"/>` + [0, 1, 2].map(i => { const x = ((t * 40 + i * 230) % 760) - 110; return `<g fill="#fff" opacity=".9"><ellipse cx="${x}" cy="${480 + i * 40}" rx="60" ry="22"/><ellipse cx="${x + 34}" cy="${466 + i * 40}" rx="40" ry="22"/></g>`; }).join('');
    s += g(`translate(270 ${560 + Math.sin(t * 4) * 8}) scale(1.05)`, pidge({ m, blink: bl, wing: 'flap', t, brow: 0.5 }));
    if (t > a + len * 0.55) s += compass(t, 270, 280, 40 * pop(t, a + len * 0.55));
    s += card(t, a + 0.1, 130, 130, emoji(0, -6, '📱', 44) + cross(30, 26, 0.55), 110, 100);
    s += card(t, a + 0.6, 410, 130, emoji(0, -6, '🗺️', 44) + cross(30, 26, 0.55), 110, 100);
    s += card(t, a + len * 0.3, 90, 400, emoji(0, 0, '☀️', 46), 90, 90, '#fff7c2');
    s += card(t, a + len * 0.4, 450, 400, emoji(0, 0, '👃', 46), 90, 90, '#fff7c2');
    s += card(t, a + len * 0.5, 450, 260, emoji(0, 0, '🧲', 46), 90, 90, '#fff7c2');
  } else if (t < c4) {
    const a = T(3);
    s += `<rect width="${W}" height="${H}" fill="#e9d7b0"/><rect y="560" width="${W}" height="${H - 560}" fill="#b89b6a"/>`;
    s += `<rect x="40" y="100" width="460" height="440" fill="none" stroke="#a88a5a" stroke-width="10"/>`;
    s += g(`translate(270 ${580 + Math.sin(t * 4) * 6}) scale(1.15)`, pidge({ m, blink: bl, wing: 'flap', t, brow: 0.2 }) +
      `<rect x="10" y="-30" width="18" height="30" rx="6" fill="#c99a3c" stroke="#1b1b2f" stroke-width="3"/>`);
    s += emoji(400, 300 + Math.sin(t * 3) * 8, '✉️', 70 * pop(t, a + 0.4));
    s += banner(t, a + 0.1, 'PIGEON POST', '#8a5a2e', 175, 340);
  } else {
    const a = T(4), len = Tend(4) - a;
    s += `<rect width="${W}" height="${H}" fill="#f1ece4"/>` + [0, 1, 2].map(i => `<rect x="${20 + i * 175}" y="200" width="150" height="300" fill="${['#ffd6de', '#d6ecff', '#e3ffd6'][i]}" stroke="#1b1b2f" stroke-width="4"/><rect x="${20 + i * 175}" y="200" width="150" height="40" fill="${['#ff6b81', '#2f7de1', '#2fbf4a'][i]}"/>`).join('');
    s += `<rect y="500" width="${W}" height="${H - 500}" fill="#d8d0c4"/>` + [0, 1, 2, 3, 4, 5].map(i => `<path d="M${i * 100 - 20} 500 l-60 460" stroke="#c4bbae" stroke-width="3"/>`).join('');
    s += g('translate(400 130)', `<rect x="-80" y="-30" width="160" height="60" rx="8" fill="#2fbf4a" stroke="#1b1b2f" stroke-width="4"/>` + label(-10, 14, 'EXIT', { size: 34, sw: 6 }) + `<path d="M40 -10 l24 10 l-24 10Z" fill="#fff"/>`);
    s += g(`translate(120 480) rotate(${Math.sin(t * 2) * 6}) scale(0.62)`, person(t, { cap: true, phone: 'dead', expr: 'dizzy', shirt: '#2fbf8f' }));
    const fx = lerp(220, 400, easeOut(prog(t, a + len * 0.5, a + len * 1.1)));
    s += g(`translate(${fx} ${440 + Math.sin(t * 5) * 10}) scale(0.7)`, pidge({ m, blink: bl, wing: 'flap', t, brow: 0.9 }));
    if (t > a + len * 0.5) s += banner(t, a + len * 0.5, 'FOLLOW ME. KEEP UP.', '#7d5bd6', 250, 460, 36);
    s += endCard(t, 28.6);
  }
  s += flash(t, [c1, c2, c3, c4]);
  return s;
};
