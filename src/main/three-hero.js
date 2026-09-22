import { Color, ShaderMaterial, Mesh, IcosahedronGeometry, Group, MeshBasicMaterial, SphereGeometry } from 'three';
import { createStage, disposeStage, NOISE, pointer, easePointer } from './gl.js';

/* Hero: a slow-morphing ink blob with a yellow rim, sitting behind the portrait like a halo.
   It leans toward the cursor, gets agitated by fast mouse moves and is exposed as `state`
   so GSAP can drive the intro and scroll. Returns { ready, dispose } so the caller can free
   it once the hero is scrolled well out of view. */
export function initHeroGL(container, state) {
  const stage = createStage(container, { z: 6 });
  const { scene, loop } = stage;

  const uniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0.24 },
    uAgitate: { value: 0 },
    uRim: { value: new Color('#ff6b2c') },
    uInk: { value: new Color('#1a1613') },
    uReveal: { value: 0 },
  };

  const material = new ShaderMaterial({
    uniforms,
    transparent: true,
    vertexShader: /* glsl */ `
      ${NOISE}
      uniform float uTime, uAmp, uAgitate, uReveal;
      varying vec3 vPos;
      varying vec3 vView;
      void main() {
        float t = uTime * 0.25;
        float n = snoise(normal * 0.9 + t) * 0.8 + snoise(normal * 1.7 - t * 1.3) * 0.2;
        float amp = uAmp + uAgitate * 0.18;
        vec3 p = position * (0.85 + 0.15 * uReveal) + normal * n * amp * uReveal;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vPos = mv.xyz;
        vView = -mv.xyz;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uRim, uInk;
      uniform float uReveal;
      varying vec3 vPos;
      varying vec3 vView;
      void main() {
        // Normal from screen-space derivatives: always matches the displaced surface
        vec3 N = normalize(cross(dFdx(vPos), dFdy(vPos)));
        vec3 V = normalize(vView);
        float fres = pow(1.0 - max(dot(N, V), 0.0), 2.4);
        vec3 L = normalize(vec3(-0.6, 0.8, 0.6));
        float diff = max(dot(N, L), 0.0);
        float spec = pow(max(dot(reflect(-L, N), V), 0.0), 40.0);
        vec3 col = uInk * (0.55 + 0.45 * diff) + uRim * fres * 1.1 + vec3(spec * 0.5);
        gl_FragColor = vec4(col, uReveal);
      }
    `,
  });

  const blob = new Mesh(new IcosahedronGeometry(1.15, 28), material);
  scene.add(blob);

  // Tiny orbiting satellites add depth without competing with the portrait
  const dots = new Group();
  const dotMat = new MeshBasicMaterial({ color: '#ff6b2c', transparent: true, opacity: 0 });
  for (let i = 0; i < 3; i++) {
    const d = new Mesh(new SphereGeometry(0.06 + i * 0.025, 24, 24), dotMat);
    d.userData = { r: 2 + i * 0.35, speed: 0.35 - i * 0.08, phase: i * 2.1, tilt: 0.4 + i * 0.3 };
    dots.add(d);
  }
  scene.add(dots);

  const ready = loop((time, dt) => {
    easePointer(dt);
    uniforms.uTime.value = time;
    uniforms.uReveal.value = state.reveal;
    uniforms.uAgitate.value += (pointer.speed - uniforms.uAgitate.value) * 0.08;

    blob.rotation.y = time * 0.08 + pointer.x * 0.5 + state.spin;
    blob.rotation.x = -pointer.y * 0.35;
    blob.position.set(pointer.x * 0.25, 0.15 + state.y + pointer.y * 0.15, 0);
    blob.scale.setScalar(state.scale);

    dotMat.opacity = state.reveal;
    dots.position.copy(blob.position);
    dots.children.forEach((d) => {
      const { r, speed, phase, tilt } = d.userData;
      const a = time * speed + phase;
      d.position.set(Math.cos(a) * r * state.scale, Math.sin(a) * r * tilt * state.scale, Math.sin(a) * r * 0.5);
    });
  });

  return { ready, dispose: () => disposeStage(stage) };
}
