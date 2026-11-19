// Character drawings. Every function returns SVG markup in local coords.
// Origin = feet / base point; characters are ~220 units tall.

// ---------- PIDGE (grumpy pigeon) ----------
function pidge(o = {}) {
  const m = o.m || 0, bl = o.blink || 0, brow = o.brow ?? 1, wing = o.wing || 'cross', look = o.look || 0;
  const eyeSy = 1 - 0.9 * bl;
  const capK = o.cap || 0;
  const wings = {
    cross: `
      <path d="M-58 -110 C-30 -70 10 -62 46 -58 C54 -57 56 -70 46 -76 C20 -88 -20 -110 -50 -128Z" fill="#6c7590" stroke="#2b2f3d" stroke-width="4"/>
      <path d="M-30 -86 C-10 -78 10 -72 30 -68" stroke="#2b2f3d" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M58 -110 C30 -70 -10 -62 -46 -58 C-54 -57 -56 -70 -46 -76 C-20 -88 20 -110 50 -128Z" fill="#7a839c" stroke="#2b2f3d" stroke-width="4"/>
      <path d="M30 -86 C10 -78 -10 -72 -30 -68" stroke="#2b2f3d" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    down: `
      <path d="M-56 -118 C-80 -90 -78 -40 -60 -22 C-50 -40 -44 -80 -46 -112Z" fill="#6c7590" stroke="#2b2f3d" stroke-width="4"/>
      <path d="M56 -118 C80 -90 78 -40 60 -22 C50 -40 44 -80 46 -112Z" fill="#6c7590" stroke="#2b2f3d" stroke-width="4"/>`,
    point: `
      <path d="M-56 -118 C-80 -90 -78 -40 -60 -22 C-50 -40 -44 -80 -46 -112Z" fill="#6c7590" stroke="#2b2f3d" stroke-width="4"/>
      <g transform="rotate(${o.pointAng ?? -30} 52 -105)"><path d="M48 -122 C90 -128 130 -118 158 -106 C164 -100 160 -92 150 -94 C120 -92 84 -88 50 -88Z" fill="#6c7590" stroke="#2b2f3d" stroke-width="4"/>
      <path d="M150 -106 l14 -6 M152 -98 l16 0 M148 -92 l14 6" stroke="#2b2f3d" stroke-width="4" stroke-linecap="round"/></g>`,
    hold: `
      <path d="M-56 -118 C-80 -90 -78 -40 -60 -22 C-50 -40 -44 -80 -46 -112Z" fill="#6c7590" stroke="#2b2f3d" stroke-width="4"/>
      <path d="M50 -120 C80 -140 96 -170 100 -196 C108 -200 114 -192 110 -184 C104 -156 88 -122 58 -96Z" fill="#6c7590" stroke="#2b2f3d" stroke-width="4"/>`,
  };
  const cap = capK > 0 ? g(`translate(${o.capX ?? 0} ${o.capY ?? -204}) rotate(${o.capRot ?? -8}) scale(${o.capS ?? 1})`, gradCap()) : '';
  return `
  <ellipse cx="0" cy="4" rx="70" ry="12" fill="rgba(0,0,0,.22)"/>
  <g stroke="#c2445a" stroke-width="7" stroke-linecap="round" fill="none">
    <path d="M-20 -14 L-20 0 M-20 0 l-14 6 M-20 0 l0 9 M-20 0 l14 6"/>
    <path d="M20 -14 L20 0 M20 0 l-14 6 M20 0 l0 9 M20 0 l14 6"/></g>
  <ellipse cx="0" cy="-72" rx="66" ry="70" fill="#97a0b4" stroke="#2b2f3d" stroke-width="5"/>
  <ellipse cx="0" cy="-58" rx="42" ry="48" fill="#b6bdcb"/>
  <defs><linearGradient id="irid" x1="0" x2="1"><stop offset="0" stop-color="#3fbf8f"/><stop offset=".5" stop-color="#7d5bd6"/><stop offset="1" stop-color="#3fbf8f"/></linearGradient></defs>
  <ellipse cx="0" cy="-126" rx="46" ry="26" fill="url(#irid)" stroke="#2b2f3d" stroke-width="5"/>
  ${wings[wing]}
  <circle cx="0" cy="-170" r="46" fill="#868fa4" stroke="#2b2f3d" stroke-width="5"/>
  <g transform="translate(${look * 5} 0)">
    <g transform="translate(0 -172) scale(1 ${eyeSy}) translate(0 172)">
      <circle cx="-18" cy="-172" r="14" fill="#ff8a1e" stroke="#2b2f3d" stroke-width="4"/>
      <circle cx="18" cy="-172" r="14" fill="#ff8a1e" stroke="#2b2f3d" stroke-width="4"/>
      <circle cx="${-18 + look * 3}" cy="-171" r="7" fill="#111"/><circle cx="${18 + look * 3}" cy="-171" r="7" fill="#111"/>
      <circle cx="${-15 + look * 3}" cy="-175" r="2.6" fill="#fff"/><circle cx="${21 + look * 3}" cy="-175" r="2.6" fill="#fff"/>
    </g>
    <path d="M-36 ${-196 + 4 * (1 - brow)} L-6 ${-186 - 6 * (1 - brow)}" stroke="#2b2f3d" stroke-width="8" stroke-linecap="round"/>
    <path d="M36 ${-196 + 4 * (1 - brow) - (o.browUp || 0)} L6 ${-186 - 6 * (1 - brow) - (o.browUp || 0)}" stroke="#2b2f3d" stroke-width="8" stroke-linecap="round"/>
  </g>
  <path d="M-9 -152 Q0 ${-146 + 16 * m} 9 -152 L0 ${-138 + 14 * m}Z" fill="#7a1d2b"/>
  <path d="M-11 -158 L11 -158 L0 ${-140 - 2 * m}Z" fill="#3b3f4a" stroke="#2b2f3d" stroke-width="2" stroke-linejoin="round"/>
  <path d="M-8 ${-150 + 3 * m} L8 ${-150 + 3 * m} L0 ${-138 + 13 * m}Z" fill="#4b505d" stroke="#2b2f3d" stroke-width="2" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-159" rx="8" ry="4.5" fill="#f2f2f2"/>
  ${cap}`;
}
function gradCap() {
  return `<path d="M-26 0 Q0 14 26 0 L26 -14 L-26 -14Z" fill="#1d1d28"/>
  <path d="M0 -36 L58 -16 L0 4 L-58 -16Z" fill="#26263a" stroke="#0e0e16" stroke-width="3"/>
  <circle cx="0" cy="-16" r="4" fill="#ffd21f"/>
  <path d="M0 -16 L40 -10 L44 18" stroke="#ffd21f" stroke-width="4" fill="none"/><rect x="39" y="16" width="10" height="16" rx="3" fill="#ffd21f"/>`;
}

// ---------- HUMAN (laughing, pointing) ----------
function human(t, o = {}) {
  const sh = Math.sin(t * 30) * 4, lean = Math.sin(t * 15) * 3;
  return g(`translate(${sh} ${Math.abs(Math.sin(t * 15)) * -8}) rotate(${lean})`, `
  <path d="M-150 260 C-150 120 -90 80 0 80 C90 80 150 120 150 260Z" fill="#2f7de1" stroke="#1b1b2f" stroke-width="6"/>
  <path d="M-40 84 L0 130 L40 84" fill="#fff" stroke="#1b1b2f" stroke-width="5"/>
  <rect x="-26" y="40" width="52" height="50" fill="#f0b98d"/>
  <circle cx="0" cy="-20" r="92" fill="#f4c49c" stroke="#1b1b2f" stroke-width="6"/>
  <path d="M-92 -30 C-100 -120 -20 -140 20 -126 C70 -130 104 -90 92 -30 C80 -70 40 -86 0 -84 C-40 -86 -76 -70 -92 -30Z" fill="#5a3825" stroke="#1b1b2f" stroke-width="6"/>
  <path d="M-58 -26 q20 -22 40 0 M18 -26 q20 -22 40 0" stroke="#1b1b2f" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M-52 14 Q0 100 52 14Z" fill="#7a1d2b" stroke="#1b1b2f" stroke-width="6" stroke-linejoin="round"/>
  <path d="M-44 18 L44 18 L40 30 L-40 30Z" fill="#fff"/>
  <ellipse cx="0" cy="56" rx="22" ry="10" fill="#ff6b81"/>
  <circle cx="-66" cy="12" r="12" fill="#ff9aa2" opacity=".6"/><circle cx="66" cy="12" r="12" fill="#ff9aa2" opacity=".6"/>
  <path d="M-70 -8 q-8 18 0 28" stroke="#5ec8ff" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M70 -8 q8 18 0 28" stroke="#5ec8ff" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M-120 150 C-160 110 -180 40 -170 -20" stroke="#2f7de1" stroke-width="58" fill="none" stroke-linecap="round"/>
  <circle cx="-172" cy="-40" r="30" fill="#f4c49c" stroke="#1b1b2f" stroke-width="5"/>
  <rect x="-182" y="-112" width="20" height="62" rx="10" fill="#f4c49c" stroke="#1b1b2f" stroke-width="5"/>`);
}

// ---------- tentacle helper ----------
function tentacle(x0, y0, ang, len, w0, t, ph, o = {}) {
  const n = 16, L = [], R = [], sk = [];
  let x = x0, y = y0, a = ang * Math.PI / 180;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n;
    const curl = (o.curl || 0) * k * k;
    const wav = Math.sin(t * (o.speed || 2.2) + ph + k * 4) * (o.amp ?? 0.35) * k;
    a += (wav + curl) / n * 3;
    pts.push([x, y, a]);
    x += Math.cos(a) * len / n; y += Math.sin(a) * len / n;
  }
  pts.forEach(([px, py, pa], i) => {
    const k = i / n, w = w0 * (1 - k * 0.88) / 2;
    L.push([px - Math.sin(pa) * w, py + Math.cos(pa) * w]);
    R.push([px + Math.sin(pa) * w, py - Math.cos(pa) * w]);
    if (i % 2 === 1 && i < n - 1) sk.push([px - Math.sin(pa) * w * 0.55, py + Math.cos(pa) * w * 0.55, w * 0.38]);
  });
  const d = 'M' + L.map(p => p.map(v => v.toFixed(1)).join(' ')).join(' L') + ' L' +
    R.reverse().map(p => p.map(v => v.toFixed(1)).join(' ')).join(' L') + 'Z';
  return `<path d="${d}" fill="${o.fill || '#b05bd6'}" stroke="#3a1850" stroke-width="4" stroke-linejoin="round"/>` +
    sk.map(([sx, sy, r]) => `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${r.toFixed(1)}" fill="#f2b6e8" stroke="#3a1850" stroke-width="1.5"/>`).join('');
}

// ---------- OCTAVIA (dramatic octopus) ----------
// pose: 'lie' (reclined, tentacles to the right), 'swim' (tentacles trailing down)
function octavia(t, o = {}) {
  const m = o.m || 0, bl = o.blink || 0, pose = o.pose || 'lie', sad = o.sad ?? 1;
  let tents = '';
  if (pose === 'lie') {
    const spec = [[-20, 10, 230, 0.25], [0, 25, 250, 0.3], [20, 5, 210, 0.2], [-40, 70, 150, 0.4], [40, 60, 160, 0.5], [60, 20, 200, 0.25]];
    spec.forEach(([dx, a, l, c], i) => tents += tentacle(dx, -40, a, l, 36, t, i * 1.3, { curl: c, amp: 0.25, speed: 1.4 }));
  } else {
    for (let i = 0; i < 7; i++) tents += tentacle(-48 + i * 16, -40, 90 + (i - 3) * 6, 190, 34, t, i, { amp: 0.6, speed: 6 });
  }
  const forehead = o.forehead ? tentacle(-62, -80, -100, 150, 30, t, 0, { curl: 3.2, amp: 0.05, speed: 1 }) : '';
  const hearts = o.hearts === false ? '' : [[-38, -58, 'g1'], [38, -58, 'g2'], [0, -50, 'main']].map(([hx, hy, id], i) => {
    const beat = 1 + 0.18 * Math.max(0, Math.sin(t * 7 + i * 0.6)) * (o.stopMain && id === 'main' ? 0 : 1);
    const s = (id === 'main' ? 1.25 : 1) * beat * (o.heartScale || 1);
    const glow = o.heartGlow ?? 0.5;
    const broken = o.broken ? `<path d="M0 -10 l-4 8 l6 6 l-5 9" stroke="#3a1850" stroke-width="2.5" fill="none"/>` : '';
    const col = o.stopMain && id === 'main' ? '#9b8aa6' : '#ff3d6e';
    return g(`translate(${hx} ${hy}) scale(${s})`, `<circle r="20" fill="#ff7aa2" opacity="${glow * 0.45}"/>
      <path d="M0 10 C-22 -4 -14 -22 0 -12 C14 -22 22 -4 0 10Z" fill="${col}" stroke="#3a1850" stroke-width="2.5"/>${broken}`);
  }).join('');
  const lid = 0.45 + 0.55 * bl;
  return `
  ${tents}
  <path d="M-92 -70 C-110 -200 -60 -270 0 -270 C60 -270 110 -200 92 -70 C70 -30 -70 -30 -92 -70Z" fill="#c26ae6" stroke="#3a1850" stroke-width="5"/>
  <ellipse cx="-36" cy="-226" rx="18" ry="11" fill="#e3a3f5" opacity=".8"/>
  <circle cx="40" cy="-210" r="7" fill="#9b4bc2" opacity=".7"/><circle cx="-60" cy="-170" r="5" fill="#9b4bc2" opacity=".7"/>
  ${hearts}
  <g>
    ${[-34, 34].map((ex, i) => `
      <ellipse cx="${ex}" cy="-150" rx="25" ry="28" fill="#fff" stroke="#3a1850" stroke-width="4"/>
      <circle cx="${ex + (i ? -4 : 4)}" cy="-140" r="14" fill="#2a1240"/><circle cx="${ex + (i ? -9 : -1)}" cy="-146" r="4.5" fill="#fff"/>
      <path d="M${ex - 27} -150 C${ex - 27} -184 ${ex + 27} -184 ${ex + 27} -150 L${ex + 27} ${-178 + 30 * lid} C${ex + 10} ${-170 + 30 * lid} ${ex - 10} ${-170 + 30 * lid} ${ex - 27} ${-178 + 30 * lid}Z" fill="#8f3fb8" stroke="#3a1850" stroke-width="4"/>
      <g stroke="#2a1240" stroke-width="4" stroke-linecap="round">
        ${[0, 1, 2].map(j => { const lx = ex + (i ? 1 : -1) * (12 + j * 8), ly = -178 + 30 * lid + 4 - j * 2; return `<path d="M${lx} ${ly} l${(i ? 1 : -1) * 6} -10"/>`; }).join('')}
      </g>`).join('')}
    ${[-34, 34].map((ex, i) => `<path d="M${ex - 20} ${-190 + (i ? -6 : 0) * sad} Q${ex} ${-204} ${ex + 20} ${-190 + (i ? 0 : -6) * sad}" stroke="#3a1850" stroke-width="6" fill="none" stroke-linecap="round"/>`).join('')}
  </g>
  <path d="M-20 ${-100 + 2 * sad} Q0 ${-108 + 12 * m - 8 * sad} 20 ${-100 + 2 * sad}" stroke="#3a1850" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="${-98 + 4 * m}" rx="${8 + 6 * m}" ry="${1 + 9 * m}" fill="#c2185b" stroke="#3a1850" stroke-width="3"/>
  <circle cx="-62" cy="-112" r="11" fill="#ff8fc7" opacity=".55"/><circle cx="62" cy="-112" r="11" fill="#ff8fc7" opacity=".55"/>
  ${o.tears ? `<path d="M-50 -122 q-6 ${18 + 30 * ((t * 1.2) % 1)} 0 ${30 + 30 * ((t * 1.2) % 1)}" stroke="#36c3ff" stroke-width="8" fill="none" stroke-linecap="round"/>
              <path d="M50 -122 q6 ${18 + 30 * ((t * 1.2 + .5) % 1)} 0 ${30 + 30 * ((t * 1.2 + .5) % 1)}" stroke="#36c3ff" stroke-width="8" fill="none" stroke-linecap="round"/>` : ''}
  ${forehead}`;
}

// ---------- CRAB with tissues ----------
function crab(t, o = {}) {
  const walk = Math.sin(t * 14) * (o.walking ? 1 : 0);
  let legs = '';
  for (let i = 0; i < 3; i++) for (const s of [-1, 1])
    legs += `<path d="M${s * (30 + i * 10)} -20 l${s * 26} ${-10 + walk * 6 * (i % 2 ? 1 : -1)} l${s * 8} 26" stroke="#b3261e" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<ellipse cx="0" cy="2" rx="60" ry="9" fill="rgba(0,0,0,.2)"/>${legs}
  <ellipse cx="0" cy="-34" rx="56" ry="36" fill="#ef4a3c" stroke="#5a1410" stroke-width="5"/>
  <path d="M-16 -66 l-4 -26 M16 -66 l4 -26" stroke="#5a1410" stroke-width="6"/>
  <circle cx="-20" cy="-96" r="12" fill="#fff" stroke="#5a1410" stroke-width="4"/><circle cx="20" cy="-96" r="12" fill="#fff" stroke="#5a1410" stroke-width="4"/>
  <circle cx="-23" cy="-94" r="5" fill="#111"/><circle cx="17" cy="-94" r="5" fill="#111"/>
  <path d="M-14 -26 q14 10 28 0" stroke="#5a1410" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M40 -40 C70 -60 70 -90 ${o.reach ? -40 : 60} -110" stroke="#ef4a3c" stroke-width="16" fill="none" stroke-linecap="round"/>
  ${g(`translate(${o.reach ? -60 : 60} -128)`, `
    <rect x="-38" y="-10" width="76" height="46" rx="6" fill="#5ab4ff" stroke="#123a66" stroke-width="4"/>
    <path d="M-14 -10 C-20 -40 6 -50 2 -30 C14 -48 26 -26 14 -10Z" fill="#fff" stroke="#9aa" stroke-width="3"/>
    <circle cx="0" cy="14" r="8" fill="#fff" opacity=".7"/>`)}
  <path d="M-40 -40 C-70 -50 -80 -80 -64 -98" stroke="#ef4a3c" stroke-width="16" fill="none" stroke-linecap="round"/>
  <path d="M-64 -98 l-14 -14 M-64 -98 l12 -16" stroke="#ef4a3c" stroke-width="12" stroke-linecap="round"/>`;
}

// ---------- SLOWMO (lazy sloth) ----------
// pose: 'hang' (origin = branch grip point), 'climb' (origin = trunk centre at chest)
function slowmo(t, o = {}) {
  const m = o.m || 0, lid = clamp(0.55 + 0.45 * (o.blink || 0) + (o.sleepy || 0) * 0.4, 0, 1), algae = o.algae || 0;
  const fur = '#a07a52', furD = '#7c5a3a', face = '#e9d3b0';
  const claws = (x, y, r = 0) => g(`translate(${x} ${y}) rotate(${r})`,
    `<path d="M-10 0 q-6 18 4 26 M0 0 q-2 20 8 26 M10 0 q2 18 12 22" stroke="#3b2a1a" stroke-width="5" fill="none" stroke-linecap="round"/>`);
  const head = (hx, hy) => `
    <circle cx="${hx}" cy="${hy}" r="62" fill="${fur}" stroke="#3b2a1a" stroke-width="5"/>
    <ellipse cx="${hx}" cy="${hy + 6}" rx="50" ry="42" fill="${face}"/>
    ${[-1, 1].map(s => `<path d="M${hx + s * 6} ${hy - 6} C${hx + s * 22} ${hy - 22} ${hx + s * 50} ${hy - 6} ${hx + s * 46} ${hy + 14} C${hx + s * 36} ${hy + 22} ${hx + s * 16} ${hy + 10} ${hx + s * 6} ${hy - 6}Z" fill="#5a3f27"/>`).join('')}
    ${[-1, 1].map(s => `<g>
       <circle cx="${hx + s * 26}" cy="${hy}" r="10" fill="#1b120a"/><circle cx="${hx + s * 23}" cy="${hy - 3}" r="3" fill="#fff"/>
       <path d="M${hx + s * 26 - 13} ${hy - 1} C${hx + s * 26 - 13} ${hy - 16} ${hx + s * 26 + 13} ${hy - 16} ${hx + s * 26 + 13} ${hy - 1} L${hx + s * 26 + 13} ${hy - 13 + 14 * lid} L${hx + s * 26 - 13} ${hy - 13 + 14 * lid}Z" fill="#5a3f27"/>
       <path d="M${hx + s * 26 - 12} ${hy - 13 + 14 * lid} L${hx + s * 26 + 12} ${hy - 13 + 14 * lid}" stroke="#1b120a" stroke-width="3" stroke-linecap="round"/></g>`).join('')}
    <ellipse cx="${hx}" cy="${hy + 16}" rx="10" ry="7" fill="#2a1a0e"/>
    <path d="M${hx - 16} ${hy + 30} Q${hx} ${hy + 40 + 8 * m} ${hx + 16} ${hy + 30}" stroke="#2a1a0e" stroke-width="4" fill="${m > 0.15 ? '#7a2b2b' : 'none'}" stroke-linecap="round"/>
    ${algaePatches(hx, hy - 30, 50, algae, t, 3)}`;
  if ((o.pose || 'hang') === 'hang') {
    const sway = Math.sin(t * 0.9) * 4;
    return g(`rotate(${sway})`, `
      <path d="M-40 0 C-50 60 -50 110 -40 150" stroke="${fur}" stroke-width="34" fill="none" stroke-linecap="round"/>
      <path d="M40 0 C50 60 50 110 40 150" stroke="${fur}" stroke-width="34" fill="none" stroke-linecap="round"/>
      ${claws(-40, -14, 180)}${claws(40, -14, 180)}
      <ellipse cx="0" cy="230" rx="78" ry="100" fill="${fur}" stroke="#3b2a1a" stroke-width="5"/>
      <path d="M-50 200 q10 20 0 40 M50 210 q-10 20 0 40 M-20 280 q6 14 0 26 M24 270 q-6 14 0 26" stroke="${furD}" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${algaePatches(0, 230, 70, algae, t, 7)}
      ${o.cup ? g(`translate(70 220) rotate(${Math.sin(t) * 3})`, `<path d="M-60 -40 C-20 -10 0 0 0 0" stroke="${fur}" stroke-width="28" fill="none" stroke-linecap="round"/>
        <rect x="-4" y="-36" width="44" height="50" rx="6" fill="#fff" stroke="#3b2a1a" stroke-width="4"/>
        <rect x="-4" y="-22" width="44" height="16" fill="#e2572b"/>
        <path d="M40 -26 q16 0 16 14 q0 12 -16 12" stroke="#3b2a1a" stroke-width="4" fill="none"/>
        <path d="M8 -46 q-6 -10 2 -18 M22 -46 q-6 -10 2 -18" stroke="#fff" stroke-width="4" fill="none" opacity="${0.5 + 0.5 * Math.sin(t * 3)}"/>`) : ''}
      ${head(0, 118)}`);
  }
  // climb pose: hugging a vertical trunk (trunk drawn by scene behind)
  return `
    <ellipse cx="0" cy="60" rx="74" ry="96" fill="${fur}" stroke="#3b2a1a" stroke-width="5"/>
    ${algaePatches(0, 60, 66, algae, t, 7)}
    <path d="M-60 -10 C-90 -40 -80 -90 -40 -110" stroke="${fur}" stroke-width="30" fill="none" stroke-linecap="round"/>
    <path d="M60 -10 C90 -30 84 -70 46 -84" stroke="${fur}" stroke-width="30" fill="none" stroke-linecap="round"/>
    ${claws(-40, -114, 120)}${claws(46, -90, -120)}
    <path d="M-50 130 C-80 150 -70 190 -36 200" stroke="${fur}" stroke-width="30" fill="none" stroke-linecap="round"/>
    <path d="M50 130 C80 150 70 190 36 200" stroke="${fur}" stroke-width="30" fill="none" stroke-linecap="round"/>
    ${o.tp ? g('translate(60 150)', `<rect x="-20" y="-16" width="40" height="32" rx="6" fill="#fff" stroke="#888" stroke-width="3"/><ellipse cx="-20" cy="0" rx="6" ry="16" fill="#eee" stroke="#888" stroke-width="3"/><circle cx="-20" cy="0" r="4" fill="#bbb"/>`) : ''}
    ${head(0, -20)}`;
}
function algaePatches(cx, cy, r, k, t, n) {
  if (k <= 0) return '';
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = rnd(i * 3.1 + n) * Math.PI * 2, d = r * (0.2 + 0.6 * rnd(i + 9 + n));
    const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d, sz = (10 + 14 * rnd(i + 2)) * clamp(k * 1.6 - i * 0.08);
    s += `<circle cx="${x}" cy="${y}" r="${Math.max(0, sz)}" fill="#5fae3b" opacity=".75"/>`;
    if (k > 0.55 && i % 2 === 0) {
      const h = 22 * clamp((k - 0.55) * 3);
      s += `<path d="M${x} ${y} q-2 ${-h / 2} 0 ${-h}" stroke="#3f8f2a" stroke-width="3" fill="none"/><ellipse cx="${x + 5}" cy="${y - h}" rx="7" ry="4" fill="#4fbf3a" transform="rotate(-30 ${x + 5} ${y - h})"/>`;
      if (i % 4 === 0) s += `<circle cx="${x}" cy="${y - h - 4}" r="${5 * clamp((k - 0.7) * 4)}" fill="#ff7ab6"/>`;
    }
  }
  return s;
}
