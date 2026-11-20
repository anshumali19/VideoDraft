// Video 10: Pidge Bobs His Head
window.META = { name: 'PIDGE', color: '#7d5bd6' };

function pavement(t, scroll = 0) {
  let s = `<rect width="${W}" height="${H}" fill="#bfe4ff"/>`;
  for (let i = -1; i < 6; i++) { const x = ((i * 150 - scroll * 0.4) % 900 + 900) % 900 - 150;
    s += `<rect x="${x}" y="200" width="130" height="340" fill="${['#f2a65a', '#9fa8da', '#7fb7a3', '#e57373', '#c5a3ff', '#ffd27a'][(i + 6) % 6]}" stroke="#1b1b2f" stroke-width="4"/>
      <rect x="${x + 20}" y="240" width="36" height="44" fill="#e8f6ff" stroke="#1b1b2f" stroke-width="3"/><rect x="${x + 74}" y="240" width="36" height="44" fill="#e8f6ff" stroke="#1b1b2f" stroke-width="3"/>`; }
  s += `<rect y="540" width="${W}" height="${H - 540}" fill="#b9b4ad"/>`;
  for (let i = 0; i < 8; i++) { const x = ((i * 100 - scroll) % 800 + 800) % 800 - 100; s += `<path d="M${x} 540 l-40 420" stroke="#9a958e" stroke-width="4"/>`; }
  return s;
}
// head jerks forward fast, then holds while the body catches up
const bob = (t, f = 2) => { const p = (t * f) % 1; return p < 0.2 ? lerp(-14, 14, easeOut(p / 0.2)) : lerp(14, -14, (p - 0.2) / 0.8); };
const lamp = x => `<rect x="${x - 8}" y="150" width="16" height="400" fill="#4b5563" stroke="#1b1b2f" stroke-width="3"/><path d="M${x} 160 q0 -30 40 -30 h20" stroke="#4b5563" stroke-width="12" fill="none"/><ellipse cx="${x + 64}" cy="140" rx="22" ry="12" fill="#ffe46b" stroke="#1b1b2f" stroke-width="3"/>`;
const tripodCam = `<path d="M0 0 L-50 150 M0 0 L50 150 M0 0 L0 150" stroke="#1b1b2f" stroke-width="8" stroke-linecap="round"/>
  <rect x="-60" y="-70" width="120" height="74" rx="12" fill="#3b3f4a" stroke="#1b1b2f" stroke-width="5"/><circle cx="0" cy="-33" r="26" fill="#9fd8ff" stroke="#1b1b2f" stroke-width="6"/><circle cx="0" cy="-33" r="10" fill="#1b1b2f"/><rect x="30" y="-84" width="24" height="16" rx="3" fill="#ff3b3b"/>`;

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t);
  const c1 = T(1) - 0.3, c2 = T(2) - 0.3, c3 = T(3) - 0.3, c4 = T(4) - 0.3;
  let s = '';
  if (t < c1) {
    const a = T(0), len = Tend(0) - a;
    s += pavement(t, t * 90);
    s += g(`translate(250 ${600 + Math.abs(Math.sin(t * 6.3)) * -6}) scale(1.3)`, pidge({ m, blink: bl, wing: 'down', headDx: bob(t), brow: 0.6 }));
    s += label(420, 260, '♪', { size: 60, fill: '#7d5bd6', op: 0.5 + 0.5 * Math.sin(t * 6) });
    if (t > a + len * 0.55) s += card(t, a + len * 0.55, 270, 170, label(0, 12, 'NOT DANCING', { size: 36, fill: '#1b1b2f', sw: 0 }), 300, 66);
    if (t > a + len * 0.85) s += label(430, 300, 'MOSTLY.', { size: 34 * pop(t, a + len * 0.85), fill: '#ffd21f', rot: 10 });
  } else if (t < c2) {
    const a = T(1);
    s += `<rect width="${W}" height="${H}" fill="#f4f0ff"/>` + [...Array(12)].map((_, i) => `<path d="M${i * 50} 0 V${H}" stroke="#e2dcf5" stroke-width="2"/>`).join('');
    s += `<rect y="560" width="${W}" height="${H - 560}" fill="#d9d2ee"/>`;
    const v = 46, bx = 60 + ((t - c1) * v) % 420;
    // head x: snaps forward every 0.9 s, then holds still
    const stepT = 0.9, n = Math.floor((t - c1) / stepT), ph = ((t - c1) % stepT) / stepT;
    const headAbs = 60 + ((n * stepT * v + (ph < 0.15 ? easeOut(ph / 0.15) : 1) * stepT * v + 10) % 420);
    const hdx = clamp(headAbs - bx, -20, 30);
    s += `<path d="M${bx + hdx} 140 V560" stroke="#7d5bd6" stroke-width="4" stroke-dasharray="10 8"/>`;
    s += g(`translate(${bx} 560) scale(1.05)`, pidge({ m, blink: bl, wing: 'down', headDx: hdx / 1.05, brow: 0.4 }));
    s += card(t, a + 0.3, 140, 140, label(0, 12, 'HEAD: STILL', { size: 28, fill: '#7d5bd6', sw: 0 }), 220, 60);
    s += card(t, a + 1.8, 400, 140, label(0, 12, 'BODY: CATCHING UP', { size: 20, fill: '#c0392b', sw: 0 }), 230, 60);
  } else if (t < c3) {
    const a = T(2), gag = Tend(2) + 0.2;
    if (t < gag) {
      s += burst(t, '#d6ecff', '#e8f4ff');
      s += g(`translate(150 360) scale(1.1)`, tripodCam);
      s += g(`translate(390 600) scale(1.05)`, pidge({ m, blink: bl, wing: 'cross', headDx: 0, brow: 0.3 }));
      s += banner(t, a + 0.4, 'STEADY CAM', '#2f7de1', 160, 320);
    } else {
      const k = prog(t, gag, gag + 2.2), bonk = t > gag + 2.2;
      s += pavement(t, k * 120) + lamp(440);
      const px = bonk ? 360 : lerp(180, 360, k);
      s += g(`translate(${px} 440) rotate(${bonk ? -8 : bob(t, 2) * 0.6}) scale(0.8)`, person(t, { shirt: '#3b3f4a', tie: '#c0392b', expr: bonk ? 'dizzy' : 'blank', hair: '#5a3825' }));
      s += g('translate(90 600) scale(0.65)', pidge({ m: 0, blink: bl, wing: 'cross', headDx: bob(t), brow: 0.8, look: 1 }));
      if (bonk) { s += label(400, 220, 'BONK!', { size: 60 * pop(t, gag + 2.2), fill: '#ffd21f', rot: -10 }); s += sparkles(t, 360, 330, 70, 6, '#ffd21f', 2); }
    }
  } else if (t < c4) {
    const a = T(3), len = Tend(3) - a, k = easeOut(prog(t, a + len * 0.25, a + len * 0.7));
    s += `<rect width="${W}" height="${H}" fill="#1f2a44"/>`;
    const cx = 270, cy = 360, R = 220, blind = 20, sweep = (360 - blind) * k;
    const p = ang => `${cx + Math.sin(ang * Math.PI / 180) * R} ${cy - Math.cos(ang * Math.PI / 180) * R}`;
    const start = blind / 2;
    if (k > 0) s += `<path d="M${cx} ${cy} L${p(180 + start)} A${R} ${R} 0 ${sweep > 180 ? 1 : 0} 1 ${p(180 + start + sweep)}Z" fill="#ffd21f" opacity=".45"/>`;
    if (k > 0.98) s += `<path d="M${cx} ${cy} L${p(180 - start)} A${R} ${R} 0 0 1 ${p(180 + start)}Z" fill="#ff3b3b" opacity=".7"/>` + label(cx, cy + R + 40, 'TINY BLIND SPOT', { size: 26, fill: '#ff8a8a' });
    s += `<circle cx="${cx}" cy="${cy}" r="48" fill="#868fa4" stroke="#1b1b2f" stroke-width="5"/><path d="M${cx - 12} ${cy - 44} L${cx} ${cy - 76} L${cx + 12} ${cy - 44}Z" fill="#3b3f4a"/>
      <circle cx="${cx - 46}" cy="${cy - 6}" r="11" fill="#ff8a1e" stroke="#1b1b2f" stroke-width="3"/><circle cx="${cx + 46}" cy="${cy - 6}" r="11" fill="#ff8a1e" stroke="#1b1b2f" stroke-width="3"/>`;
    s += card(t, a + 0.2, 270, 110, label(0, 12, 'EYES ON THE SIDES', { size: 28, fill: '#7d5bd6', sw: 0 }), 340, 60);
    s += label(cx, cy - R + 70, '~340°', { size: 40, fill: '#fff', op: k });
  } else {
    s += burst(t, '#ffd21f', '#ffe36b');
    const look = Math.sin(t * 2.5) > 0 ? 1 : -1;
    s += g('translate(270 980) scale(2.6)', pidge({ m, blink: bl, wing: 'cross', brow: 1.2, look }));
    s += banner(t, c4 + 0.5, 'JUDGING YOU', '#7d5bd6', 175, 360);
    s += endCard(t, 28);
  }
  s += flash(t, [c1, c2, c3, c4]);
  return s;
};
