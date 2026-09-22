import { NOISE } from './noise.js';

/* The mobile orb: one fullscreen triangle and an analytic sphere impostor in the
   fragment shader. Same ink body and yellow fresnel rim as the three.js hero blob,
   but the sphere is solved per pixel instead of tessellated, so there is no geometry,
   no scene graph and no library — a few KB instead of 136, which is what makes real
   3D affordable on a phone. Exposes the same { ready, dispose } shape as
   three-hero.js so main.js doesn't need to know which one it got. */

const VERT = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `
// The noise needs highp: permute() reaches values mediump can't hold accurately,
// which shows up as banding and popping on exactly the phones this is for.
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
${NOISE}
uniform vec2 uRes;
uniform float uTime, uReveal, uScale, uY, uSpin, uWarm;
uniform vec3 uRim, uInk;

void main() {
  float unit = min(uRes.x, uRes.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / unit;
  p.y -= uY;

  // Sample the noise along the direction this pixel points, spun around Y so the
  // surface appears to turn rather than just wobble in place.
  vec3 d = normalize(vec3(p, 0.4));
  float c = cos(uSpin), s = sin(uSpin);
  d = vec3(c * d.x + s * d.z, d.y, c * d.z - s * d.x);
  float n = snoise(d * 1.5 + uTime * 0.16) * 0.7 + snoise(d * 2.8 - uTime * 0.21) * 0.3;

  float radius = (0.23 * mix(0.85, 1.0, uReveal) + 0.055 * n * uReveal) * uScale;
  float r = length(p);
  float mask = 1.0 - smoothstep(radius - 2.0 / unit, radius, r);
  if (mask <= 0.0) discard;

  // The sphere's normal is analytic: z falls out of the circle equation
  float rn = r / max(radius, 1e-4);
  vec3 N = normalize(vec3(p / max(radius, 1e-4), sqrt(max(1.0 - rn * rn, 0.0))));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 L = normalize(vec3(-0.6, 0.8, 0.6));

  float fres = pow(1.0 - max(dot(N, V), 0.0), 2.4);
  float diff = max(dot(N, L), 0.0);
  float spec = pow(max(dot(reflect(-L, N), V), 0.0), 40.0);

  vec3 body = mix(uInk, uRim, uWarm * 0.55);
  vec3 col = body * (0.55 + 0.45 * diff) + uRim * fres * (1.1 + uWarm * 0.5) + vec3(spec * 0.5);
  gl_FragColor = vec4(col, mask * uReveal);
}
`;

const RIM = [1, 0.42, 0.17]; // #ff6b2c
const INK = [0.102, 0.086, 0.075]; // #1a1613

function compile(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
  return shader;
}

/* read(state, time) returns the uniforms that change per frame */
function createOrb(container, read) {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, premultipliedAlpha: false });
  if (!gl) throw new Error('no webgl');
  container.append(canvas);

  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);

  // One triangle big enough to cover the clip volume — cheaper than two for a quad
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (name) => gl.getUniformLocation(program, name);
  const loc = { res: u('uRes'), time: u('uTime'), reveal: u('uReveal'), scale: u('uScale'), y: u('uY'), spin: u('uSpin'), warm: u('uWarm') };
  gl.uniform3fv(u('uRim'), RIM);
  gl.uniform3fv(u('uInk'), INK);
  gl.clearColor(0, 0, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const dpr = Math.min(window.devicePixelRatio, 1.5);
  const resize = () => {
    canvas.width = Math.max(1, Math.round(container.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(container.clientHeight * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(loc.res, canvas.width, canvas.height);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  let frame = null;
  let lost = false;
  const start = performance.now();
  const tick = (now) => {
    frame = requestAnimationFrame(tick);
    const { reveal = 1, scale = 1, y = 0, spin = 0, warm = 0 } = read((now - start) / 1000);
    gl.uniform1f(loc.time, (now - start) / 1000);
    gl.uniform1f(loc.reveal, reveal);
    gl.uniform1f(loc.scale, scale);
    gl.uniform1f(loc.y, y);
    gl.uniform1f(loc.spin, spin);
    gl.uniform1f(loc.warm, warm);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const run = (on) => {
    if (on && !frame && !lost) frame = requestAnimationFrame(tick);
    else if (!on && frame) frame = cancelAnimationFrame(frame) || null;
  };
  // A phone can drop the context under memory pressure; stop rather than spin on errors
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true; run(false); });

  const io = new IntersectionObserver(([e]) => run(e.isIntersecting));
  io.observe(container);

  return {
    ready: Promise.resolve(),
    dispose() {
      run(false);
      io.disconnect();
      ro.disconnect();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    },
  };
}

/* Hero: driven by the same plain state object GSAP tweens for the desktop blob */
export function initHeroGL(container, state) {
  return createOrb(container, () => ({
    reveal: state.reveal,
    scale: state.scale,
    y: state.y * 0.12,
    spin: state.spin,
  }));
}

/* About: the orb warms toward yellow and turns as the timeline is scrolled through */
export function initJourneyOrb(container, state) {
  let smooth = 0;
  return createOrb(container, (time) => {
    smooth += (state.progress - smooth) * 0.06;
    return {
      reveal: state.reveal,
      scale: 1.15,
      y: 0,
      spin: time * 0.25 + smooth * Math.PI * 1.5,
      warm: smooth,
    };
  });
}
