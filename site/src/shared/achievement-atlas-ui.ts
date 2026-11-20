import { bindResearchDetails } from "./achievement-research-ui";

export function initAtlas(root: HTMLDetailsElement) {
  const zoomConfig = JSON.parse(root.dataset.atlasZoom!) as { initial: number; min: number; max: number };
  const get = <T extends HTMLElement = HTMLElement>(attr: string) => root.querySelector<T>(`[data-${attr}]`)!;
  const stage = get("stage"), viewport = get("scroll"), canvas = get("canvas");
  const branches = Array.from(root.querySelectorAll<HTMLElement>("[data-domain]"));
  const paths = root.querySelector<SVGGElement>("[data-paths]")!;
  const hideResearch = bindResearchDetails(root, viewport);

  /* ---------- Panning ---------- */
  // Current CSS zoom of the canvas; rects are in zoomed pixels, layout (and the SVG wires) in canvas pixels.
  const scaleOf = () => canvas.getBoundingClientRect().width / canvas.offsetWidth || 1;
  function syncScrollEdges() {
    const end = viewport.scrollWidth - viewport.clientWidth, bottom = viewport.scrollHeight - viewport.clientHeight;
    stage.toggleAttribute("data-more-left", viewport.scrollLeft > 1);
    stage.toggleAttribute("data-more-right", viewport.scrollLeft < end - 1);
    stage.toggleAttribute("data-more-up", viewport.scrollTop > 1);
    stage.toggleAttribute("data-more-down", viewport.scrollTop < bottom - 1);
  }
  viewport.addEventListener("scroll", syncScrollEdges, { passive: true });

  // Drag the canvas with a mouse; touch and trackpads already scroll natively.
  let drag: { x: number; y: number; left: number; top: number; moved: boolean } | null = null;
  viewport.addEventListener("pointerdown", (e) => {
    const pannable = viewport.scrollWidth > viewport.clientWidth || viewport.scrollHeight > viewport.clientHeight;
    if (e.pointerType !== "mouse" || e.button !== 0 || !pannable) return;
    drag = { x: e.clientX, y: e.clientY, left: viewport.scrollLeft, top: viewport.scrollTop, moved: false };
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    if (!drag.moved) { drag.moved = true; viewport.setPointerCapture(e.pointerId); viewport.classList.add("dragging"); }
    viewport.scrollLeft = drag.left - dx;
    viewport.scrollTop = drag.top - dy;
  });
  // A drag ends with a click on whatever card is under the pointer; swallow that one click only.
  let swallowClick = false;
  viewport.addEventListener("click", (e) => { if (swallowClick) { e.preventDefault(); e.stopPropagation(); } }, { capture: true });
  const endDrag = () => {
    if (drag?.moved) {
      viewport.classList.remove("dragging");
      swallowClick = true;
      setTimeout(() => (swallowClick = false));
    }
    drag = null;
  };
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);

  // Zoom only the canvas. Anchor mouse input at the pointer and keyboard input at the centre.
  const desktop = window.matchMedia("(min-width: 651px)");
  let zoom = zoomConfig.initial;
  // Until someone zooms by hand, the tree opens at 100% or at whatever smaller scale fits it whole in the frame.
  let userZoomed = false;
  function fitZoom() {
    const frame = canvas.getBoundingClientRect(), scale = scaleOf();
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-research-card], [data-domain-node]"));
    if (!nodes.length || !frame.width) return zoom;
    const right = Math.max(...nodes.map((el) => (el.getBoundingClientRect().right - frame.left) / scale));
    const width = right + (parseFloat(getComputedStyle(canvas).paddingRight) || 0);
    const room = Math.min(viewport.clientWidth / width, (parseFloat(getComputedStyle(viewport).maxHeight) || Infinity) / canvas.offsetHeight);
    return Math.max(zoomConfig.min, Math.min(zoomConfig.initial, Math.floor(room * 100) / 100));
  }
  function applyFit() {
    if (userZoomed || !desktop.matches || root.hidden || !root.open) return;
    const next = fitZoom();
    if (Math.abs(next - zoom) < 0.005) return;
    zoom = next;
    root.style.setProperty("--zoom", String(next));
  }
  function setZoom(value: number, x: number, y: number) {
    userZoomed = true;
    const next = Math.max(zoomConfig.min, Math.min(zoomConfig.max, value));
    if (next === zoom) return false;
    const ratio = next / zoom;
    const left = (viewport.scrollLeft + x) * ratio - x;
    const top = (viewport.scrollTop + y) * ratio - y;
    zoom = next;
    hideResearch();
    root.style.setProperty("--zoom", String(next));
    viewport.scrollTo(left, top);
    refresh();
    return true;
  }
  function zoomAt(value: number, e: { clientX: number; clientY: number }) {
    const rect = viewport.getBoundingClientRect();
    setZoom(value, e.clientX - rect.left, e.clientY - rect.top);
  }
  // Two-finger scrolling is native on both axes. Chromium and Firefox mark pinch wheels with Ctrl.
  let gestureStartZoom: number | null = null;
  viewport.addEventListener("wheel", (e) => {
    if (!desktop.matches || !e.ctrlKey || !e.cancelable) return;
    e.preventDefault();
    if (gestureStartZoom !== null) return;
    const unit = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? viewport.clientHeight : 1;
    zoomAt(zoom * Math.exp(-e.deltaY * unit / 100), e);
  }, { passive: false });
  // Safari reports a cumulative scale for the whole pinch rather than wheel deltas.
  viewport.addEventListener("gesturestart", (e) => {
    if (!desktop.matches) return;
    e.preventDefault();
    gestureStartZoom = zoom;
  });
  viewport.addEventListener("gesturechange", (e) => {
    if (gestureStartZoom === null) return;
    e.preventDefault();
    const gesture = e as MouseEvent & { scale: number };
    zoomAt(gestureStartZoom * gesture.scale, gesture);
  });
  viewport.addEventListener("gestureend", (e) => {
    if (gestureStartZoom !== null) e.preventDefault();
    gestureStartZoom = null;
  });
  viewport.addEventListener("keydown", (e) => {
    if (!desktop.matches || e.target !== viewport || e.ctrlKey || e.metaKey || e.altKey) return;
    const value = e.key === "0" ? fitZoom() : e.key === "-" ? zoom / 1.2 : e.key === "+" || e.key === "=" ? zoom * 1.2 : null;
    if (value === null) return;
    e.preventDefault();
    const changed = setZoom(value, viewport.clientWidth / 2, viewport.clientHeight / 2);
    // 0 returns to the fitted scale and lets it follow the window again.
    if (e.key === "0") userZoomed = false;
    if (changed) get("live").textContent = `${Math.round(zoom * 100)}%`;
  });

  // A common trunk feeds the four directions. A direction branches to its own research cards.
  function drawWires() {
    const frame = canvas.getBoundingClientRect();
    if (root.hidden || !root.open || !frame.width || !branches.length) return;
    const scale = scaleOf();
    const box = (el: Element) => {
      const rect = el.getBoundingClientRect();
      return {
        left: (rect.left - frame.left) / scale,
        right: (rect.right - frame.left) / scale,
        center: (rect.top + rect.height / 2 - frame.top) / scale,
      };
    };
    const point = (n: number) => Math.round(n * 10) / 10;
    const pathsMarkup: string[] = [];
    const wire = (d: string, cls: string) => pathsMarkup.push(`<path class="${cls}" d="${d}"/>`);

    // Every connector has the same shape: out of the parent, along one shared vertical line,
    // and into each child with the same rounded turn. Children on one line read as siblings.
    const near = (a: number, b: number) => Math.abs(a - b) < 0.5;
    function fan(fromX: number, fromY: number, busX: number, ends: { x: number; y: number }[]) {
      const [x0, y0, bx] = [point(fromX), point(fromY), point(busX)];
      const targets = ends.map((end) => ({ x: point(end.x), y: point(end.y) }));
      const top = Math.min(y0, ...targets.map((end) => end.y)), bottom = Math.max(y0, ...targets.map((end) => end.y));
      const r = point(Math.max(0, Math.min(12, (bottom - top) / 2, bx - x0, ...targets.map((end) => end.x - bx))));
      const d = targets.filter((end) => near(end.y, y0)).map((end) => `M${x0} ${y0} H${end.x}`);
      if (bottom - top < 0.5) return d.join(" ");
      if (near(y0, top)) d.push(`M${x0} ${y0} H${point(bx - r)} Q${bx} ${y0} ${bx} ${point(y0 + r)}`);
      else if (near(y0, bottom)) d.push(`M${x0} ${y0} H${point(bx - r)} Q${bx} ${y0} ${bx} ${point(y0 - r)}`);
      else if (!d.length) d.push(`M${x0} ${y0} H${bx}`);
      d.push(`M${bx} ${point(top + r)} V${point(bottom - r)}`);
      for (const end of targets) {
        if (near(end.y, y0)) continue;
        if (near(end.y, top)) d.push(`M${bx} ${point(top + r)} Q${bx} ${top} ${point(bx + r)} ${top} H${end.x}`);
        else if (near(end.y, bottom)) d.push(`M${bx} ${point(bottom - r)} Q${bx} ${bottom} ${point(bx + r)} ${bottom} H${end.x}`);
        else d.push(`M${bx} ${end.y} H${end.x}`);
      }
      return d.join(" ");
    }

    const routes = branches.map((branch) => {
      const node = branch.querySelector("[data-domain-node]")!;
      const topics = Array.from(branch.querySelectorAll<HTMLElement>("[data-research-card]"), (el) => ({
        ...box(el),
        id: el.dataset.researchCard,
        predecessor: el.dataset.researchPredecessor,
      }));
      return { node: box(node), topics };
    });
    const first = routes[0].node;
    const last = routes[routes.length - 1].node;
    const top = point(first.center), bottom = point(last.center), middle = point((top + bottom) / 2);
    const hub = get("hub");
    const medal = hub.querySelector(".medal")!;
    hub.style.transform = "";
    hub.style.transform = `translateY(${point(middle - box(medal).center)}px)`;
    const hubRight = box(medal).right;
    wire(fan(hubRight, middle, (hubRight + first.left) / 2, routes.map(({ node }) => ({ x: node.left, y: node.center }))), "w-trunk");

    for (const { node, topics } of routes) {
      const roots = topics.filter((topic) => !topics.some((source) => source.id === topic.predecessor));
      if (roots.length) {
        const busX = (node.right + Math.min(...roots.map((topic) => topic.left))) / 2;
        wire(fan(node.right, node.center, busX, roots.map((topic) => ({ x: topic.left, y: topic.center }))), "w-fork");
      }
      // A follow-up project hangs off its prerequisite with an arrow that stops just short of the card.
      for (const topic of topics) {
        const source = topics.find((candidate) => candidate.id === topic.predecessor);
        if (!source) continue;
        const tipX = point(topic.left - 3), tipY = point(topic.center);
        const arrow = ` M${point(tipX - 7)} ${point(tipY - 4.5)} L${tipX} ${tipY} L${point(tipX - 7)} ${point(tipY + 4.5)}`;
        wire(fan(source.right, source.center, (source.right + tipX) / 2, [{ x: tipX, y: tipY }]) + arrow, "w-dependency");
      }
    }
    paths.innerHTML = pathsMarkup.join("");
  }

  let queued = 0;
  const refresh = () => {
    cancelAnimationFrame(queued);
    queued = requestAnimationFrame(() => { applyFit(); drawWires(); syncScrollEdges(); });
  };
  const observer = new ResizeObserver(refresh);
  observer.observe(viewport);
  observer.observe(canvas);
  root.addEventListener("toggle", refresh);
  document.fonts?.ready.then(refresh);
  refresh();

  function revealLinkedRoute() {
    if (root.hidden) return;
    const hash = location.hash.slice(1);
    let heading = document.getElementById(hash);
    if (!heading && root.dataset.atlasVersion === "v1") {
      const legacy = hash.match(/^atlas-heading-(infra|auto-bench|agent|platform)$/);
      if (legacy) heading = document.getElementById(`atlas-v1-heading-${legacy[1]}`);
      else if (hash.startsWith("atlas-infra-")) heading = document.getElementById("atlas-v1-heading-infra");
    }
    const branch = heading?.matches("[data-domain-node] h3") ? heading.closest<HTMLElement>("[data-domain]") : null;
    if (!heading || !branch || !root.contains(heading)) return;
    root.open = true;
    requestAnimationFrame(() => {
      if (desktop.matches) {
        root.scrollIntoView({ block: "start", behavior: "instant" });
        const offset = branch.getBoundingClientRect().top - viewport.getBoundingClientRect().top;
        viewport.scrollTo({ left: 0, top: viewport.scrollTop + offset - 12, behavior: "instant" });
      } else {
        viewport.scrollLeft = 0;
        heading.scrollIntoView({ block: "center", behavior: "instant" });
      }
    });
  }
  window.addEventListener("hashchange", revealLinkedRoute);
  window.addEventListener("pageshow", revealLinkedRoute);
  root.addEventListener("atlas-version-change", () => { refresh(); revealLinkedRoute(); });
  if (document.readyState === "complete") revealLinkedRoute();
}
