/**
 * The Block Run world: a course of floating blocks built with three.js, a
 * blocky runner, simple platform physics and a chase camera. The screen
 * owns the questions and the score; the world only reports what happens
 * (an answer platform landed on, a fall, the finish) through callbacks.
 */

import type * as THREE_NS from "three";

type Three = typeof THREE_NS;

export type WorldEvents = {
  /** Landed on an answer platform for the first time. */
  onAnswer: (gate: number, choice: number) => void;
  /** Reached a new checkpoint (0 = start, then one per gate). */
  onCheckpoint: (gate: number) => void;
  onFall: () => void;
  onFinish: () => void;
};

export type Controls = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
};

type Kind = "start" | "path" | "check" | "answer" | "finish";

type Block = {
  kind: Kind;
  x: number;
  z: number;
  w: number;
  d: number;
  top: number;
  /** Which gate the block belongs to (its path, checkpoint or answers). */
  gate: number;
  choice?: number;
  solid: boolean;
  /** For crumbling answer platforms: seconds until they fall. */
  crumble?: number;
  falling?: boolean;
  /** For blocks popping into view: 0 → 1. */
  grow?: number;
  mesh: THREE_NS.Object3D;
  label?: THREE_NS.Sprite;
};

const SPEED = 6;
const JUMP = 9.2;
const GRAVITY = 26;
const RADIUS = 0.3;
const HEIGHT = 1.6;

const COLORS: Record<Kind, number> = {
  start: 0x5b8def,
  path: 0x6cc24a,
  check: 0x5b8def,
  answer: 0xf5b942,
  finish: 0xf2c94c,
};

/** A sign with text on it, drawn on a canvas. */
function textSprite(T: Three, text: string, opts: { bg: string; fg: string }) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const font = "900 64px system-ui, 'Segoe UI', sans-serif";
  ctx.font = font;
  const width = Math.max(256, Math.ceil(ctx.measureText(text).width) + 80);
  canvas.width = width;
  canvas.height = 128;
  ctx.font = font;
  ctx.fillStyle = opts.bg;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(4, 4, width - 8, 120, 28);
  else ctx.rect(4, 4, width - 8, 120);
  ctx.fill();
  ctx.fillStyle = opts.fg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, 68);
  const texture = new T.CanvasTexture(canvas);
  texture.colorSpace = T.SRGBColorSpace;
  const sprite = new T.Sprite(
    new T.SpriteMaterial({ map: texture, depthTest: false }),
  );
  sprite.renderOrder = 10;
  const h = 1.15;
  sprite.scale.set((h * width) / 128, h, 1);
  return sprite;
}

/** The blocky runner: legs, body, arms and a head with a cap. */
function makeRunner(T: Three) {
  const mat = (color: number) => new T.MeshLambertMaterial({ color });
  const box = (w: number, h: number, d: number, color: number) =>
    new T.Mesh(new T.BoxGeometry(w, h, d), mat(color));
  const root = new T.Group();
  const limb = (w: number, h: number, color: number, x: number, y: number) => {
    // Pivot at the top so the limb swings from the hip or shoulder.
    const pivot = new T.Group();
    pivot.position.set(x, y, 0);
    const m = box(w, h, w + 0.04, color);
    m.position.y = -h / 2;
    pivot.add(m);
    root.add(pivot);
    return pivot;
  };
  const legL = limb(0.26, 0.7, 0x1f2a5a, -0.15, 0.7);
  const legR = limb(0.26, 0.7, 0x1f2a5a, 0.15, 0.7);
  const body = box(0.62, 0.7, 0.36, 0x14b8a6);
  body.position.y = 1.05;
  root.add(body);
  const armL = limb(0.2, 0.65, 0xf2c79b, -0.42, 1.38);
  const armR = limb(0.2, 0.65, 0xf2c79b, 0.42, 1.38);
  const head = box(0.56, 0.56, 0.56, 0xf2c79b);
  head.position.y = 1.7;
  root.add(head);
  const cap = box(0.6, 0.18, 0.6, 0xe11d48);
  cap.position.y = 2.0;
  root.add(cap);
  const brim = box(0.6, 0.06, 0.28, 0xe11d48);
  brim.position.set(0, 1.92, -0.4);
  root.add(brim);
  for (const x of [-0.13, 0.13]) {
    const eye = box(0.08, 0.12, 0.02, 0x111827);
    eye.position.set(x, 1.74, -0.29);
    root.add(eye);
  }
  return { root, legL, legR, armL, armR };
}

