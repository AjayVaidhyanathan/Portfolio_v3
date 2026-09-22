import { WebGLRenderer, Scene, PerspectiveCamera, Timer } from 'three';

/* Shared WebGL plumbing: a renderer sized to its container that only renders while visible. */
export function createStage(container, { fov = 35, z = 6 } = {}) {
  // Retina screens don't need MSAA, and 1.5x is visually identical for soft shapes at far lower fill cost
  const renderer = new WebGLRenderer({ antialias: window.devicePixelRatio < 2, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.append(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.z = z;

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(container);

  const timer = new Timer();
  // Compiles shaders off the main thread where supported, then renders only while on screen.
  // Resolves once the scene is ready to show.
  const loop = (update) => {
    const tick = (now) => {
      timer.update(now);
      update(timer.getElapsed(), Math.min(timer.getDelta(), 0.05));
      renderer.render(scene, camera);
    };
    const ready = renderer.compileAsync(scene, camera).catch(() => {});
    new IntersectionObserver(([e]) => ready.then(() => renderer.setAnimationLoop(e.isIntersecting ? tick : null))).observe(container);
    return ready;
  };

  return { renderer, scene, camera, loop };
}

/* Free GPU resources for a stage that's scrolled out of relevance for good.
   Mobile browsers reclaim tabs under GPU memory pressure, and several
   never-disposed WebGLRenderers stacking up as the page is scrolled is a
   common way to trigger that, so decorative stages that won't be revisited
   (e.g. the hero blob, once you're deep into the page) get torn down. */
export function disposeStage({ renderer, scene }) {
  renderer.setAnimationLoop(null);
  scene.traverse((obj) => {
    obj.geometry?.dispose();
    (Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : []).forEach((m) => m.dispose());
  });
  renderer.dispose();
  renderer.forceContextLoss();
  renderer.domElement.remove();
}

export { NOISE } from './noise.js';

/* Pointer in -1..1, eased. Shared so every scene reacts the same way. */
export const pointer = { x: 0, y: 0, tx: 0, ty: 0, speed: 0 };
window.addEventListener('pointermove', (e) => {
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  const ny = -((e.clientY / window.innerHeight) * 2 - 1);
  pointer.speed = Math.min(pointer.speed + Math.hypot(nx - pointer.tx, ny - pointer.ty) * 4, 1);
  pointer.tx = nx;
  pointer.ty = ny;
});
export function easePointer(dt) {
  const k = 1 - Math.exp(-dt * 5);
  pointer.x += (pointer.tx - pointer.x) * k;
  pointer.y += (pointer.ty - pointer.y) * k;
  pointer.speed *= Math.exp(-dt * 2.5);
}
