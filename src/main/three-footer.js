import { BufferGeometry, BufferAttribute, Vector2, Color, ShaderMaterial, Points } from 'three';
import { createStage, NOISE, pointer, easePointer } from './gl.js';

/* Footer: a field of yellow points rolling like a slow sea, with a ripple under the cursor. */
export function initFooterGL(container, state) {
  const { scene, camera, loop } = createStage(container, { fov: 45, z: 5 });
  camera.position.set(0, 2.2, 5);
  camera.lookAt(0, 0, -1);

  const COLS = 160;
  const ROWS = 70;
  const positions = new Float32Array(COLS * ROWS * 3);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const i = (y * COLS + x) * 3;
      positions[i] = (x / (COLS - 1) - 0.5) * 16;
      positions[i + 2] = -(y / (ROWS - 1)) * 10 + 2;
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new Vector2(0, 0) },
    uPixel: { value: Math.min(window.devicePixelRatio, 2) },
    uColor: { value: new Color('#ff6b2c') },
    uRise: { value: 0 },
  };

  const material = new ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      ${NOISE}
      uniform float uTime, uPixel, uRise;
      uniform vec2 uMouse;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        float wave = snoise(vec3(p.x * 0.18, p.z * 0.25, uTime * 0.15)) * 0.75;
        float d = distance(p.xz, uMouse);
        float ripple = sin(d * 3.0 - uTime * 4.0) * exp(-d * 0.9) * 0.35;
        p.y = (wave + ripple) * uRise - (1.0 - uRise) * 1.5;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uPixel * (3.2 + ripple * 9.0) * (6.0 / -mv.z);
        vAlpha = smoothstep(14.0, 2.0, -mv.z) * (0.55 + (p.y + 0.6) * 0.9) * uRise;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(uColor, vAlpha * smoothstep(0.5, 0.2, d));
      }
    `,
  });

  scene.add(new Points(geometry, material));

  return loop((time, dt) => {
    easePointer(dt);
    uniforms.uTime.value = time;
    uniforms.uRise.value = state.rise;
    // Map the cursor onto the field (roughly under the pointer)
    uniforms.uMouse.value.set(pointer.x * 6, -2.5 + pointer.y * 3);
  });
}
