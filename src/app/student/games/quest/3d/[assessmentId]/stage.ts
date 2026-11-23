/**
 * The 3D arena for Momo's Quest 3D Battle: the hero (a ghost mage) and the
 * monster (a horned skull warrior), both made with Tripo and animated there,
 * facing each other on a glowing arena. The React screen calls these moves;
 * each returns a promise that resolves when the move is over.
 *
 * three.js is passed in (loaded with a dynamic import) so it isn't in the
 * page's main bundle.
 */
import type * as THREE_NS from "three";
import type {
  GLTF,
  GLTFLoader,
} from "three/examples/jsm/loaders/GLTFLoader.js";

type T = typeof THREE_NS;

/** The part of each move that matters, in seconds of its clip. */
type Cut = { from: number; to: number; impact?: number; speed?: number };
const HERO_CUTS: Record<string, Cut> = {
  attack: { from: 0.7, to: 2.6, impact: 1.8, speed: 1.3 },
  power: { from: 0.6, to: 2.6, impact: 1.6, speed: 1.1 },
  hit: { from: 0, to: 1.7, speed: 1.2 },
  fall: { from: 0, to: 2.6 },
  win: { from: 0, to: 2.3 },
};
const MONSTER_CUTS: Record<string, Cut> = {
  attack: { from: 0.3, to: 1.8, impact: 1.0, speed: 1.1 },
  power: { from: 0.4, to: 2.5, impact: 1.5, speed: 1.1 },
  hit: { from: 0.1, to: 2.2, speed: 1.4 },
  taunt: { from: 0, to: 3.5 },
};

export type Stage = {
  heroAttack: (power: boolean) => Promise<void>;
  monsterAttack: (power: boolean) => Promise<void>;
  monsterDefeat: () => Promise<void>;
  heroWin: () => Promise<void>;
  heroFall: () => Promise<void>;
  reset: () => void;
  dispose: () => void;
};

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

type Actor = {
  root: THREE_NS.Object3D;
  play: (
    name: string,
    cut: Cut,
    opts?: { hold?: boolean; onImpact?: () => void },
  ) => Promise<void>;
  update: (dt: number) => void;
  flash: (color: number) => void;
};

function makeActor(THREE: T, gltf: GLTF, idle: string): Actor {
  const root = gltf.scene;
  const mixer = new THREE.AnimationMixer(root);
  const actions = new Map(
    gltf.animations.map((c) => [c.name, mixer.clipAction(c)]),
  );
  const idleAction = actions.get(idle)!;
  idleAction.play();
  let current: THREE_NS.AnimationAction = idleAction;
  let segment: {
    action: THREE_NS.AnimationAction;
    cut: Cut;
    hold: boolean;
    done: () => void;
    impact?: () => void;
  } | null = null;
  const materials: THREE_NS.MeshStandardMaterial[] = [];
  root.traverse((o) => {
    const mesh = o as THREE_NS.Mesh;
    if (mesh.isMesh) {
      mesh.frustumCulled = false; // skinned meshes move outside their box
      const m = mesh.material as THREE_NS.MeshStandardMaterial;
      materials.push(m);
    }
  });
  let flashLeft = 0;

  const to = (next: THREE_NS.AnimationAction, fade = 0.15) => {
    if (next === current) return;
    next.enabled = true;
    next.setEffectiveWeight(1);
    next.crossFadeFrom(current, fade, false);
    current = next;
  };

  return {
    root,
    play(name, cut, opts = {}) {
      const action = actions.get(name);
      if (!action) return Promise.resolve();
      action.reset();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.timeScale = cut.speed ?? 1;
      action.time = cut.from;
      action.play();
      to(action);
      return new Promise<void>((done) => {
        segment = {
          action,
          cut,
          hold: !!opts.hold,
          done,
          impact: opts.onImpact,
        };
      });
    },
    update(dt) {
      mixer.update(dt);
      const s = segment;
      if (s) {
        if (
          s.impact &&
          s.cut.impact !== undefined &&
          s.action.time >= s.cut.impact
        ) {
          s.impact();
          s.impact = undefined;
        }
        if (s.action.time >= s.cut.to - 0.01 || !s.action.isRunning()) {
          segment = null;
          if (s.hold) s.action.paused = true;
          else {
            idleAction.reset().play();
            to(idleAction, 0.3);
          }
          s.impact?.();
          s.done();
        }
      }
      if (flashLeft > 0) {
        flashLeft = Math.max(0, flashLeft - dt);
        const k = flashLeft / 0.35;
        for (const m of materials) m.emissiveIntensity = k * 1.6;
      }
    },
    flash(color) {
      for (const m of materials) m.emissive.setHex(color);
      flashLeft = 0.35;
    },
  };
}

