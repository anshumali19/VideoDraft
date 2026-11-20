// Video 9: Slowmo Goes Swimming
window.META = { name: 'SLOWMO', color: '#a07a52' };

function river(t, waterTop = 430) {
  let s = `<rect width="${W}" height="${H}" fill="#9fdcff"/>
    <path d="M0 ${waterTop - 120} Q140 ${waterTop - 170} 300 ${waterTop - 130} T540 ${waterTop - 140} V${waterTop} H0Z" fill="#7cc46a"/>
    ${[60, 200, 420].map((x, i) => `<path d="M${x} ${waterTop - 130} l0 -60" stroke="#6b4a2e" stroke-width="14"/><circle cx="${x}" cy="${waterTop - 210}" r="44" fill="${['#3b9a5f', '#2e7d4f', '#3b9a5f'][i]}"/>`).join('')}
    <rect y="${waterTop}" width="${W}" height="${H - waterTop}" fill="#2a8fd0"/>`;
  for (let i = 0; i < 6; i++) { const x = ((t * 50 + i * 120) % 700) - 80; s += `<path d="M${x} ${waterTop + 30 + (i % 3) * 50} q20 -10 40 0" stroke="#bfe8ff" stroke-width="5" fill="none"/>`; }
  return s;
}
const swimSloth = (t, o) => g(`rotate(-90)`, slowmo(t, Object.assign({ pose: 'climb', goggles: true }, o)));

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t, 1);
  const c1 = T(1) - 0.3, c2 = T(2) - 0.3, c3 = T(3) - 0.3, c4 = T(4) - 0.3;
  let s = '';
  if (t < c1) {
    const a = T(0), len = Tend(0) - a;
    s += river(t, 520);
    s += `<path d="M0 520 Q100 460 260 500 L240 560 H0Z" fill="#8a6a3a"/>`;
    s += g('translate(150 150) scale(0.85)', slowmo(t, { m, blink: bl, goggles: true }));
    s += g('translate(450 470) scale(0.55)', tortoise(t, {}));
    if (t < a + len * 0.45) s += card(t, a + 0.3, 400, 220, emoji(0, 0, '🐌', 60) + label(0, 56, 'LAND MODE', { size: 18, fill: '#555', sw: 0 }), 150, 140);
    else s += label(390, 230, 'LEGEND', { size: 58 * pop(t, a + len * 0.5), fill: '#ffd21f', rot: -8 });
  } else if (t < c2) {
    const a = T(1), len = Tend(1) - a;
    s += river(t, 380);
    const x = -160 + ((t - c1) * 560) % 860;
    s += g(`translate(${x} 470) scale(0.7)`, swimSloth(t, { m }));
    for (let i = 0; i < 5; i++) s += `<path d="M${x - 140 - i * 34} ${430 + i * 18} h-60" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/>`;
    s += `<g fill="#fff" opacity=".9">${[0, 1, 2].map(i => `<circle cx="${x - 120 - i * 26}" cy="${380 - i * 10 - Math.abs(Math.sin(t * 20 + i)) * 20}" r="${10 - i * 2}"/>`).join('')}</g>`;
    s += g('translate(430 290) scale(0.5)', tortoise(t, { shock: true }));
    s += label(400, 200, '!!', { size: 50, fill: '#ff3b3b' });
    s += banner(t, a + len * 0.3, 'TURBO SLOTH', '#2f7de1', 140, 360);
  } else if (t < c3) {
    const a = T(2), len = Tend(2) - a;
    s += `<rect width="${W}" height="${H}" fill="#1d5f99"/><rect width="${W}" height="80" fill="#2a8fd0"/>`;
    for (let i = 0; i < 10; i++) { const y = 600 - ((t * 60 + i * 70) % 560); s += `<circle cx="${180 + rnd(i) * 200}" cy="${y}" r="${4 + rnd(i + 3) * 6}" fill="none" stroke="#bfe8ff" stroke-width="2.5"/>`; }
    s += g(`translate(200 ${420 + Math.sin(t * 1.5) * 10}) scale(0.8)`, swimSloth(t, { m: 0, blink: bl }) + `<circle cx="-34" cy="22" r="14" fill="#c78f60" opacity=".8"/><circle cx="34" cy="22" r="14" fill="#c78f60" opacity=".8"/>`);
    const mins = Math.min(40, Math.floor(prog(t, a + 0.3, a + len * 0.9) * 40));
    s += card(t, a + 0.1, 400, 240, emoji(0, -26, '⏱️', 44) + label(0, 40, `${mins} MIN`, { size: 40, fill: '#1d5f99', sw: 0 }), 170, 140);
  } else if (t < c4) {
    const a = T(3), len = Tend(3) - a;
    s += burst(t * 0.3, '#ffd6de', '#ffe8ec');
    const beat = 1 + 0.12 * Math.pow(Math.max(0, Math.sin(t * 2.2)), 8);
    s += g(`translate(270 330) scale(${2.6 * beat})`, `<path d="M0 40 C-80 -10 -50 -80 0 -40 C50 -80 80 -10 0 40Z" fill="#ff3d6e" stroke="#1b1b2f" stroke-width="3"/>`);
    s += card(t, a + 0.2, 270, 140, label(0, 12, 'HEART RATE: SLOW', { size: 30, fill: '#c0392b', sw: 0 }), 360, 60);
    s += g('translate(100 480) scale(0.4)', slowmo(t, { m, blink: bl, goggles: true, pose: 'climb' }));
    if (t > a + len * 0.55) s += banner(t, a + len * 0.55, 'ON PURPOSE', '#a07a52', 520, 300, 40);
  } else {
    s += river(t, 520);
    s += `<path d="M0 520 Q100 460 260 500 L240 560 H0Z" fill="#8a6a3a"/>`;
    s += g('translate(170 150) scale(0.85)', slowmo(t, { m, blink: bl, goggles: true, leaf: true }));
    s += emoji(380, 300, '🍌', 60 * pop(t, c4 + 0.6)) + emoji(450, 360, '🍃', 50 * pop(t, c4 + 0.9));
    s += banner(t, c4 + 1.0, 'BRING SNACKS', '#ff7a1a', 490, 360);
    s += endCard(t, 28.7);
  }
  s += flash(t, [c1, c2, c3, c4]);
  return s;
};
