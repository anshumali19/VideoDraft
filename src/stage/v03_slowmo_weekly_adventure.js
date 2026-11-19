// Video 3: Slowmo's Weekly Adventure
window.META = { name: 'SLOWMO', color: '#a07a52' };

function jungle(t, skyK = null) {
  // skyK: 0..1 day/night phase override (for the "time flies" gag)
  let top = '#7fd6a0', bot = '#2f8f5b';
  if (skyK !== null) {
    const d = 0.5 + 0.5 * Math.cos(skyK * Math.PI * 2);
    top = `rgb(${Math.round(lerp(20, 127, d))},${Math.round(lerp(30, 214, d))},${Math.round(lerp(70, 160, d))})`;
    bot = `rgb(${Math.round(lerp(10, 47, d))},${Math.round(lerp(40, 143, d))},${Math.round(lerp(50, 91, d))})`;
  }
  let s = `<defs><linearGradient id="jg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#jg)"/>`;
  if (skyK !== null) {
    const a = skyK * Math.PI * 2;
    s += `<circle cx="${270 + Math.sin(a) * 220}" cy="${330 - Math.cos(a) * 200}" r="34" fill="#ffe46b"/>`;
    s += `<circle cx="${270 - Math.sin(a) * 220}" cy="${330 + Math.cos(a) * 200}" r="28" fill="#f2f2ff"/>`;
  }
  for (let i = 0; i < 16; i++) {
    const x = rnd(i) * W, y = 120 + rnd(i + 4) * 520, r = 40 + rnd(i + 8) * 50;
    s += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.55}" fill="${['#2e7d4f', '#3b9a5f', '#24683f'][i % 3]}" opacity=".55" transform="rotate(${rnd(i + 1) * 60 - 30} ${x} ${y})"/>`;
  }
  for (let i = 0; i < 3; i++) { const x = 40 + i * 230;
    s += `<path d="M${x} 0 C${x + 20 + Math.sin(t + i) * 10} 150 ${x - 20} 300 ${x + 10} 420" stroke="#2b6b3a" stroke-width="6" fill="none"/>`; }
  s += `<path d="M0 590 Q270 560 540 590 V${H} H0Z" fill="#5a3f27"/><path d="M0 610 Q270 590 540 615 V${H} H0Z" fill="#6b4a2e"/>`;
  return s;
}
const branch = y => `<path d="M-20 ${y + 10} C150 ${y - 10} 380 ${y + 14} 560 ${y - 4}" stroke="#6b4a2e" stroke-width="40" fill="none" stroke-linecap="round"/>
  <path d="M-20 ${y + 10} C150 ${y - 10} 380 ${y + 14} 560 ${y - 4}" stroke="#86603c" stroke-width="12" fill="none" opacity=".6"/>
  <ellipse cx="120" cy="${y - 22}" rx="30" ry="14" fill="#3b9a5f"/><ellipse cx="430" cy="${y - 24}" rx="34" ry="14" fill="#2e7d4f"/>`;

function clock(t, x, y, r, speed) {
  const a1 = t * speed * 360, a2 = t * speed * 30;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#1b1b2f" stroke-width="6"/>
    ${[...Array(12)].map((_, i) => { const a = i * Math.PI / 6; return `<circle cx="${x + Math.sin(a) * r * 0.8}" cy="${y - Math.cos(a) * r * 0.8}" r="3" fill="#1b1b2f"/>`; }).join('')}
    <line x1="${x}" y1="${y}" x2="${x + Math.sin(a2 * Math.PI / 180) * r * 0.5}" y2="${y - Math.cos(a2 * Math.PI / 180) * r * 0.5}" stroke="#1b1b2f" stroke-width="7" stroke-linecap="round"/>
    <line x1="${x}" y1="${y}" x2="${x + Math.sin(a1 * Math.PI / 180) * r * 0.75}" y2="${y - Math.cos(a1 * Math.PI / 180) * r * 0.75}" stroke="#ff3b3b" stroke-width="5" stroke-linecap="round"/>
    <circle cx="${x}" cy="${y}" r="6" fill="#1b1b2f"/>`;
}
function trunk() {
  return `<rect x="200" y="0" width="140" height="620" fill="#7a5434" stroke="#3b2a1a" stroke-width="6"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${215 + (i % 3) * 40} ${40 + i * 95} q10 30 0 60" stroke="#5a3d24" stroke-width="5" fill="none"/>`).join('')}`;
}
function weekCal(t, at) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return card(t, at, 270, 190, label(0, -42, 'POOP SCHEDULE', { size: 24, fill: '#7c5a3a', sw: 0 }) +
    days.map((d, i) => { const x = -180 + i * 60, on = i === 4;
      return `<rect x="${x - 25}" y="-24" width="50" height="62" rx="10" fill="${on ? '#fff3b0' : '#f1ece4'}" stroke="#1b1b2f" stroke-width="3"/>` +
        label(x, 4, d, { size: 24, fill: '#1b1b2f', sw: 0 }) + (on && t > at + 0.6 ? emoji(x, 22, '🧻', 26) : ''); }).join(''), 450, 130);
}
function butterfly(t, x, y) {
  const f = Math.abs(Math.sin(t * 12));
  return `<g transform="translate(${x} ${y})"><ellipse cx="${-12 * f}" cy="-4" rx="${14 * f + 2}" ry="12" fill="#ff7ab6" stroke="#1b1b2f" stroke-width="2"/>
    <ellipse cx="${12 * f}" cy="-4" rx="${14 * f + 2}" ry="12" fill="#ffb84d" stroke="#1b1b2f" stroke-width="2"/><rect x="-2" y="-14" width="4" height="22" rx="2" fill="#1b1b2f"/></g>`;
}

