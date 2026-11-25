/* Hero — WebGL liquid photograph. Flow-noise displacement, cursor ripple,
   chromatic split driven by pointer velocity, scroll-linked zoom. */
(function () {
  const canvas = document.getElementById('heroGl');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, alpha: false });
  if (!gl) return;

  const vs = `attribute vec2 p; varying vec2 v; void main(){ v = p*.5+.5; gl_Position = vec4(p,0.,1.); }`;
  const fs = `
  precision highp float;
  varying vec2 v;
  uniform sampler2D tex;
  uniform vec2 res, img, mouse;
  uniform float time, vel, scroll, intro;

  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
  vec3 perm(vec3 x){return mod289(((x*34.)+1.)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
    vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
    vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
    vec3 p=perm(perm(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
    vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.); m=m*m; m=m*m;
    vec3 x=2.*fract(p*C.www)-1.; vec3 h=abs(x)-.5; vec3 ox=floor(x+.5); vec3 a0=x-ox;
    m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
    vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.*dot(m,g);
  }
  vec2 cover(vec2 uv){
    float rs=res.x/res.y, ri=img.x/img.y;
    vec2 s = rs<ri ? vec2(rs/ri,1.) : vec2(1.,ri/rs);
    return (uv-.5)*s+.5;
  }
  void main(){
    vec2 uv = v;
    float aspect = res.x/res.y;
    vec2 m = mouse;
    vec2 d = (uv-m)*vec2(aspect,1.);
    float dist = length(d);

    // slow liquid flow
    float t = time*.06;
    vec2 flow = vec2(snoise(uv*2.2+vec2(t,-t*.7)), snoise(uv*2.2+vec2(-t*.8,t)+7.3));
    vec2 uv2 = uv + flow*.012*(1.+scroll*2.);

    // cursor lens + ripple
    float lens = smoothstep(.34,0.,dist);
    uv2 -= d/aspect*lens*.06;
    uv2 += normalize(d+1e-4)*sin(dist*38.-time*3.)*.004*lens*(.6+vel*3.);

    // scroll zoom + intro zoom
    float z = 1. - scroll*.18 - (1.-intro)*.12;
    uv2 = (uv2-.5)*z+.5;

    vec2 cuv = cover(uv2);
    float ca = .0025 + vel*.02 + lens*.004 + scroll*.01;
    vec2 dir = normalize(d+1e-4)*ca;
    float r = texture2D(tex, cuv+dir).r;
    float g = texture2D(tex, cuv).g;
    float b = texture2D(tex, cuv-dir).b;
    vec3 col = vec3(r,g,b);

    // grade: lift, vignette, scroll fade
    float vig = smoothstep(1.15,.25,length((v-.5)*vec2(aspect*.8,1.)));
    col *= mix(.45,1.,vig);
    col = mix(col, col*col*1.25, .25);
    col *= (1.-scroll*.75) * (.35+.65*intro);
    // subtle light leak
    col += vec3(1.,.35,.12)*.06*smoothstep(.6,1.,snoise(vec2(uv.x*.7+t*1.5,uv.y*.4))*.5+.5)*(1.-uv.y);
    gl_FragColor = vec4(col,1.);
  }`;

  function sh(type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  }
  const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return;
  const prog = gl.createProgram(); gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(prog, n);
  const u = { res: U('res'), img: U('img'), mouse: U('mouse'), time: U('time'), vel: U('vel'), scroll: U('scroll'), intro: U('intro') };

  const tex = gl.createTexture();
  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform2f(u.img, image.naturalWidth, image.naturalHeight);
    ready = true; canvas.classList.add('is-ready');
  };
  image.src = '/media/hero.jpg';

  let ready = false, W = 0, H = 0;
  const target = { x: .5, y: .45 }, mouse = { x: .5, y: .45 };
  let vel = 0, scroll = 0, intro = 0, visible = true;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.res, W, H);
  }
  window.addEventListener('resize', resize); resize();

  window.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    target.x = (e.clientX - r.left) / r.width;
    target.y = 1 - (e.clientY - r.top) / r.height;
  }, { passive: true });

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);

  const t0 = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    if (!ready || !visible) return;
    const t = (now - t0) / 1000;
    if (window.matchMedia('(hover: none)').matches) { // touch: wander
      target.x = .5 + Math.sin(t * .35) * .22; target.y = .5 + Math.cos(t * .27) * .18;
    }
    const px = mouse.x, py = mouse.y;
    mouse.x += (target.x - mouse.x) * .075; mouse.y += (target.y - mouse.y) * .075;
    const sp = Math.hypot(mouse.x - px, mouse.y - py);
    vel += (Math.min(sp * 18, 1) - vel) * .1;
    scroll = Math.min(Math.max(window.scrollY / (H || 1), 0), 1);
    if (document.body.classList.contains('is-in')) intro += (1 - intro) * .025;
    gl.uniform1f(u.time, t); gl.uniform2f(u.mouse, mouse.x, mouse.y);
    gl.uniform1f(u.vel, vel); gl.uniform1f(u.scroll, scroll); gl.uniform1f(u.intro, intro);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  })(t0);
})();
