import {
  CatmullRomCurve3, Vector3, TubeGeometry, MeshBasicMaterial, Mesh, SphereGeometry, TorusGeometry, Group, Color,
} from 'three';
import { createStage, pointer, easePointer } from './gl.js';

/* About: the journey as a 3D path. One node per milestone; the path draws itself as you scroll
   the timeline, a yellow traveller rides its tip and the camera drifts along behind it. */
export function initJourneyGL(container, count, state) {
  const { scene, camera, loop } = createStage(container, { fov: 40, z: 9 });

  // A loose upward spiral through the milestones
  const points = Array.from({ length: count }, (_, i) => {
    const a = i * 1.25;
    return new Vector3(Math.cos(a) * 2.2, i * 1.1 - (count - 1) * 0.55, Math.sin(a) * 2.2);
  });
  const curve = new CatmullRomCurve3(points, false, 'catmullrom', 0.5);

  const SEG = 400;
  const RAD = 8;
  const ink = new Color('#1a1613');
  const yellow = new Color('#ff6b2c');

  const ghost = new Mesh(new TubeGeometry(curve, SEG, 0.018, RAD), new MeshBasicMaterial({ color: ink, transparent: true, opacity: 0.12 }));
  const drawn = new Mesh(new TubeGeometry(curve, SEG, 0.045, RAD), new MeshBasicMaterial({ color: ink }));
  const world = new Group();
  world.add(ghost, drawn);
  scene.add(world);

  // Node t-values along the curve (CatmullRom params are per control point)
  const nodes = points.map((p, i) => {
    const g = new Group();
    const core = new Mesh(new SphereGeometry(0.16, 32, 32), new MeshBasicMaterial({ color: ink }));
    const ring = new Mesh(new TorusGeometry(0.34, 0.025, 12, 64), new MeshBasicMaterial({ color: ink, transparent: true, opacity: 0.25 }));
    g.add(core, ring);
    g.position.copy(p);
    world.add(g);
    return { g, core, ring, t: i / (count - 1), on: 0 };
  });

  const traveller = new Mesh(new SphereGeometry(0.12, 32, 32), new MeshBasicMaterial({ color: yellow }));
  const halo = new Mesh(new SphereGeometry(0.3, 32, 32), new MeshBasicMaterial({ color: yellow, transparent: true, opacity: 0.35 }));
  traveller.add(halo);
  world.add(traveller);

  let smooth = 0;
  const look = new Vector3();
  const tmp = new Vector3();

  return loop((time, dt) => {
    easePointer(dt);
    smooth += (state.progress - smooth) * (1 - Math.exp(-dt * 6));

    drawn.geometry.setDrawRange(0, Math.floor(smooth * SEG) * RAD * 6);
    curve.getPoint(smooth, tmp);
    traveller.position.copy(tmp);
    halo.scale.setScalar(1 + Math.sin(time * 3) * 0.2);

    nodes.forEach((n) => {
      const target = smooth >= n.t - 0.001 ? 1 : 0;
      n.on += (target - n.on) * (1 - Math.exp(-dt * 8));
      n.core.material.color.copy(ink).lerp(yellow, n.on);
      n.core.scale.setScalar(1 + n.on * 0.4);
      n.ring.material.opacity = 0.25 + n.on * 0.75;
      n.ring.scale.setScalar(1 + n.on * (0.3 + Math.sin(time * 2 + n.t * 9) * 0.08));
      n.ring.lookAt(camera.position);
    });

    // Camera orbits slowly around the path and tracks the traveller's height
    world.rotation.y = time * 0.05 + smooth * Math.PI * 1.2 + pointer.x * 0.3;
    world.scale.setScalar(0.6 + state.reveal * 0.4);
    look.y += (tmp.y * 0.7 - look.y) * (1 - Math.exp(-dt * 4));
    camera.position.set(0, look.y + 1.5 + pointer.y * 0.8, 9);
    camera.lookAt(0, look.y, 0);
  });
}
