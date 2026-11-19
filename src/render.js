// Render a video: node src/render.js <name> [--preview t1,t2,...]
// Frames are drawn in headless Chromium (SVG), piped to ffmpeg, muxed with voice.wav.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');

const ROOT = path.resolve(__dirname, '..');
const name = process.argv[2];
const prevArg = process.argv.indexOf('--preview');
const FPS = 30, DUR = 30;

(async () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/scripts.json')))[name];
  const bdir = path.join(ROOT, 'build', name);
  const timing = JSON.parse(fs.readFileSync(path.join(bdir, 'timing.json')));
  const env = JSON.parse(fs.readFileSync(path.join(bdir, 'env.json')));
  const subs = cfg.chunks.map((c, i) => ({
    text: c.sub, start: Math.max(0, timing[i].start - 0.05),
    end: i + 1 < timing.length ? timing[i + 1].start - 0.05 : Math.min(DUR, timing[i].start + timing[i].len + 1.2),
  }));
  writeSrt(subs, path.join(ROOT, 'output', `${name}.srt`));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(ROOT, 'src/stage/stage.html') + '?v=' + name);
  await page.evaluate(d => window.setData(d), { env, timing, subs, fps: FPS });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.drawFrame(0));
  await page.waitForTimeout(300);

  if (prevArg > 0) {
    const ts = process.argv[prevArg + 1].split(',').map(Number);
    const pdir = path.join(ROOT, 'build', 'preview'); fs.mkdirSync(pdir, { recursive: true });
    for (const t of ts) {
      await page.evaluate(t => window.drawFrame(t), t);
      await page.screenshot({ path: path.join(pdir, `${name}_${t}.png`) });
    }
    await browser.close(); return;
  }

  const out = path.join(ROOT, 'output', `${name}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-i', path.join(bdir, 'voice.wav'),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '192k', '-t', String(DUR), '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const total = FPS * DUR;
  for (let f = 0; f < total; f++) {
    await page.evaluate(t => window.drawFrame(t), f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`${name}: frame ${f}/${total}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
  console.log('wrote', out);
})();

function writeSrt(subs, file) {
  const ts = s => { const ms = Math.round(s * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, subs.map((s, i) => `${i + 1}\n${ts(s.start)} --> ${ts(s.end)}\n${s.text}\n`).join('\n'));
}
