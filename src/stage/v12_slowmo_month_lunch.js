// Video 12: Slowmo's One-Month Lunch
window.META = { name: 'SLOWMO', color: '#a07a52' };

function calendarPage(day, month, x, y, s = 1, rot = 0) {
  return g(`translate(${x} ${y}) rotate(${rot}) scale(${s})`, `<rect x="-110" y="-120" width="220" height="240" rx="16" fill="#fff" stroke="#1b1b2f" stroke-width="6"/>
    <rect x="-110" y="-120" width="220" height="62" rx="16" fill="#ff5a4e"/><rect x="-110" y="-74" width="220" height="16" fill="#ff5a4e"/>
    ${label(0, -76, month, { size: 32, sw: 6 })}${label(0, 70, String(day), { size: 110, fill: '#1b1b2f', sw: 0 })}
    <circle cx="-60" cy="-120" r="9" fill="#1b1b2f"/><circle cx="60" cy="-120" r="9" fill="#1b1b2f"/>`);
}
function microbe(t, x, y, c, i) {
  const wob = Math.sin(t * 4 + i) * 4;
  return `<g transform="translate(${x + wob} ${y + Math.cos(t * 3 + i) * 4})"><ellipse rx="16" ry="12" fill="${c}" stroke="#1b1b2f" stroke-width="3"/>
    <circle cx="-5" cy="-2" r="3" fill="#1b1b2f"/><circle cx="5" cy="-2" r="3" fill="#1b1b2f"/><path d="M-5 5 q5 4 10 0" stroke="#1b1b2f" stroke-width="2" fill="none"/></g>`;
}

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t, 1);
  const c1 = T(1) - 0.3, c2 = T(2) - 0.3, c3 = T(3) - 0.3, c4 = T(4) - 0.3;
  let s = '';
  if (t < c1) {
    const a = T(0), len = Tend(0) - a;
    s += jungle(t) + branch(200);
    s += g('translate(200 200) scale(0.95)', slowmo(t, { m, blink: bl, leaf: t < a + len * 0.6 }));
    if (t < a + len * 0.6) s += label(330, 330, 'CHOMP', { size: 34, fill: '#ffd21f', rot: 10, op: Math.abs(Math.sin(t * 3)) });
    if (t > a + len * 0.45) s += card(t, a + len * 0.45, 410, 420, label(0, -24, 'CHECK BACK', { size: 26, fill: '#1b1b2f', sw: 0 }) + label(0, 24, 'IN 1 MONTH', { size: 32, fill: '#c0392b', sw: 0 }), 210, 120);
  } else if (t < c2) {
    const a = T(1), k = prog(t, c1 + 0.3, c2 - 0.3);
    s += burst(t * 0.3, '#ffe8c2', '#fff3dc');
    const months = ['MARCH', 'APRIL', 'MAY'], total = Math.floor(k * 42), day = total % 30 + 1, mon = months[Math.min(2, Math.floor(total / 30))];
    for (let i = 0; i < 3; i++) { const ph = ((t * 7) + i / 3) % 1; s += calendarPage('', '', 270 + ph * 300, 330 - ph * 260, 1.1 - ph * 0.4, ph * 70).replace(/opacity="1"/, `opacity="${1 - ph}"`); }
    s += calendarPage(day, mon, 270, 330, 1.2);
    s += g('translate(80 410) scale(0.4)', slowmo(t, { m, blink: bl, pose: 'climb' }));
    s += banner(t, a + (Tend(1) - a) * 0.5, 'WEEKS!', '#ff5a4e', 545, 260, 44);
  } else if (t < c3) {
    const a = T(2), len = Tend(2) - a;
    s += jungle(t);
    s += g('translate(270 -40) scale(1.6)', slowmo(t, { m, blink: bl }));
    // stomach overlay on the belly
    s += `<path d="M190 300 C150 300 140 380 190 400 C230 420 260 380 300 400 C350 420 380 360 350 320 C320 290 280 320 250 300 C230 290 210 296 190 300Z" fill="#ff9fb6" stroke="#1b1b2f" stroke-width="5" opacity=".95"/>`;
    s += [[200, 350, '#7ccf6a'], [250, 370, '#ffd21f'], [300, 360, '#7fe0ff'], [330, 335, '#7ccf6a'], [230, 330, '#c5a3ff']].map(([x, y, c], i) => t > a + len * 0.55 ? microbe(t, x, y, c, i) : '').join('');
    s += card(t, a + 0.2, 270, 120, label(0, 12, 'BIG, SLOW STOMACH', { size: 30, fill: '#c0392b', sw: 0 }), 360, 60);
    if (t > a + len * 0.6) s += card(t, a + len * 0.6, 420, 470, label(0, 10, 'MICROBES', { size: 26, fill: '#3f7f2a', sw: 0 }), 170, 52, '#eaffd9');
  } else if (t < c4) {
    const a = T(3), len = Tend(3) - a, pct = Math.floor(1 + prog(t, a, c4) * 2);
    s += jungle(t) + branch(200);
    s += g('translate(270 200) scale(0.85)', slowmo(t, { m, blink: bl, sleepy: 0.3 }));
    s += g('translate(270 520)', `<rect x="-200" y="-26" width="400" height="52" rx="26" fill="#fff" stroke="#1b1b2f" stroke-width="5"/>
      <rect x="-194" y="-20" width="${388 * pct / 100 + 14}" height="40" rx="20" fill="#2fbf4a"/>` + label(0, 12, `LUNCH: ${pct}%`, { size: 28, fill: '#1b1b2f', sw: 0 }));
    s += card(t, a + 0.4, 400, 160, label(0, 12, 'IN PROGRESS', { size: 26, fill: '#a07a52', sw: 0 }), 210, 56);
    if (t > a + len * 0.7) s += card(t, a + len * 0.7, 120, 420, emoji(0, 0, '🍃', 40) + label(0, 46, 'GOOD LEAF', { size: 16, fill: '#3f7f2a', sw: 0 }), 120, 110, '#eaffd9');
  } else {
    const a = T(4), burp = prog(t, c4 + 0.2, c4 + 1.4);
    s += jungle(t) + branch(200);
    s += g('translate(220 200) scale(0.95)', slowmo(t, { m, blink: bl }));
    if (burp > 0) s += g(`translate(330 ${300 - burp * 40}) scale(${0.4 + burp * 0.8})`, `<g fill="#e8f7e0" stroke="#1b1b2f" stroke-width="3" opacity="${1 - burp * 0.4}"><circle r="34"/><circle cx="34" cy="-10" r="26"/><circle cx="-28" cy="-14" r="22"/></g>` + label(4, 8, 'burp', { size: 22, fill: '#3f7f2a', sw: 0 }));
    s += banner(t, a + 1.0, 'DO NOT RUSH ME', '#a07a52', 520, 400, 40);
    s += endCard(t, 28.9);
  }
  s += flash(t, [c1, c2, c3, c4]);
  return s;
};
