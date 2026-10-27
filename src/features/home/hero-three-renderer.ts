import * as THREE from "three";
import type { HeroProjectMeta } from "@/content/contracts";
import { designTokens } from "@/lib/design-system/tokens";
import { createHeroFrameLoop } from "./hero-frame-loop";
import { boundedPixelRatio, boundedPointer, FIXED_EXHIBITS, ROOM_GRID_LINE_WIDTH_PX, roomGridScale, roomSignalMix, THREE_ROOM_SURFACES, type RoomQuad } from "./hero-three-geometry";
import { markRoomIntroComplete, roomIntroFrame, type RoomIntroKey } from "./room-intro";

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const fragmentShader = `
  uniform vec3 night;
  uniform vec3 graphite;
  uniform vec3 mineral;
  uniform vec3 paper;
  uniform vec3 blue;
  uniform vec3 red;
  uniform vec3 lightPoint;
  uniform float signalMix;
  uniform float isImage;
  uniform float imageReady;
  uniform float selected;
  uniform float outlineMix;
  uniform float introParallel;
  uniform float introCross;
  uniform float parallelIsY;
  uniform vec2 gridScale;
  uniform sampler2D projectImage;
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vec2 gridPixel = max(fwidth(vUv * gridScale), vec2(.001));
    vec2 grid = abs(fract(vUv * gridScale - .5) - .5) / (gridPixel * ${ROOM_GRID_LINE_WIDTH_PX.toFixed(2)});
    vec2 rule = 1.0 - smoothstep(vec2(0.0), vec2(1.0), grid);
    float localLight = exp(-dot(vPosition - lightPoint, vPosition - lightPoint) / 10.0);
    // One coherent signal follows the pointer: blue at room-left, red at room-right.
    vec3 signal = mix(blue, red, smoothstep(0.0, 1.0, signalMix));
    vec3 ink = night + signal * localLight * .20 * smoothstep(1.0, 1.06, introCross);
    // Apply one optical fade to both line families. The denser axis controls
    // perspective suppression so corridor-parallel rays cannot remain bright
    // after the perpendicular lines have faded.
    float corridorDepth = max(0.0, 4.5 - vPosition.z);
    float perspectiveCompression = smoothstep(.08, .55, max(gridPixel.x, gridPixel.y));
    float gridVisibility = exp(-corridorDepth * .036 - perspectiveCompression * 2.75);
    float depthFromEntrance = 1.0 - exp(-max(0.0, 7.0 - vPosition.z) * .09);
    float parallelReveal = smoothstep(depthFromEntrance, depthFromEntrance + .06, introParallel);
    float crossReveal = smoothstep(depthFromEntrance, depthFromEntrance + .06, introCross);
    float parallelRule = mix(rule.x, rule.y, parallelIsY);
    float crossRule = mix(rule.y, rule.x, parallelIsY);
    float gridContribution = max(parallelRule * parallelReveal, crossRule * crossReveal) * gridVisibility;
    ink = mix(ink, paper, gridContribution);
    if (isImage > .5) {
      vec3 photo = texture2D(projectImage, vUv).rgb;
      float gray = dot(photo, vec3(.2126, .7152, .0722));
      photo = mix(vec3(gray), photo, .50 + selected * .50);
      ink = mix(mix(night, graphite, .24), photo * (.78 + selected * .14), imageReady);
      // Keep the room glow on inactive photos, but show the selected photo without a color cast.
      ink += signal * localLight * .12 * (1.0 - selected);
      float edgeDistance = min(min(vUv.x, 1.0-vUv.x), min(vUv.y, 1.0-vUv.y));
      float edgeWidth = mix(.003, .006, selected);
      float edgeFeather = max(fwidth(edgeDistance), .0008);
      float edge = 1.0 - smoothstep(edgeWidth, edgeWidth + edgeFeather, edgeDistance);
      vec3 outline = mix(blue, red, smoothstep(.45, .55, outlineMix));
      ink = mix(ink, outline, edge * mix(.35, .95, selected));
    }
    gl_FragColor = vec4(ink, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function geometry(quad: RoomQuad) {
  const result = new THREE.BufferGeometry();
  result.setAttribute("position", new THREE.Float32BufferAttribute(quad.points.flat(), 3));
  result.setAttribute("uv", new THREE.Float32BufferAttribute(quad.uv.flat(), 2));
  result.setIndex([0, 1, 2, 0, 2, 3]);
  result.computeVertexNormals();
  return result;
}

type RendererOptions = {
  canvas: HTMLCanvasElement;
  host: HTMLElement;
  paths: readonly SVGPathElement[];
  projects: readonly HeroProjectMeta[];
  introKey: RoomIntroKey;
  playIntro: boolean;
  onIntroComplete(): void;
  onFailure(): void;
};

type OwnedResources = {
  disposed: boolean;
  renderer?: THREE.WebGLRenderer;
  scene?: THREE.Scene;
  materials: THREE.ShaderMaterial[];
  textures: Set<THREE.Texture>;
  loop?: ReturnType<typeof createHeroFrameLoop>;
  resizeObserver?: ResizeObserver;
  contextLossHandler?: (event: Event) => void;
};

function disposeOwnedResources(owned: OwnedResources, canvas: HTMLCanvasElement) {
  if (owned.disposed) return;
  owned.disposed = true;
  owned.loop?.dispose();
  owned.resizeObserver?.disconnect();
  if (owned.contextLossHandler) canvas.removeEventListener("webglcontextlost", owned.contextLossHandler);
  owned.scene?.traverse((object) => { if (object instanceof THREE.Mesh) object.geometry.dispose(); });
  owned.materials.forEach((entry) => entry.dispose());
  owned.textures.forEach((entry) => entry.dispose());
  owned.scene?.clear();
  owned.renderer?.dispose();
}

/** Dynamically imported only in the browser. All GPU ownership stays in this module. */
export function createHeroRoom({ canvas, host, paths, projects, introKey, playIntro, onIntroComplete, onFailure }: RendererOptions) {
  const owned: OwnedResources = { disposed: false, materials: [], textures: new Set() };
  try {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "low-power" });
  THREE.Cache.enabled = true;
  owned.renderer = renderer;
  renderer.setPixelRatio(boundedPixelRatio(window.devicePixelRatio));
  renderer.setClearColor(designTokens.color.night);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); owned.scene = scene;
  const camera = new THREE.PerspectiveCamera(55, 1, .1, 1000);
  camera.position.set(0, 0, 12);
  const materials = owned.materials, textures = owned.textures;
  const lightPoint = new THREE.Vector3(6, -3, -6), ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2(.6, -.3), projected = new THREE.Vector3();
  let parallaxEnabled = false, pointerActive = false, selected = -1, width = 1, height = 1;
  let lastFrame = 0;
  let targetYaw = 0, targetPitch = 0;
  let signalMix = roomSignalMix(lightPoint.x), targetSignalMix = signalMix;
  let introElapsed = 0, introPlaying = playIntro;
  const imageReady = projects.map(() => false);

  function material(image = false, outlineMix = .5) {
    const result = new THREE.ShaderMaterial({
      vertexShader, fragmentShader, side: THREE.DoubleSide,
      polygonOffset: image, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
      uniforms: {
        ...Object.fromEntries(Object.entries(designTokens.color).map(([key, color]) => [key, { value: new THREE.Color(color) }])),
        lightPoint: { value: lightPoint }, signalMix: { value: signalMix },
        isImage: { value: image ? 1 : 0 }, imageReady: { value: 0 }, selected: { value: 0 }, outlineMix: { value: outlineMix },
        introParallel: { value: playIntro ? 0 : 1.06 }, introCross: { value: playIntro ? 0 : 1.06 }, parallelIsY: { value: 0 },
        gridScale: { value: new THREE.Vector2(12, 8) }, projectImage: { value: null },
      },
    });
    materials.push(result);
    return result;
  }

  const roomMeshes = THREE_ROOM_SURFACES.map((quad) => {
    const surfaceMaterial = material();
    surfaceMaterial.uniforms.gridScale.value.set(...roomGridScale(quad.surface));
    surfaceMaterial.uniforms.parallelIsY.value = quad.surface === "left" || quad.surface === "right" ? 1 : 0;
    const mesh = new THREE.Mesh(geometry(quad), surfaceMaterial);
    mesh.name = `room-${quad.surface}`;
    scene.add(mesh);
    return mesh;
  });
  const exhibitQuads = projects.map((_, index) => FIXED_EXHIBITS[index] ?? []);
  const exhibitOutlineMix = (quads: readonly RoomQuad[]) => {
    const points = quads.flatMap((quad) => quad.points);
    return roomSignalMix(points.reduce((sum, point) => sum + point[0], 0) / Math.max(1, points.length));
  };
  const mediaMaterials = projects.map((_, index) => material(true, exhibitOutlineMix(exhibitQuads[index])));
  const mediaMeshes = projects.map(() => [] as THREE.Mesh[]);
  exhibitQuads.forEach((quads, index) => quads.forEach((quad) => {
    const mesh = new THREE.Mesh(geometry(quad), mediaMaterials[index]);
    mesh.visible = false;
    mediaMeshes[index].push(mesh);
    scene.add(mesh);
  }));
  const updateLinks = () => exhibitQuads.forEach((quads, index) => {
    const path = paths[index]; if (!path) return;
    path.setAttribute("d", quads.map((quad) => quad.points.map((point, vertex) => {
      projected.set(...point).project(camera);
      return `${vertex === 0 ? "M" : "L"}${((projected.x + 1) * width / 2).toFixed(2)},${((1 - projected.y) * height / 2).toFixed(2)}`;
    }).join(" ") + "Z").join(" "));
  });

  const loop = createHeroFrameLoop((now) => {
    if (owned.disposed) return false;
    const delta = lastFrame ? Math.min(now - lastFrame, 50) : 0; lastFrame = now;
    let introFinished = false;
    if (introPlaying) {
      introElapsed += delta;
      const intro = roomIntroFrame(introElapsed, projects.length);
      roomMeshes.forEach((mesh) => {
        const uniforms = (mesh.material as THREE.ShaderMaterial).uniforms;
        uniforms.introParallel.value = intro.parallel;
        uniforms.introCross.value = intro.cross;
      });
      mediaMeshes.forEach((meshes, index) => meshes.forEach((mesh) => {
        mesh.visible = imageReady[index] && index < intro.visibleImages;
      }));
      introFinished = intro.complete;
    }
    const damping = 1 - Math.exp(-delta / 110);
    camera.rotation.y += (targetYaw - camera.rotation.y) * damping;
    camera.rotation.x += (targetPitch - camera.rotation.x) * damping;
    camera.updateMatrixWorld();
    let illuminationSettling = false;
    if (pointerActive) {
      ray.setFromCamera(pointer, camera);
      const hit = ray.intersectObjects(roomMeshes, false)[0];
      if (hit) {
        illuminationSettling = lightPoint.distanceToSquared(hit.point) > .0001;
        lightPoint.lerp(hit.point, damping);
        targetSignalMix = roomSignalMix(hit.point.x);
      }
      illuminationSettling ||= Math.abs(targetSignalMix - signalMix) > .0001;
      signalMix += (targetSignalMix - signalMix) * damping;
      materials.forEach((entry) => { entry.uniforms.signalMix.value = signalMix; });
    }
    updateLinks();
    try { renderer.render(scene, camera); }
    catch { onFailure(); return false; }
    if (introFinished) {
      introPlaying = false;
      host.dataset.roomIntro = "complete";
      markRoomIntroComplete(introKey);
      onIntroComplete();
    }
    return introPlaying || illuminationSettling || Math.abs(targetYaw - camera.rotation.y) + Math.abs(targetPitch - camera.rotation.x) > .00001;
  }); owned.loop = loop;

  const resize = () => {
    width = Math.max(1, host.clientWidth); height = Math.max(1, host.clientHeight);
    camera.aspect = width / height;
    // Keep the entire five-surface cross-section legible on compact screens.
    camera.fov = width < 768 ? 64 : 55;
    camera.position.z = width < 768 ? 12 + Math.max(0, 1.4 - camera.aspect) * 12 : 12;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(boundedPixelRatio(window.devicePixelRatio));
    renderer.setSize(width, height, false); loop.wake();
  };
  const resizeObserver = new ResizeObserver(resize); owned.resizeObserver = resizeObserver; resizeObserver.observe(host); resize();
  const lost = (event: Event) => { event.preventDefault(); loop.suspend(true); onFailure(); }; owned.contextLossHandler = lost;
  canvas.addEventListener("webglcontextlost", lost);
  const loader = new THREE.TextureLoader();
  projects.forEach((project, index) => {
    // Same-origin optimized sources bound decode/upload size, including local catalog images.
    const url = `/_next/image?url=${encodeURIComponent(project.imageSrc)}&w=1080&q=75`;
    const texture = loader.load(url, (loaded) => {
      if (owned.disposed) { loaded.dispose(); return; }
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      mediaMaterials[index].uniforms.projectImage.value = loaded;
      mediaMaterials[index].uniforms.imageReady.value = 1;
      imageReady[index] = true;
      if (!introPlaying) mediaMeshes[index].forEach((mesh) => { mesh.visible = true; });
      loop.wake();
    }, undefined, () => { if (!owned.disposed) loop.wake(); });
    textures.add(texture);
  });

  return {
    setSuspended(value: boolean) {
      if (owned.disposed) return;
      lastFrame = 0;
      loop.suspend(value);
    },
    setParallaxEnabled(value: boolean) {
      if (owned.disposed) return;
      parallaxEnabled = value;
      if (!value) { targetYaw = 0; targetPitch = 0; camera.rotation.set(0, 0, 0); }
      loop.wake();
    },
    setPointer(x: number, y: number) {
      if (owned.disposed) return;
      const bounded = boundedPointer(x, y);
      pointerActive = true;
      targetYaw = parallaxEnabled ? -bounded.yaw : 0; targetPitch = parallaxEnabled ? -bounded.pitch : 0;
      pointer.set(bounded.x, -bounded.y);
      loop.wake();
    },
    select(index: number) {
      selected = index;
      mediaMaterials.forEach((entry, i) => { entry.uniforms.selected.value = i === selected ? 1 : 0; });
      loop.wake();
    },
    dispose() {
      disposeOwnedResources(owned, canvas);
    },
  };
  } catch (error) {
    disposeOwnedResources(owned, canvas);
    throw error;
  }
}

export type HeroRoomRenderer = ReturnType<typeof createHeroRoom>;
