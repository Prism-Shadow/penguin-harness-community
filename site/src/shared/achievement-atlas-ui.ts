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
  function setZoom(value: number, x: number, y: number) {
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
    const value = e.key === "0" ? zoomConfig.initial : e.key === "-" ? zoom / 1.2 : e.key === "+" || e.key === "=" ? zoom * 1.2 : null;
    if (value === null) return;
    e.preventDefault();
    if (setZoom(value, viewport.clientWidth / 2, viewport.clientHeight / 2))
      get("live").textContent = `${Math.round(zoom * 100)}%`;
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
    const x = point((hubRight + first.left) / 2);
    const radius = Math.max(0, Math.min(12, first.left - x - 4, (bottom - top) / 2));
    wire(`M${point(hubRight)} ${middle} H${x} M${x} ${point(top + radius)} V${point(bottom - radius)}`, "w-trunk");
    wire(routes.map(({ node }, i) => {
      const y = point(node.center), bend = i === 0 ? radius : i === routes.length - 1 ? -radius : 0;
      return bend ? `M${x} ${point(y + bend)} Q${x} ${y} ${point(x + radius)} ${y} H${point(node.left)}`
        : `M${x} ${y} H${point(node.left)}`;
    }).join(" "), "w-twig");

    for (const { node, topics } of routes) {
      for (const topic of topics) {
        const predecessor = topic.predecessor && topics.find((source) => source.id === topic.predecessor);
        const source = predecessor || node;
        const x1 = point(source.right), y1 = point(source.center);
        const x2 = point(topic.left), y2 = point(topic.center);
        const mid = point((x1 + x2) / 2);
        const line = y1 === y2 ? `M${x1} ${y1} H${x2}` : `M${x1} ${y1} C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`;
        const arrow = predecessor ? ` M${x2 - 6} ${y2 - 4} L${x2} ${y2} L${x2 - 6} ${y2 + 4}` : "";
        wire(line + arrow, predecessor ? "w-dependency" : "w-fork");
      }
    }
    paths.innerHTML = pathsMarkup.join("");
  }

  let queued = 0;
  const refresh = () => {
    cancelAnimationFrame(queued);
    queued = requestAnimationFrame(() => { drawWires(); syncScrollEdges(); });
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
