/** Cursor-driven contour field: no continuous animation or per-frame allocations. */
export function initCursorField() {
  const host = document.querySelector('.cursor-field');
  if (!host) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const connection = navigator.connection;
  let dispose = null;
  let generation = 0;
  const eligible = () => !motion.matches && pointer.matches && !connection?.saveData
    && !(navigator.deviceMemory && navigator.deviceMemory <= 2);

  async function reconcile() {
    const ticket = ++generation;
    dispose?.();
    dispose = null;
    if (!eligible() || document.hidden) return;
    try {
      const THREE = await import('./vendor/three-field.min.js');
      if (ticket !== generation || !eligible() || document.hidden) return;
      dispose = createField(THREE, host);
    } catch { /* A static CSS glow remains if loading or WebGL is unavailable. */ }
  }
  motion.addEventListener('change', reconcile);
  pointer.addEventListener('change', reconcile);
  connection?.addEventListener('change', reconcile);
  // Release the GPU context while away; recreate on return, including bfcache restores.
  document.addEventListener('visibilitychange', reconcile);
  window.addEventListener('pagehide', () => { ++generation; dispose?.(); dispose = null; });
  window.addEventListener('pageshow', reconcile);
  if ('requestIdleCallback' in window) requestIdleCallback(reconcile, { timeout: 1500 });
  else setTimeout(reconcile, 100);
}

function createField(T, host) {
  const renderer = new T.WebGLRenderer({ alpha: true, antialias: false, depth: false,
    stencil: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(38, 1, 0.1, 30);
  camera.position.set(0, 0, 10);
  const group = new T.Group();
  scene.add(group);
  const columns = 64, rows = 26;
  const positions = new Float32Array(columns * rows * 3);
  const indices = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const i = row * columns + col;
      if (col < columns - 1) indices.push(i, i + 1);
    }
  }
  const geometry = new T.BufferGeometry();
  const attribute = new T.BufferAttribute(positions, 3);
  attribute.setUsage(T.DynamicDrawUsage);
  geometry.setAttribute('position', attribute);
  geometry.setIndex(indices);
  const material = new T.LineBasicMaterial({ color: 0x388a70, transparent: true, opacity: 0.36, depthTest: false });
  const lines = new T.LineSegments(geometry, material);
  lines.frustumCulled = false;
  group.add(lines);
  host.append(renderer.domElement);
  let targetX = 0, targetY = 0, x = 0, y = 0;
  let visible = false, stopped = false, timer = 0, frame = 0, last = -Infinity;
  let dirty = true;
  const interval = 1000 / 30;

  function cancel() { clearTimeout(timer); cancelAnimationFrame(frame); timer = frame = 0; }
  function wake() {
    if (stopped || !visible || document.hidden || timer || frame) return;
    timer = setTimeout(() => { timer = 0; frame = requestAnimationFrame(draw); }, Math.max(0, interval - (performance.now() - last)));
  }
  function draw(now) {
    frame = 0;
    if (stopped || !visible || document.hidden) return;
    if (now - last < interval) { wake(); return; }
    last = now;
    x += (targetX - x) * 0.16;
    y += (targetY - y) * 0.16;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const i = (row * columns + col) * 3;
        const px = (col / (columns - 1) - 0.5) * 17;
        const py = (row / (rows - 1) - 0.5) * 7;
        const distance = (px - x * 7) ** 2 + (py - y * 3) ** 2;
        const lift = Math.exp(-distance * 0.2) * 1.25;
        positions[i] = px;
        positions[i + 1] = py + Math.sin(px * 0.55 + row * 0.13) * 0.4 + lift * 0.6;
        positions[i + 2] = Math.cos(px * 0.42 + row * 0.22) * 0.7 + lift;
      }
    }
    attribute.needsUpdate = true;
    group.rotation.set(-0.22 + y * 0.055, x * 0.07, -0.13);
    renderer.render(scene, camera);
    dirty = false;
    if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.002) wake();
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    // Hard cap: 720k backing pixels, even on Retina / ultrawide displays.
    const scale = Math.min(1, Math.sqrt(720000 / Math.max(1, width * height)));
    renderer.setSize(Math.max(1, Math.floor(width * scale)), Math.max(1, Math.floor(height * scale)), false);
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
    dirty = true;
    wake();
  }
  function move(event) {
    if (!visible || event.pointerType === 'touch') return;
    const rect = host.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    targetY = Math.max(-1, Math.min(1, 1 - (event.clientY - rect.top) / rect.height * 2));
    wake();
  }
  function reset() { targetX = targetY = 0; wake(); }
  function theme() {
    const dark = document.documentElement.classList.contains('dark');
    material.color.setHex(dark ? 0xa5dc9d : 0x388a70);
    dirty = true;
    wake();
  }
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && (dirty || Math.abs(targetX - x) + Math.abs(targetY - y) > 0.002)) wake();
    else if (!visible) cancel();
  });
  intersection.observe(host);
  const sizes = new ResizeObserver(resize);
  sizes.observe(host);
  const themes = new MutationObserver(theme);
  themes.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('pointermove', move, { passive: true });
  document.documentElement.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  function destroy() {
    if (stopped) return;
    stopped = true;
    cancel();
    intersection.disconnect(); sizes.disconnect(); themes.disconnect();
    window.removeEventListener('pointermove', move);
    document.documentElement.removeEventListener('pointerleave', reset);
    window.removeEventListener('blur', reset);
    renderer.domElement.removeEventListener('webglcontextlost', destroy);
    geometry.dispose(); material.dispose(); renderer.dispose(); renderer.forceContextLoss();
    renderer.domElement.remove();
  }
  renderer.domElement.addEventListener('webglcontextlost', destroy);
  resize(); theme();
  return destroy;
}