export type World = {
  /** Shows the path to the next gate after a right answer. */
  openGate: (gate: number) => void;
  /** Makes a wrong answer platform crumble. */
  crumble: (gate: number, choice: number) => void;
  /** Marks the right answer platform. */
  markRight: (gate: number, choice: number) => void;
  setControls: (c: Partial<Controls>) => void;
  /** For tests: drops the runner just above a block. */
  dropOnto: (kind: Kind, gate: number, choice?: number) => boolean;
  /** For tests: where the runner is. */
  where: () => { x: number; y: number; z: number; grounded: boolean };
  dispose: () => void;
};

/**
 * Builds the course for `gates` gates, each with its answer labels (in the
 * order they stand left to right, with their choice index), and starts
 * the game loop on `canvas`.
 */
export function createWorld(
  T: Three,
  canvas: HTMLCanvasElement,
  gates: { labels: { text: string; choice: number }[] }[],
  events: WorldEvents,
): World {
  const renderer = new T.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new T.Scene();
  scene.background = new T.Color(0x8ecdf5);
  scene.fog = new T.Fog(0x8ecdf5, 30, 70);
  const camera = new T.PerspectiveCamera(60, 1, 0.1, 200);
  scene.add(new T.HemisphereLight(0xffffff, 0x6b8f5a, 1.6));
  const sun = new T.DirectionalLight(0xffffff, 1.4);
  sun.position.set(6, 12, 4);
  scene.add(sun);

  const blocks: Block[] = [];
  const edgeMat = new T.LineBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.25,
  });
  const addBlock = (b: Omit<Block, "mesh">, color = COLORS[b.kind]) => {
    const geo = new T.BoxGeometry(b.w, 1, b.d);
    const mesh = new T.Mesh(geo, new T.MeshLambertMaterial({ color }));
    mesh.add(new T.LineSegments(new T.EdgesGeometry(geo), edgeMat));
    mesh.position.set(b.x, b.top - 0.5, b.z);
    mesh.visible = b.solid;
    scene.add(mesh);
    const block = { ...b, mesh } as Block;
    blocks.push(block);
    return block;
  };

  // The course runs along -z: start, then per gate a path of stepping
  // blocks, a checkpoint and three answer platforms, then the finish.
  const checkpoints: { x: number; y: number; z: number }[] = [];
  addBlock({
    kind: "start",
    x: 0,
    z: 0,
    w: 6,
    d: 6,
    top: 0,
    gate: 0,
    solid: true,
  });
  checkpoints.push({ x: 0, y: 0, z: 0 });
  let z = -3;
  let y = 0;
  const stepX = [
    [0, 1.6, -1.2],
    [0, -1.6, 1.2],
    [0, 1.4, 0],
  ];
  for (let g = 0; g <= gates.length; g++) {
    // Gate 0's path shows from the start; later ones appear when the gate
    // before is answered.
    const open = g === 0;
    const xs = stepX[g % stepX.length]!;
    for (let k = 0; k < 3; k++) {
      z -= 3.4;
      y += g === 0 && k === 0 ? 0 : 0.5;
      addBlock({
        kind: "path",
        x: xs[k]!,
        z,
        w: 2.2,
        d: 2.2,
        top: y,
        gate: g,
        solid: open,
      });
    }
    z -= 4.4;
    if (g === gates.length) {
      const finish = addBlock({
        kind: "finish",
        x: 0,
        z,
        w: 7,
        d: 5,
        top: y,
        gate: g,
        solid: false,
      });
      const cup = new T.Group();
      const gold = new T.MeshLambertMaterial({ color: 0xffc83d });
      const bowl = new T.Mesh(new T.CylinderGeometry(0.7, 0.35, 0.9, 12), gold);
      bowl.position.y = 1.4;
      const stem = new T.Mesh(new T.CylinderGeometry(0.15, 0.15, 0.6, 8), gold);
      stem.position.y = 0.8;
      const base = new T.Mesh(new T.BoxGeometry(0.9, 0.3, 0.9), gold);
      base.position.y = 0.65;
      cup.add(bowl, stem, base);
      finish.mesh.add(cup);
      break;
    }
    addBlock({
      kind: "check",
      x: 0,
      z,
      w: 8,
      d: 4,
      top: y,
      gate: g,
      solid: open,
    });
    checkpoints.push({ x: 0, y, z });
    z -= 4.6;
    y += 0.3;
    for (const [i, label] of gates[g]!.labels.entries()) {
      const b = addBlock({
        kind: "answer",
        x: (i - 1) * 4.2,
        z,
        w: 3.2,
        d: 3.2,
        top: y,
        gate: g,
        choice: label.choice,
        solid: true,
      });
      const s = textSprite(T, label.text, { bg: "#ffffff", fg: "#0f172a" });
      s.position.set(0, 2.1, 0);
      b.mesh.add(s);
      b.label = s;
    }
    z -= 1.0;
  }

  // Clouds far below and around.
  const cloudMat = new T.MeshLambertMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.9,
  });
  for (let i = 0; i < 26; i++) {
    const c = new T.Mesh(
      new T.BoxGeometry(4 + (i % 4) * 2, 1.2, 3 + (i % 3)),
      cloudMat,
    );
    c.position.set(((i * 37) % 60) - 30, -8 - (i % 5) * 2, 10 - i * 5);
    scene.add(c);
  }

  const runner = makeRunner(T);
  scene.add(runner.root);
  const shadow = new T.Mesh(
    new T.CircleGeometry(0.45, 20),
    new T.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.3,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  scene.add(shadow);

  const pos = new T.Vector3(0, 0, 0);
  let vy = 0;
  let grounded = true;
  let coyote = 0;
  let jumpBuffer = 0;
  let facing = 0;
  let walk = 0;
  let checkpoint = 0;
  const landed = new Set<Block>();
  const controls: Controls = {
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
  };
  let finished = false;

  const inside = (b: Block, x: number, zz: number, margin: number) =>
    Math.abs(x - b.x) <= b.w / 2 + margin &&
    Math.abs(zz - b.z) <= b.d / 2 + margin;

  /** Whether standing at (x, feet, z) would be inside a block's side. */
  const blocked = (x: number, feet: number, zz: number) =>
    blocks.some(
      (b) =>
        b.solid &&
        !b.falling &&
        inside(b, x, zz, RADIUS - 0.05) &&
        feet < b.top - 0.05 &&
        feet + HEIGHT > b.top - 1,
    );

  const respawn = () => {
    const c = checkpoints[checkpoint]!;
    pos.set(c.x, c.y + 0.01, c.z);
    vy = 0;
    facing = 0;
  };

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  const camPos = new T.Vector3(0, 5, 8);
  camera.position.copy(camPos);
  const look = new T.Vector3();
  let last = performance.now();
  let frame = 0;
  let time = 0;

  let moving = false;

  /** One small physics step (the frame is split into these). */
  const tick = (dt: number) => {
    time += dt;

    // Movement on the ground plane: up is forward (-z).
    let mx = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
    let mz = (controls.down ? 1 : 0) - (controls.up ? 1 : 0);
    const len = Math.hypot(mx, mz);
    moving = len > 0 && !finished;
    if (finished) {
      mx = 0;
      mz = 0;
    } else if (len > 0) {
      mx /= len;
      mz /= len;
      facing = Math.atan2(-mx, -mz);
    }
    const nx = pos.x + mx * SPEED * dt;
    const nz = pos.z + mz * SPEED * dt;
    if (!blocked(nx, pos.y, pos.z)) pos.x = nx;
    if (!blocked(pos.x, pos.y, nz)) pos.z = nz;

    // Jumping, with a little forgiveness before and after the edge.
    jumpBuffer -= dt;
    coyote -= dt;
    if (jumpBuffer > 0 && (grounded || coyote > 0) && !finished) {
      vy = JUMP;
      grounded = false;
      coyote = 0;
      jumpBuffer = 0;
    }

    vy -= GRAVITY * dt;
    const prevY = pos.y;
    pos.y += vy * dt;
    const wasGrounded = grounded;
    grounded = false;
    let floor: Block | null = null;
    for (const b of blocks) {
      if (!b.solid || b.falling || !inside(b, pos.x, pos.z, 0.15)) continue;
      if (vy <= 0 && prevY >= b.top - 0.05 && pos.y <= b.top) {
        if (!floor || b.top > floor.top) floor = b;
      }
    }
    if (floor) {
      pos.y = floor.top;
      vy = 0;
      grounded = true;
      if (!landed.has(floor)) {
        landed.add(floor);
        if (floor.kind === "answer") events.onAnswer(floor.gate, floor.choice!);
        if (floor.kind === "check" && floor.gate + 1 > checkpoint) {
          checkpoint = floor.gate + 1;
          events.onCheckpoint(floor.gate);
        }
        if (floor.kind === "finish" && !finished) {
          finished = true;
          events.onFinish();
        }
      }
    }
    if (wasGrounded && !grounded && vy <= 0) coyote = 0.12;
    if (pos.y < -14) {
      events.onFall();
      respawn();
    }

    // Blocks: crumbling, falling and growing into view.
    for (const b of blocks) {
      if (b.crumble !== undefined && !b.falling) {
        b.crumble -= dt;
        b.mesh.position.x = b.x + Math.sin(time * 60) * 0.06;
        if (b.crumble <= 0) b.falling = true;
      }
      if (b.falling && b.mesh.visible) {
        b.mesh.position.y -= dt * 12;
        b.mesh.rotation.z += dt * 1.5;
        if (b.mesh.position.y < -30) {
          b.mesh.visible = false;
          b.solid = false;
        }
      }
      if (b.grow !== undefined && b.grow < 1) {
        b.grow = Math.min(1, b.grow + dt * 3);
        const s = 1 - Math.pow(1 - b.grow, 3);
        b.mesh.scale.set(s, s, s);
      }
      if (b.label) b.label.position.y = 2.1 + Math.sin(time * 2 + b.x) * 0.08;
    }
  };

  const step = (now: number) => {
    frame = requestAnimationFrame(step);
    // Fixed small steps, so slow phones run and jump just like fast ones.
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    for (let left = dt; left > 1e-6; left -= 1 / 60) {
      tick(Math.min(left, 1 / 60));
    }

    // The runner: position, facing and a walk cycle.
    runner.root.position.copy(pos);
    const turn = facing - runner.root.rotation.y;
    runner.root.rotation.y +=
      Math.atan2(Math.sin(turn), Math.cos(turn)) * Math.min(1, dt * 14);
    walk += moving && grounded ? dt * 11 : 0;
    const swing =
      moving && grounded ? Math.sin(walk) * 0.7 : grounded ? 0 : 0.5;
    runner.legL.rotation.x = swing;
    runner.legR.rotation.x = grounded ? -swing : -0.3;
    runner.armL.rotation.x = -swing;
    runner.armR.rotation.x = grounded ? swing : -2.6;

    // The shadow on the highest block below the runner.
    let below: Block | null = null;
    for (const b of blocks) {
      if (!b.solid || b.falling || !inside(b, pos.x, pos.z, 0)) continue;
      if (b.top <= pos.y + 0.05 && (!below || b.top > below.top)) below = b;
    }
    shadow.visible = !!below;
    if (below) shadow.position.set(pos.x, below.top + 0.02, pos.z);

    // Chase camera behind and above.
    const k = 1 - Math.exp(-dt * 6);
    camPos.lerp(
      new T.Vector3(pos.x * 0.6, Math.max(pos.y, -2) + 4.6, pos.z + 7.5),
      k,
    );
    camera.position.copy(camPos);
    look.set(pos.x * 0.8, Math.max(pos.y, -2) + 1, pos.z - 4);
    camera.lookAt(look);

    renderer.render(scene, camera);
  };
  frame = requestAnimationFrame(step);

  const find = (gate: number, choice: number) =>
    blocks.find(
      (b) => b.kind === "answer" && b.gate === gate && b.choice === choice,
    );

  return {
    openGate: (gate) => {
      for (const b of blocks) {
        if (
          b.gate === gate + 1 &&
          (b.kind === "path" || b.kind === "check" || b.kind === "finish")
        ) {
          b.solid = true;
          b.mesh.visible = true;
          b.grow = 0;
          b.mesh.scale.set(0.01, 0.01, 0.01);
        }
      }
      // The other answers of this gate drop away.
      for (const b of blocks) {
        if (b.kind === "answer" && b.gate === gate && !landed.has(b))
          b.crumble = 0.2;
      }
    },
    crumble: (gate, choice) => {
      const b = find(gate, choice);
      if (!b) return;
      (
        b.mesh as THREE_NS.Mesh<
          THREE_NS.BoxGeometry,
          THREE_NS.MeshLambertMaterial
        >
      ).material.color.set(0xef4444);
      b.crumble = 0.35;
    },
    markRight: (gate, choice) => {
      const b = find(gate, choice);
      if (!b) return;
      (
        b.mesh as THREE_NS.Mesh<
          THREE_NS.BoxGeometry,
          THREE_NS.MeshLambertMaterial
        >
      ).material.color.set(0x22c55e);
    },
    setControls: (c) => {
      // A press is remembered at once, so even a very quick tap jumps.
      if (c.jump && !controls.jump) jumpBuffer = 0.15;
      Object.assign(controls, c);
    },
    where: () => ({ x: pos.x, y: pos.y, z: pos.z, grounded }),
    dropOnto: (kind, gate, choice) => {
      const b = blocks.find(
        (x) =>
          x.kind === kind &&
          x.gate === gate &&
          (choice === undefined || x.choice === choice) &&
          x.solid &&
          !x.falling,
      );
      if (!b) return false;
      pos.set(b.x, b.top + 1, b.z);
      vy = 0;
      return true;
    },
    dispose: () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      scene.traverse((o) => {
        const m = o as THREE_NS.Mesh;
        m.geometry?.dispose();
        const mat = m.material as
          THREE_NS.Material | THREE_NS.Material[] | undefined;
        for (const x of Array.isArray(mat) ? mat : mat ? [mat] : []) {
          (x as THREE_NS.SpriteMaterial).map?.dispose();
          x.dispose();
        }
      });
      renderer.dispose();
    },
  };
}
