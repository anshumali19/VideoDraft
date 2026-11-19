// Shared helpers for all scenes. Canvas is 540x960 CSS px, rendered at 2x => 1080x1920.
const W = 540, H = 960;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = k => 1 - Math.pow(1 - k, 3);
const easeInOut = k => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const easeBack = k => { const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
const pop = (t, a, d = 0.35) => easeBack(prog(t, a, a + d));
const within = (t, a, b) => t >= a && t < b;
const rnd = s => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

let DATA = { env: [], timing: [], subs: [], fps: 30 };
const mouth = t => { const i = Math.round(t * DATA.fps); const e = DATA.env; if (!e.length) return 0;
  const v = (e[i] || 0) * 0.6 + ((e[i - 1] || 0) + (e[i + 1] || 0)) * 0.2; return clamp(v * 1.25); };
const blink = (t, seed = 0) => { const p = (t + seed) % 3.7; return p < 0.12 ? 1 - Math.abs(p - 0.06) / 0.06 : 0; };
const T = i => DATA.timing[i] ? DATA.timing[i].start : 99;
const Tend = i => DATA.timing[i] ? DATA.timing[i].start + DATA.timing[i].len : 99;

// Text with heavy outline (SVG)
function label(x, y, text, o = {}) {
  const s = o.size || 34, fill = o.fill || '#fff', stroke = o.stroke || '#1b1b2f', sw = o.sw || s * 0.22;
  const font = o.font || 'Lucky';
  return `<text x="${x}" y="${y}" text-anchor="${o.anchor || 'middle'}" font-family="${font}" font-size="${s}"
    fill="${fill}" stroke="${stroke}" stroke-width="${sw}" paint-order="stroke" stroke-linejoin="round"
    ${o.rot ? `transform="rotate(${o.rot} ${x} ${y})"` : ''} opacity="${o.op ?? 1}">${text}</text>`;
}
const g = (tr, inner, op = 1) => `<g transform="${tr}" opacity="${op}">${inner}</g>`;
const emoji = (x, y, ch, s = 40, op = 1) =>
  `<text x="${x}" y="${y}" font-family="Noto Color Emoji" font-size="${s}" text-anchor="middle" dominant-baseline="central" opacity="${op}">${ch}</text>`;

function sparkles(t, cx, cy, r, n = 8, color = '#ffe45c', seed = 1) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + seed, ph = (t * 1.6 + rnd(i + seed)) % 1;
    const rr = r * (0.7 + 0.5 * ph), sz = 9 * Math.sin(ph * Math.PI);
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
    s += `<path d="M${x} ${y - sz} Q${x} ${y} ${x + sz} ${y} Q${x} ${y} ${x} ${y + sz} Q${x} ${y} ${x - sz} ${y} Q${x} ${y} ${x} ${y - sz}Z" fill="${color}"/>`;
  }
  return s;
}

// Cut flash between scenes
function flash(t, cuts) {
  for (const c of cuts) { const k = prog(t, c, c + 0.18); if (t >= c && k < 1) return `<rect width="${W}" height="${H}" fill="#fff" opacity="${(1 - k) * 0.55}"/>`; }
  return '';
}

// Badge card (pop-in)
function card(t, at, x, y, inner, w = 140, h = 150, fill = '#fff') {
  const k = pop(t, at); if (t < at) return '';
  return g(`translate(${x} ${y}) scale(${k}) rotate(${(1 - k) * -12})`,
    `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="22" fill="${fill}" stroke="#1b1b2f" stroke-width="5"/>${inner}`);
}
const tick = (x, y, s = 1, c = '#2fbf4a') => `<path d="M${x - 22 * s} ${y} l${15 * s} ${16 * s} l${30 * s} ${-34 * s}" fill="none" stroke="${c}" stroke-width="${11 * s}" stroke-linecap="round" stroke-linejoin="round"/>`;
const cross = (x, y, s = 1, c = '#ff3b3b') => `<path d="M${x - 20 * s} ${y - 20 * s} l${40 * s} ${40 * s} M${x + 20 * s} ${y - 20 * s} l${-40 * s} ${40 * s}" stroke="${c}" stroke-width="${11 * s}" stroke-linecap="round"/>`;

// Header chip + subtitle overlay + end card are HTML (crisper text)
function renderChrome(t, meta) {
  const sub = DATA.subs.find(s => t >= s.start && t < s.end);
  const el = document.getElementById('sub');
  if (sub) {
    const k = pop(t, sub.start, 0.22);
    const html = sub.text.split(' ').map(w => /[A-Z]{3,}/.test(w.replace(/[^A-Za-z]/g, '')) && w.replace(/[^A-Za-z]/g, '') === w.replace(/[^A-Za-z]/g, '').toUpperCase()
      ? `<span class="hl">${w}</span>` : w).join(' ');
    el.innerHTML = html; el.style.transform = `translateX(-50%) scale(${0.75 + 0.25 * k})`; el.style.opacity = clamp(k * 1.5);
  } else el.style.opacity = 0;
  document.getElementById('chip').innerHTML = `<span class="dot" style="background:${meta.color}"></span>FUNNY FACTS <b>·</b> ${meta.name}`;
}

window.drawFrame = function (t) {
  document.getElementById('scene').innerHTML = window.SCENE(t);
  renderChrome(t, window.META);
};
window.setData = d => { DATA = d; };