window.SCENE = function (t) {
  const m = mouth(t), bl = blink(t, 1);
  const cB = 4.9, cC = 10.5, cD = 17.75, cE = 23.8;
  let s = '';
  if (t < cB) {
    const a = T(0), len = Tend(0) - a;
    s += jungle(t) + clock(t, 430, 380, 62, 3) + branch(200);
    s += g('translate(250 200) scale(0.95)', slowmo(t, { m, blink: bl, cup: true }));
    const thu = t > a + len * 0.62;
    s += card(t, a + len * 0.35, 110, 340, `<rect x="-55" y="-60" width="110" height="34" rx="8" fill="#ff5a4e"/>` +
      label(0, 22, thu ? 'THU?' : 'TUE?', { size: 40, fill: '#1b1b2f', sw: 0 }), 110, 120);
  } else if (t < cC) {
    const k = prog(t, cB, cC);
    s += jungle(t, k * 3) + trunk();
    s += clock(t, 450, 470, 46, 6);
    s += g(`translate(270 ${lerp(250, 300, k)}) scale(0.95)`, slowmo(t, { m, blink: bl, pose: 'climb', tp: true }));
    s += g(`translate(270 120) scale(${pop(t, cB + 0.3)}) rotate(-4)`, `<rect x="-200" y="-40" width="400" height="80" rx="18" fill="#ffb84d" stroke="#1b1b2f" stroke-width="6"/>` + label(0, 16, 'BIG ADVENTURE', { size: 40, sw: 8 }));
    s += label(90, 520, 'DAY 1... DAY 2...', { size: 22, fill: '#fff', rot: -8, op: clamp(k * 3) });
  } else if (t < cD) {
    const a = T(2), len = Tend(2) - a, k = prog(t, cC, cD);
    s += jungle(t) + trunk();
    s += weekCal(t, cC + 0.3);
    s += g(`translate(270 ${lerp(330, 405, easeInOut(k))}) scale(0.9)`, slowmo(t, { m, blink: bl, pose: 'climb', tp: true }));
    s += label(270, 330, 'ONCE A WEEK!', { size: 40 * pop(t, a + len * 0.25), fill: '#ffd21f', rot: -5 });
    if (t > a + len * 0.72) s += g(`translate(450 470) scale(${pop(t, a + len * 0.72)})`, clock(t, 0, 0, 48, 8) + label(0, 82, 'HOURS', { size: 28, fill: '#fff' }));
  } else if (t < cE) {
    const a = T(3), len = Tend(3) - a, alg = easeInOut(prog(t, a + 0.3, a + len * 0.85));
    s += jungle(t) + branch(140);
    s += g('translate(270 140) scale(1.25)', slowmo(t, { m, blink: bl, algae: alg }));
    if (t > a + len * 0.7) {
      s += butterfly(t, 120 + Math.sin(t * 1.5) * 40, 300 + Math.cos(t * 2) * 30);
      s += g(`translate(270 250) scale(${pop(t, a + len * 0.7)}) rotate(-4)`, `<rect x="-215" y="-40" width="430" height="80" rx="18" fill="#5fae3b" stroke="#1b1b2f" stroke-width="6"/>` + label(0, 16, 'WALKING GARDEN', { size: 40, sw: 8 }));
    }
  } else {
    const a = T(4), len = Tend(4) - a, sleepy = prog(t, a + len * 0.85, a + len * 1.1);
    s += jungle(t) + branch(200);
    s += g('translate(250 200) scale(0.95)', slowmo(t, { m, blink: bl, sleepy, algae: 1 }));
    s += card(t, a + len * 0.55, 420, 370, label(0, -22, 'PLANS', { size: 26, fill: '#ff5a4e', sw: 0 }) + label(0, 20, 'NEXT WEEK', { size: 24, fill: '#1b1b2f', sw: 0 }), 170, 110);
    if (sleepy > 0) ['Z', 'z', 'Z'].forEach((z, i) => { const ph = (t * 0.6 + i / 3) % 1;
      s += label(330 + ph * 60, 300 - ph * 120, z, { size: 30 + i * 6, fill: '#fff', op: Math.sin(ph * Math.PI) * clamp(sleepy * 2) }); });
    if (t > 28.6) s += g(`translate(270 860) scale(${pop(t, 28.6, 0.3)})`,
      `<rect x="-200" y="-36" width="400" height="72" rx="36" fill="#ff2d55" stroke="#1b1b2f" stroke-width="5"/>` + label(0, 14, 'FOLLOW FOR MORE!', { size: 34, sw: 7 }));
  }
  s += flash(t, [cB, cC, cD, cE]);
  return s;
};
