// Video 4: Pidge Makes Milk
window.META = { name: 'PIDGE', color: '#7d5bd6' };

function kitchen() {
  let tiles = '';
  for (let r = 0; r < 12; r++) for (let c = 0; c < 9; c++)
    tiles += `<rect x="${c * 62}" y="${r * 44}" width="60" height="42" fill="${(r + c) % 2 ? '#fff6dc' : '#ffeec2'}"/>`;
  return `<rect width="${W}" height="${H}" fill="#ffeec2"/>${tiles}
    
    <rect x="0" y="560" width="${W}" height="${H - 560}" fill="#c98a52"/>`;
}
const counter = () => `<rect x="-10" y="470" width="${W + 20}" height="30" rx="6" fill="#e8e0d4" stroke="#1b1b2f" stroke-width="5"/>
  <rect x="10" y="500" width="${W - 20}" height="100" fill="#8a5a3c" stroke="#1b1b2f" stroke-width="5"/>
  ${[0, 1, 2].map(i => `<rect x="${30 + i * 170}" y="515" width="150" height="70" rx="6" fill="#9c6847" stroke="#1b1b2f" stroke-width="3"/><circle cx="${105 + i * 170}" cy="530" r="5" fill="#e8e0d4"/>`).join('')}`;
const apron = `<path d="M-40 -100 L40 -100 L48 -10 Q0 4 -48 -10Z" fill="#fff" stroke="#2b2f3d" stroke-width="4"/>
  <path d="M-30 -100 Q0 -150 30 -100" stroke="#ff6b81" stroke-width="5" fill="none"/>
  <rect x="-18" y="-60" width="36" height="24" rx="5" fill="#ffd6de" stroke="#2b2f3d" stroke-width="3"/>
  <path d="M-48 -40 h96" stroke="#ff6b81" stroke-width="5"/>`;
