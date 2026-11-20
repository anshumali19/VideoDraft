// Video 6: Slowmo Busts the Sleepy Myth
window.META = { name: 'SLOWMO', color: '#a07a52' };

function mythSign(t, x, y, cross = 0) {
  return g(`translate(${x} ${y}) rotate(${Math.sin(t * 0.8) * 2})`, `
    <path d="M-120 -90 L-90 -150 M120 -90 L90 -150" stroke="#5a3d24" stroke-width="5"/>
    <rect x="-150" y="-90" width="300" height="170" rx="14" fill="#e9c58f" stroke="#5a3d24" stroke-width="7"/>
    ${label(0, -32, 'SLOTHS SLEEP', { size: 34, fill: '#5a3d24', sw: 0 })}
    ${label(0, 34, '20 HOURS', { size: 58, fill: '#c0392b', sw: 0 })}
    ${cross > 0 ? `<path d="M-130 60 L${-130 + 260 * cross} ${60 - 130 * cross}" stroke="#3f9a2e" stroke-width="18" stroke-linecap="round"/>
                   <path d="M-130 -70 L${-130 + 260 * cross} ${-70 + 130 * cross}" stroke="#3f9a2e" stroke-width="18" stroke-linecap="round" opacity="${cross > 0.5 ? 1 : 0}"/>` : ''}`);
}

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t, 1);
  const c1 = T(1) - 0.3, c2 = T(2) - 0.3, c3 = T(3) - 0.3, c4 = T(4) - 0.3;
  let s = '';
  if (t < c2) {
    const a = T(1), len = Tend(1) - a;
    s += jungle(t) + branch(200);
    s += g('translate(150 200) scale(0.85)', slowmo(t, { m, blink: bl, pj: true, mask: true }));
    const cross = t < c1 ? 0 : easeInOut(prog(t, a + 0.6, a + 3.2));
    s += mythSign(t, 385, 420, cross);
    if (t > T(0) + (Tend(0) - T(0)) * 0.75 && t < c1) s += label(400, 250, 'RUDE.', { size: 54 * pop(t, T(0) + (Tend(0) - T(0)) * 0.75), fill: '#ff5a4e', rot: 8 });
    if (t > c1) {
      // the leaf "pen"
      const lx = 385 - 130 + 260 * Math.min(1, cross * 2) , ly = 420 + 60 - 130 * Math.min(1, cross * 2);
      if (cross < 1) s += `<path d="M${lx} ${ly} q30 -10 46 6 q-22 18 -46 -6Z" fill="#4fbf3a" stroke="#2b6b2a" stroke-width="3"/>`;
      s += card(t, a + len * 0.6, 270, 140, label(0, -6, 'WILD SLOTHS:', { size: 26, fill: '#3f7f2a', sw: 0 }) + label(0, 30, '~10 HOURS', { size: 40, fill: '#1b1b2f', sw: 0 }), 300, 100, '#eaffd9');
    }
  } else if (t < c3) {
    const a = T(2), len = Tend(2) - a;
    s += `<rect width="${W}" height="${H}" fill="#d9e4ea"/><rect y="560" width="${W}" height="${H - 560}" fill="#b0a48f"/>`;
    s += jungle(t).replace(/<rect width="540" height="960"[^>]*>/, '');
    s += `<rect x="60" y="150" width="420" height="420" fill="none"/>`;
    s += branch(260);
    s += g('translate(270 260) scale(0.8)', slowmo(t, { m: 0, blink: 1, sleepy: 1, pj: true, mask: true }));
    for (let i = 0; i < 9; i++) s += `<rect x="${40 + i * 58}" y="120" width="12" height="460" fill="#6b7280" stroke="#1b1b2f" stroke-width="3"/>`;
    s += `<rect x="30" y="110" width="480" height="20" fill="#4b5563" stroke="#1b1b2f" stroke-width="3"/>`;
    s += banner(t, a + 0.1, 'ZOO SLOTHS', '#6b7280', 175, 340);
    s += card(t, a + len * 0.6, 270, 480, emoji(-80, 0, '🥱', 48) + label(30, 12, 'BORED', { size: 38, fill: '#1b1b2f', sw: 0 }), 260, 80);
    ['Z', 'z', 'Z'].forEach((z, i) => { const ph = (t * 0.5 + i / 3) % 1; s += label(350 + ph * 60, 380 - ph * 120, z, { size: 30 + i * 8, op: Math.sin(ph * Math.PI) }); });
  } else if (t < c4) {
    const a = T(3), len = Tend(3) - a;
    s += burst(t, '#9be38a', '#b8f0a8');
    s += g(`translate(150 350) rotate(${Math.sin(t) * 6}) scale(2.2)`, `<path d="M-40 0 q40 -40 80 0 q-40 40 -80 0Z" fill="#4fbf3a" stroke="#2b6b2a" stroke-width="3"/><path d="M-40 0 h80" stroke="#2b6b2a" stroke-width="2"/>`);
    s += card(t, a + len * 0.55, 150, 470, label(0, 10, 'LOW CALORIE', { size: 28, fill: '#c0392b', sw: 0 }), 230, 56);
    const lvl = t > a + len * 0.25 ? 0.25 : 0.8;
    s += g('translate(390 340)', `<rect x="-70" y="-120" width="140" height="240" rx="20" fill="#fff" stroke="#1b1b2f" stroke-width="7"/><rect x="-28" y="-138" width="56" height="20" rx="6" fill="#1b1b2f"/>
      <rect x="-56" y="${106 - 212 * lvl}" width="112" height="${212 * lvl}" rx="10" fill="${lvl < 0.3 ? '#ffb03b' : '#2fbf4a'}"/>`);
    if (t > a + len * 0.25) s += card(t, a + len * 0.25, 390, 520, label(0, 10, 'ENERGY SAVER', { size: 26, fill: '#3f7f2a', sw: 0 }), 230, 56, '#eaffd9');
    s += g('translate(270 140) scale(0.5)', '');
  } else {
    const a = T(4);
    s += jungle(t) + branch(200);
    s += g('translate(250 200) scale(0.95)', slowmo(t, { m, blink: bl, pj: true, mask: true }));
    s += g('translate(250 312) scale(0.95)', `<rect x="-58" y="-14" width="48" height="26" rx="10" fill="#1b1b2f"/><rect x="10" y="-14" width="48" height="26" rx="10" fill="#1b1b2f"/><path d="M-10 -4 h20" stroke="#1b1b2f" stroke-width="5"/>`);
    s += banner(t, a + 0.8, "IT'S A LIFESTYLE", '#a07a52', 520, 420, 40);
    s += endCard(t, 28.9);
  }
  s += flash(t, [c1, c2, c3, c4].filter(x => x !== c1));
  return s;
};
