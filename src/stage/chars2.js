// Supporting cast + props for videos 4-15.

// ---------- COW (shocked, holding a bottle) ----------
function cow(t, o = {}) {
  const shock = o.shock ?? 1;
  return `<ellipse cx="0" cy="6" rx="110" ry="14" fill="rgba(0,0,0,.2)"/>
  <rect x="-90" y="-170" width="180" height="176" rx="70" fill="#fff" stroke="#1b1b2f" stroke-width="5"/>
  <path d="M-80 -120 q30 -20 40 20 q-20 30 -40 10Z M40 -60 q40 -10 40 30 q-30 20 -50 0Z" fill="#1b1b2f"/>
  <path d="M-60 -170 C-110 -190 -120 -260 -80 -300 L80 -300 C120 -260 110 -190 60 -170Z" fill="#fff" stroke="#1b1b2f" stroke-width="5"/>
  <path d="M-80 -296 q-30 -30 -10 -50 q16 20 30 40 M80 -296 q30 -30 10 -50 q-16 20 -30 40" fill="#f2e3c6" stroke="#1b1b2f" stroke-width="4"/>
  <ellipse cx="-104" cy="-270" rx="30" ry="14" fill="#fff" stroke="#1b1b2f" stroke-width="4" transform="rotate(-25 -104 -270)"/>
  <ellipse cx="104" cy="-270" rx="30" ry="14" fill="#fff" stroke="#1b1b2f" stroke-width="4" transform="rotate(25 104 -270)"/>
  ${[-34, 34].map(x => `<circle cx="${x}" cy="-255" r="${16 + 6 * shock}" fill="#fff" stroke="#1b1b2f" stroke-width="4"/><circle cx="${x}" cy="-255" r="${7 - 2 * shock}" fill="#1b1b2f"/>`).join('')}
  <ellipse cx="0" cy="-196" rx="64" ry="40" fill="#ffb3c1" stroke="#1b1b2f" stroke-width="5"/>
  <ellipse cx="-22" cy="-200" rx="7" ry="10" fill="#1b1b2f"/><ellipse cx="22" cy="-200" rx="7" ry="10" fill="#1b1b2f"/>
  <ellipse cx="0" cy="-174" rx="${10 + 8 * shock}" ry="${4 + 12 * shock}" fill="#7a1d2b"/>
  <path d="M90 -110 C130 -120 140 -150 130 -180" stroke="#fff" stroke-width="30" fill="none" stroke-linecap="round"/>
  <path d="M90 -110 C130 -120 140 -150 130 -180" stroke="#1b1b2f" stroke-width="5" fill="none" stroke-dasharray="0" opacity=".0"/>
  ${o.bottle !== false ? g('translate(130 -200) rotate(10)', `<rect x="-18" y="-50" width="36" height="80" rx="10" fill="#fff" stroke="#1b1b2f" stroke-width="4"/>
     <rect x="-18" y="-20" width="36" height="50" rx="8" fill="#f4f4f4"/><path d="M-10 -50 h20 l-4 -20 h-12Z" fill="#ffb3c1" stroke="#1b1b2f" stroke-width="3"/>` + label(0, 14, 'MILK', { size: 14, fill: '#2f7de1', sw: 0 })) : ''}`;
}