const bow = `<path d="M-24 -214 l-22 -14 v28Z M-24 -214 l22 -14 v28Z" fill="#ff6b9e" stroke="#2b2f3d" stroke-width="3"/><circle cx="-24" cy="-214" r="6" fill="#ff3d7f"/>`;
const tag = (x, y, text, color) => `<g transform="translate(${x} ${y}) rotate(-6)"><rect x="-42" y="-18" width="84" height="36" rx="10" fill="${color}" stroke="#1b1b2f" stroke-width="4"/>${label(0, 9, text, { size: 22, sw: 5 })}</g>`;

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t);
  const c1 = T(1) - 0.2, c2 = T(2) - 0.2, c3 = T(3) - 0.2, c4 = T(4) - 0.3;
  let s = '';
  if (t < c1) {
    s += kitchen();
    s += g('translate(430 520) scale(0.8)', cow(t, { shock: prog(t, 0.6, 1.2) }));
    s += g('translate(200 525) scale(1.25)', pidge({ m, blink: bl, wing: 'cross', outfit: apron, look: 0.5 }));
    s += counter();
    s += card(t, 0.5, 270, 170, emoji(-70, -4, '🐄', 60) + label(40, 12, '= MILK?', { size: 40, fill: '#1b1b2f', sw: 0 }), 300, 100);
  } else if (t < c2) {
    s += burst(t, '#ffd21f', '#ffe36b');
    const a = T(1), len = Tend(1) - a;
    s += g('translate(130 600) scale(1.3)', pidge({ m, blink: bl, wing: 'point', outfit: apron, pointAng: -10 }));
    s += g('translate(440 640) scale(0.7)', cow(t, { shock: 1 }));
    s += banner(t, a + 0.05, 'WRONG, COW.', '#ff3b3b', 175, 360);
    if (t > a + len * 0.45) {
      s += card(t, a + len * 0.45, 380, 330, label(0, -6, 'CROP', { size: 34, fill: '#7d5bd6', sw: 0 }) + label(0, 26, 'MILK', { size: 34, fill: '#7d5bd6', sw: 0 }), 150, 110, '#fff7c2');
      s += `<circle cx="130" cy="436" r="${22 + 4 * Math.sin(t * 8)}" fill="#fff" opacity=".85" stroke="#7d5bd6" stroke-width="4"/>`;
      s += `<path d="M300 350 Q220 360 160 425" stroke="#1b1b2f" stroke-width="5" fill="none" marker-end="url(#ar)"/>`;
      if (t > a + len * 0.75) s += label(130, 395, 'THROAT', { size: 18, fill: '#fff', sw: 5 });
    }
  } else if (t < c3) {
    const a = T(2), len = Tend(2) - a;
    s += kitchen();
    s += g('translate(140 520) scale(1.05)', pidge({ m, blink: bl, wing: 'hold', outfit: apron }));
    s += g('translate(360 520) scale(0.95) scale(-1 1)', pidge({ m: 0, blink: blink(t, 2), wing: 'down', face: bow, brow: 0 }));
    s += counter();
    s += g(`translate(250 472) scale(${0.9 + 0.05 * Math.sin(t * 10)})`, squab(t, { m: 0.6 + 0.4 * Math.sin(t * 9) }));
    s += `<path d="M232 380 Q246 410 250 440" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".95"/>`;
    s += g('translate(222 372) rotate(140)', `<rect x="-10" y="-20" width="20" height="34" rx="5" fill="#fff" stroke="#1b1b2f" stroke-width="3"/>`);
    s += tag(130, 250, 'DAD', '#2f7de1') + (t > a + len * 0.25 ? tag(380, 250, 'MUM', '#ff3d7f') : '');
    if (t < a + len * 0.7) s += banner(t, a + len * 0.35, 'BOTH PARENTS!', '#7d5bd6', 175, 380);
    if (t > a + len * 0.7) s += card(t, a + len * 0.7, 270, 175, emoji(-110, 0, '🏭', 50) + label(30, 12, 'MILK FACTORY', { size: 30, fill: '#1b1b2f', sw: 0 }), 320, 84);
  } else if (t < c4) {
    const a = T(3);
    s += burst(t, '#8fd3ff', '#b7e4ff');
    s += card(t, a + 0.1, 150, 330, emoji(0, -16, '🦩', 90) + tick(40, 70, 0.7), 190, 210, '#ffe3ef');
    s += card(t, a + 0.7, 390, 330, emoji(0, -16, '🐧', 90) + tick(40, 70, 0.7), 190, 210, '#e3f3ff');
    s += banner(t, a + 0.05, 'MILK CLUB', '#ff6b9e', 160, 300);
    s += g('translate(270 590) scale(0.7)', pidge({ m, blink: bl, wing: 'cross', outfit: apron, brow: 0.3 }));
  } else {
    // pavement
    s += `<rect width="${W}" height="${H}" fill="#9fd3ff"/><rect y="250" width="${W}" height="300" fill="#d8c3a5"/>
      ${[0, 1, 2, 3].map(i => `<rect x="${i * 140 + 10}" y="280" width="110" height="200" fill="#c0a582" stroke="#8a7350" stroke-width="4"/>`).join('')}
      <rect y="540" width="${W}" height="${H - 540}" fill="#b9b4ad"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${i * 120} 540 l-60 420" stroke="#9a958e" stroke-width="4"/>`).join('')}`;
    s += g('translate(220 600) scale(1.3)', pidge({ m, blink: bl, wing: 'cross', outfit: apron, brow: 0.6 }));
    [[360, 600], [420, 610], [470, 596]].forEach(([x, y], i) => s += g(`translate(${x} ${y + Math.sin(t * 6 + i) * 4}) scale(0.65)`, squab(t, { m: Math.abs(Math.sin(t * 5 + i)) })));
    s += banner(t, c4 + 1.2, 'PARENT OF THE YEAR', '#ff7a1a', 175, 460, 38);
    s += emoji(80, 300, '🏆', 64 * pop(t, c4 + 1.6));
    s += endCard(t, 28.7);
  }
  s += `<defs><marker id="ar" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#1b1b2f"/></marker></defs>`;
  s += flash(t, [c1, c2, c3, c4]);
  return s;
};