export async function createStage(
  THREE: T,
  Loader: typeof GLTFLoader,
  canvas: HTMLCanvasElement,
  onProgress: (fraction: number) => void,
): Promise<Stage> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x140c2e);
  scene.fog = new THREE.Fog(0x140c2e, 6, 14);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 50);
  const camBase = new THREE.Vector3(0, 1.05, 3.9);
  const lookAt = new THREE.Vector3(0, 0.62, 0);

  // light: soft sky, a warm key, and coloured rims for each side
  scene.add(new THREE.HemisphereLight(0xc7d2fe, 0x2e1065, 1.6));
  const key = new THREE.DirectionalLight(0xfff1d6, 2.2);
  key.position.set(1, 4, 4);
  scene.add(key);
  const rimHero = new THREE.PointLight(0x22d3ee, 6, 6);
  rimHero.position.set(-2.4, 1.6, -0.6);
  scene.add(rimHero);
  const rimMonster = new THREE.PointLight(0xf43f5e, 6, 6);
  rimMonster.position.set(2.4, 1.6, -0.6);
  scene.add(rimMonster);

  // the arena: a dark disc with a glowing ring, pillars and stars
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(5, 64),
    new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.9 }),
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(2.25, 2.35, 96),
    new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      transparent: true,
      opacity: 0.8,
    }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.005;
  scene.add(ring);
  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0x312e81,
    emissive: 0x6d28d9,
    emissiveIntensity: 0.6,
  });
  // only behind the fighters, so none stand between them and the camera
  for (let i = 0; i < 7; i++) {
    const a = Math.PI + ((i + 0.5) / 7) * Math.PI;
    const p = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.12, 1.4 + (i % 3) * 0.35, 8),
      pillarMat,
    );
    p.position.set(Math.cos(a) * 3.6, 0.7, Math.sin(a) * 2.4 - 0.6);
    scene.add(p);
  }
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(600 * 3);
  for (let i = 0; i < 600; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 24;
    starPos[i * 3 + 1] = 1.5 + Math.random() * 8;
    starPos[i * 3 + 2] = -4 - Math.random() * 8;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  scene.add(
    new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0xe0e7ff, size: 0.04 }),
    ),
  );

  const shadow = (x: number, r: number) => {
    const s = new THREE.Mesh(
      new THREE.CircleGeometry(r, 32),
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.45,
      }),
    );
    s.rotation.x = -Math.PI / 2;
    s.position.set(x, 0.01, 0);
    scene.add(s);
    return s;
  };

  // the two characters (downloaded together, with one progress bar)
  const loader = new Loader();
  const progress = [0, 0];
  const load = (url: string, i: number) =>
    loader.loadAsync(url, (e) => {
      progress[i] = e.total ? e.loaded / e.total : 0;
      onProgress((progress[0]! + progress[1]!) / 2);
    });
  const [heroGltf, monsterGltf] = await Promise.all([
    load("/models/battle/hero.glb", 0),
    load("/models/battle/monster.glb", 1),
  ]);
  onProgress(1);

  const hero = makeActor(THREE, heroGltf, "idle");
  const monster = makeActor(THREE, monsterGltf, "idle");
  const HERO_X = -1.05;
  const MONSTER_X = 1.1;
  hero.root.position.set(HERO_X, 0, 0);
  hero.root.rotation.y = 1.05; // faces the monster, turned a little to us
  monster.root.position.set(MONSTER_X, 0, 0);
  monster.root.rotation.y = -1.0;
  monster.root.scale.setScalar(1.22);
  scene.add(hero.root, monster.root);
  shadow(HERO_X, 0.32);
  const monsterShadow = shadow(MONSTER_X, 0.42);

  // ---- effects: spell orbs with a trail, bursts, and a camera shake ----
  type Particle = {
    mesh: THREE_NS.Mesh;
    vel: THREE_NS.Vector3;
    life: number;
    max: number;
  };
  const particles: Particle[] = [];
  const sparkGeo = new THREE.SphereGeometry(1, 8, 6);
  const petalGeo = new THREE.PlaneGeometry(1, 0.6);
  const burst = (
    at: THREE_NS.Vector3,
    color: number,
    count: number,
    petals = false,
  ) => {
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(
        petals ? petalGeo : sparkGeo,
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      const size = petals
        ? 0.07 + Math.random() * 0.05
        : 0.025 + Math.random() * 0.03;
      mesh.scale.setScalar(size);
      mesh.position.copy(at);
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        Math.random() * 2.6,
        (Math.random() - 0.5) * 3,
      );
      const max = 0.5 + Math.random() * 0.5;
      scene.add(mesh);
      particles.push({ mesh, vel, life: max, max });
    }
  };
  let shake = 0;
  const flights: {
    orb: THREE_NS.Mesh;
    light: THREE_NS.PointLight;
    from: THREE_NS.Vector3;
    to: THREE_NS.Vector3;
    t: number;
    dur: number;
    color: number;
    petals: boolean;
    done: () => void;
  }[] = [];
  const fly = (
    fromX: number,
    toX: number,
    color: number,
    big: boolean,
    petals: boolean,
  ) =>
    new Promise<void>((done) => {
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(big ? 0.16 : 0.1, 16, 12),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending,
        }),
      );
      const light = new THREE.PointLight(color, 8, 2.5);
      const from = new THREE.Vector3(fromX, 0.92, 0.1);
      const to = new THREE.Vector3(toX, 0.95, 0);
      orb.position.copy(from);
      light.position.copy(from);
      scene.add(orb, light);
      flights.push({
        orb,
        light,
        from,
        to,
        t: 0,
        dur: big ? 0.5 : 0.38,
        color,
        petals,
        done,
      });
    });

  // ---- the render loop ----
  const clock = new THREE.Clock();
  let raf = 0;
  let disposed = false;
  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // narrow phone screens: step back so both fighters fit
    camBase.z = camera.aspect < 1.2 ? 3.9 + (1.2 - camera.aspect) * 3.2 : 3.9;
    camera.updateProjectionMatrix();
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  const frame = () => {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    hero.update(dt);
    monster.update(dt);
    ring.rotation.z += dt * 0.15;
    for (let i = flights.length - 1; i >= 0; i--) {
      const f = flights[i]!;
      f.t += dt / f.dur;
      const p = Math.min(1, f.t);
      f.orb.position.lerpVectors(f.from, f.to, p);
      f.orb.position.y += Math.sin(p * Math.PI) * 0.25;
      f.light.position.copy(f.orb.position);
      if (Math.random() < 0.7) burst(f.orb.position, f.color, 1, f.petals);
      if (p >= 1) {
        scene.remove(f.orb, f.light);
        f.orb.geometry.dispose();
        flights.splice(i, 1);
        burst(f.to, f.color, f.petals ? 40 : 26, f.petals);
        f.done();
      }
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]!;
      p.life -= dt;
      p.vel.y -= 4 * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.rotation.x += dt * 6;
      (p.mesh.material as THREE_NS.MeshBasicMaterial).opacity = Math.max(
        0,
        p.life / p.max,
      );
      if (p.life <= 0) {
        scene.remove(p.mesh);
        (p.mesh.material as THREE_NS.Material).dispose();
        particles.splice(i, 1);
      }
    }
    shake = Math.max(0, shake - dt * 2.5);
    camera.position.set(
      camBase.x + (Math.random() - 0.5) * shake * 0.12,
      camBase.y + (Math.random() - 0.5) * shake * 0.12,
      camBase.z,
    );
    camera.lookAt(lookAt);
    renderer.render(scene, camera);
  };
  frame();

  // ---- the moves the screen asks for ----
  let monsterFade = 1;
  const setMonsterOpacity = (o: number) => {
    monster.root.traverse((n) => {
      const m = (n as THREE_NS.Mesh).material as
        THREE_NS.MeshStandardMaterial | undefined;
      if (m) {
        m.transparent = o < 1;
        m.opacity = o;
      }
    });
    monsterShadow.material.opacity = 0.45 * o;
  };

  return {
    async heroAttack(power) {
      const color = power ? 0xf472b6 : 0x67e8f9;
      let landed: Promise<void> = Promise.resolve();
      const move = hero.play(
        power ? "power" : "attack",
        HERO_CUTS[power ? "power" : "attack"]!,
        {
          onImpact: () => {
            landed = fly(
              HERO_X + 0.35,
              MONSTER_X - 0.1,
              color,
              power,
              power,
            ).then(() => {
              monster.flash(power ? 0xff2d95 : 0xffffff);
              shake = power ? 1 : 0.55;
              void monster.play("hit", MONSTER_CUTS.hit!);
            });
          },
        },
      );
      await move;
      await landed;
      await wait(250);
    },
    async monsterAttack(power) {
      const color = power ? 0x7c3aed : 0xef4444;
      let landed: Promise<void> = Promise.resolve();
      const move = monster.play(
        power ? "power" : "attack",
        MONSTER_CUTS[power ? "power" : "attack"]!,
        {
          onImpact: () => {
            landed = fly(
              MONSTER_X - 0.35,
              HERO_X + 0.1,
              color,
              power,
              false,
            ).then(() => {
              hero.flash(0xff0000);
              shake = power ? 1 : 0.6;
              void hero.play("hit", HERO_CUTS.hit!);
            });
          },
        },
      );
      await move;
      await landed;
      await wait(500);
    },
    async monsterDefeat() {
      await monster.play("hit", MONSTER_CUTS.hit!, { hold: true });
      // topple back and fade away
      const start = performance.now();
      await new Promise<void>((done) => {
        const step = () => {
          const k = Math.min(1, (performance.now() - start) / 900);
          monster.root.rotation.x = -k * 1.35;
          monster.root.position.y = -k * 0.15;
          monsterFade = 1 - k;
          setMonsterOpacity(monsterFade);
          burst(
            new THREE.Vector3(MONSTER_X, 0.4 + Math.random() * 0.8, 0),
            0xa78bfa,
            2,
          );
          if (k < 1) requestAnimationFrame(step);
          else done();
        };
        step();
      });
      monster.root.visible = false;
    },
    heroWin() {
      burst(new THREE.Vector3(HERO_X, 1.3, 0), 0xfacc15, 50);
      return hero.play("win", HERO_CUTS.win!);
    },
    async heroFall() {
      await hero.play("fall", HERO_CUTS.fall!, { hold: true });
      void monster.play("taunt", MONSTER_CUTS.taunt!);
    },
    reset() {
      monster.root.visible = true;
      monster.root.rotation.x = 0;
      monster.root.position.y = 0;
      setMonsterOpacity(1);
      void hero.play("win", { from: 0, to: 0.05 });
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      renderer.dispose();
    },
  };
}