// ---------- BABY PIGEON (squab) ----------
function squab(t, o = {}) {
  const m = o.m || 0;
  return `<ellipse cx="0" cy="-34" rx="40" ry="36" fill="#f2d27a" stroke="#2b2f3d" stroke-width="4"/>
  ${[...Array(7)].map((_, i) => `<path d="M${-30 + i * 10} -66 q4 -14 ${-2 + (i % 2) * 6} -20" stroke="#f7e3a5" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')}
  <circle cx="-12" cy="-44" r="6" fill="#1b1b2f"/><circle cx="12" cy="-44" r="6" fill="#1b1b2f"/>
  <path d="M-10 -30 L10 -30 L0 ${-14 - 14 * m}Z" fill="#7a1d2b" stroke="#2b2f3d" stroke-width="3"/>
  <path d="M-12 -34 L12 -34 L0 -26Z" fill="#3b3f4a"/>`;
}

// ---------- PERSON (generic cartoon human) ----------
// o: shirt, hair, skin, expr ('shock'|'nervous'|'blank'|'dizzy'), tie, coat, glasses, phone, cap(tourist hat)
function person(t, o = {}) {
  const skin = o.skin || '#f4c49c', shirt = o.shirt || '#ef6c3a', hair = o.hair || '#2b1d14', expr = o.expr || 'blank';
  const eyes = {
    shock: `<circle cx="-30" cy="-30" r="16" fill="#fff" stroke="#1b1b2f" stroke-width="4"/><circle cx="30" cy="-30" r="16" fill="#fff" stroke="#1b1b2f" stroke-width="4"/><circle cx="-30" cy="-30" r="5" fill="#1b1b2f"/><circle cx="30" cy="-30" r="5" fill="#1b1b2f"/>`,
    nervous: `<circle cx="-30" cy="-28" r="7" fill="#1b1b2f"/><circle cx="30" cy="-28" r="7" fill="#1b1b2f"/><path d="M-44 -50 l24 8 M44 -50 l-24 8" stroke="#1b1b2f" stroke-width="6" stroke-linecap="round"/>`,
    blank: `<circle cx="-30" cy="-28" r="7" fill="#1b1b2f"/><circle cx="30" cy="-28" r="7" fill="#1b1b2f"/>`,
    dizzy: `<path d="M-40 -38 l20 20 M-20 -38 l-20 20 M20 -38 l20 20 M40 -38 l-20 20" stroke="#1b1b2f" stroke-width="6" stroke-linecap="round"/>`,
  }[expr];
  const mouthS = { shock: `<ellipse cx="0" cy="22" rx="16" ry="22" fill="#7a1d2b" stroke="#1b1b2f" stroke-width="4"/>`,
    nervous: `<path d="M-22 24 q8 -8 14 0 q8 8 14 0 q8 -8 14 0" stroke="#1b1b2f" stroke-width="5" fill="none"/>`,
    blank: `<path d="M-16 22 h32" stroke="#1b1b2f" stroke-width="5" stroke-linecap="round"/>`,
    dizzy: `<path d="M-16 26 q16 -14 32 0" stroke="#1b1b2f" stroke-width="5" fill="none"/>` }[expr];
  return `
  <path d="M-130 260 C-130 120 -80 84 0 84 C80 84 130 120 130 260Z" fill="${o.coat ? '#fff' : shirt}" stroke="#1b1b2f" stroke-width="6"/>
  ${o.coat ? `<path d="M-30 86 L0 200 L30 86Z" fill="${shirt}" stroke="#1b1b2f" stroke-width="4"/><path d="M0 200 V260" stroke="#1b1b2f" stroke-width="4"/>` : ''}
  ${o.tie ? `<path d="M-12 92 L12 92 L18 190 L0 210 L-18 190Z" fill="${o.tie}" stroke="#1b1b2f" stroke-width="4"/><path d="M-36 86 L-12 92 L-20 110Z M36 86 L12 92 L20 110Z" fill="#fff" stroke="#1b1b2f" stroke-width="3"/>` : ''}
  <rect x="-24" y="44" width="48" height="46" fill="${skin}"/>
  <circle cx="0" cy="-20" r="86" fill="${skin}" stroke="#1b1b2f" stroke-width="6"/>
  <path d="M-86 -30 C-94 -112 -20 -130 20 -118 C66 -122 98 -86 86 -30 C74 -66 40 -80 0 -78 C-40 -80 -72 -66 -86 -30Z" fill="${hair}" stroke="#1b1b2f" stroke-width="6"/>
  ${o.cap ? `<path d="M-90 -60 Q0 -150 90 -60Z" fill="#ffd21f" stroke="#1b1b2f" stroke-width="5"/><path d="M-120 -58 H110" stroke="#1b1b2f" stroke-width="8" stroke-linecap="round"/>` : ''}
  ${eyes}${mouthS}
  ${o.glasses ? `<g fill="none" stroke="#1b1b2f" stroke-width="5"><circle cx="-30" cy="-28" r="20"/><circle cx="30" cy="-28" r="20"/><path d="M-10 -28 h20"/></g>` : ''}
  ${o.sweat ? `<path d="M64 -66 q-12 20 0 28 q12 -8 0 -28Z" fill="#7fd0ff" stroke="#1b1b2f" stroke-width="3"/>` : ''}
  ${o.phone ? g('translate(-60 150) rotate(-10)', `<path d="M0 60 C-10 20 -30 0 -30 -20" stroke="${o.coat ? '#fff' : shirt}" stroke-width="40" stroke-linecap="round" fill="none"/>
     <rect x="-56" y="-80" width="64" height="110" rx="10" fill="#1b1b2f"/><rect x="-50" y="-72" width="52" height="88" rx="4" fill="${o.phone === 'dead' ? '#333' : '#9fd8ff'}"/>
     ${o.phone === 'dead' ? `<rect x="-38" y="-38" width="26" height="14" fill="none" stroke="#ff3b3b" stroke-width="3"/><rect x="-36" y="-36" width="3" height="10" fill="#ff3b3b"/>` + label(-24, 4, '0%', { size: 14, fill: '#ff3b3b', sw: 0 }) : ''}
     <circle cx="-24" cy="16" r="18" fill="${skin}" stroke="#1b1b2f" stroke-width="4"/>`) : ''}`;
}

// ---------- FISH ----------
function fish(t, o = {}) {
  const c = o.color || '#ffb03b', wag = Math.sin(t * 10) * 10;
  return `<path d="M40 0 L${78} ${-26 + wag} L${78} ${26 + wag}Z" fill="${c}" stroke="#1b1b2f" stroke-width="4" stroke-linejoin="round"/>
  <ellipse cx="0" cy="0" rx="52" ry="34" fill="${c}" stroke="#1b1b2f" stroke-width="5"/>
  <path d="M-4 -30 q14 14 0 60" stroke="#1b1b2f" stroke-width="3" fill="none" opacity=".35"/>
  <circle cx="-26" cy="-8" r="10" fill="#fff" stroke="#1b1b2f" stroke-width="3"/><circle cx="-28" cy="-7" r="5" fill="#1b1b2f"/>
  <path d="M-48 10 q8 6 14 0" stroke="#1b1b2f" stroke-width="3" fill="none"/>
  ${o.guard ? `<path d="M-40 -30 Q-10 -62 26 -32Z" fill="#1d3b8a" stroke="#1b1b2f" stroke-width="4"/><path d="M-54 -30 H30" stroke="#1b1b2f" stroke-width="7" stroke-linecap="round"/><circle cx="-8" cy="-42" r="6" fill="#ffd21f"/>
    ${o.whistle ? `<rect x="-76" y="4" width="26" height="12" rx="4" fill="#c0c0c0" stroke="#1b1b2f" stroke-width="3"/>` : ''}` : ''}
  ${o.clap ? `<path d="M-6 16 l-16 ${18 + 8 * Math.sin(t * 20)} M6 16 l16 ${18 + 8 * Math.sin(t * 20)}" stroke="${c}" stroke-width="10" stroke-linecap="round"/>` : ''}`;
}

// ---------- TORTOISE ----------
function tortoise(t, o = {}) {
  return `<ellipse cx="0" cy="4" rx="100" ry="12" fill="rgba(0,0,0,.2)"/>
  <rect x="-70" y="-30" width="26" height="34" rx="10" fill="#9bbf6a" stroke="#1b1b2f" stroke-width="4"/><rect x="44" y="-30" width="26" height="34" rx="10" fill="#9bbf6a" stroke="#1b1b2f" stroke-width="4"/>
  <path d="M-90 -20 C-90 -110 90 -110 90 -20Z" fill="#8a6a3a" stroke="#1b1b2f" stroke-width="5"/>
  <path d="M-40 -70 l20 -16 h40 l20 16 l-20 18 h-40Z M-80 -30 l30 -30 M80 -30 l-30 -30" fill="#a8844b" stroke="#1b1b2f" stroke-width="3"/>
  <path d="M-86 -40 C-120 -60 -140 -60 -150 -40" stroke="#9bbf6a" stroke-width="30" stroke-linecap="round" fill="none"/>
  <circle cx="-150" cy="-60" r="30" fill="#9bbf6a" stroke="#1b1b2f" stroke-width="4"/>
  <circle cx="-160" cy="-68" r="${o.shock ? 12 : 8}" fill="#fff" stroke="#1b1b2f" stroke-width="3"/><circle cx="-162" cy="-68" r="4" fill="#1b1b2f"/>
  ${o.shock ? `<ellipse cx="-168" cy="-46" rx="7" ry="9" fill="#7a1d2b"/>` : `<path d="M-174 -48 h14" stroke="#1b1b2f" stroke-width="3"/>`}`;
}

// ---------- small BIRD ----------
function birdie(t, o = {}) {
  const faint = o.faint || 0;
  return g(`rotate(${faint * -80} 0 0)`, `
  <ellipse cx="0" cy="-34" rx="34" ry="30" fill="#4fb3ff" stroke="#1b1b2f" stroke-width="4"/>
  <path d="M30 -40 l26 4 l-26 8Z" fill="#ffb03b" stroke="#1b1b2f" stroke-width="3"/>
  ${faint > 0.5 ? `<path d="M6 -50 l12 12 M18 -50 l-12 12" stroke="#1b1b2f" stroke-width="4"/>` : `<circle cx="14" cy="-44" r="9" fill="#fff" stroke="#1b1b2f" stroke-width="3"/><circle cx="16" cy="-44" r="4" fill="#1b1b2f"/>`}
  <path d="M-30 -30 q-30 -10 -34 10 q20 4 34 -2Z" fill="#2f7de1" stroke="#1b1b2f" stroke-width="3"/>
  <path d="M-4 -4 v8 M8 -4 v8" stroke="#ff7a1a" stroke-width="4"/>`);
}

// ---------- shared props ----------
function endCard(t, at) {
  if (t < at) return '';
  return g(`translate(270 860) scale(${pop(t, at, 0.3)})`,
    `<rect x="-240" y="-38" width="480" height="76" rx="38" fill="#ff2d55" stroke="#1b1b2f" stroke-width="5"/>` + label(0, 13, 'FOLLOW FOR MORE ANIMAL FACTS!', { size: 25, sw: 6 }));
}
function banner(t, at, text, color, y = 175, w = 430, size = 42) {
  if (t < at) return '';
  return g(`translate(270 ${y}) scale(${pop(t, at, 0.4)}) rotate(-5)`,
    `<rect x="${-w / 2}" y="-46" width="${w}" height="92" rx="18" fill="${color}" stroke="#1b1b2f" stroke-width="6"/>` + label(0, 16, text, { size, sw: 8 }));
}
function speech(x, y, w, h, text, size = 28, tailDx = -40) {
  return `<path d="M${x + tailDx - 14} ${y + h / 2 - 4} l10 34 l22 -34Z" fill="#fff" stroke="#1b1b2f" stroke-width="5" stroke-linejoin="round"/>
    <rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="22" fill="#fff" stroke="#1b1b2f" stroke-width="5"/>
    <path d="M${x + tailDx - 11} ${y + h / 2} h24" stroke="#fff" stroke-width="7"/>` +
    label(x, y + size * 0.36, text, { size, fill: '#1b1b2f', sw: 0 });
}
