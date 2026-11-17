import type { AtlasQuest } from "./achievements";
import type { QuestStatus } from "./community";

type Model = { quests: AtlasQuest[]; statuses: Record<QuestStatus, string>; words: Record<string, string>; zoom: { initial: number; steps: number[] } };
type Box = { l: number; r: number; t: number; b: number; cy: number };

export function initAtlas(root: HTMLDetailsElement) {
  const { quests, statuses, words, zoom: zoomConfig } = JSON.parse(root.dataset.model!) as Model;
  const get = <T extends HTMLElement = HTMLElement>(attr: string) => root.querySelector<T>(`[data-${attr}]`)!;
  const byId = new Map(quests.map((q) => [q.id, q]));
  const filters = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-filter]"));
  const lanes = Array.from(root.querySelectorAll<HTMLElement>("[data-lane]"));
  const branches = Array.from(root.querySelectorAll<HTMLElement>("[data-domain]"));
  const dialog = get<HTMLDialogElement>("detail");
  const stage = get("stage"), viewport = get("scroll"), canvas = get("canvas"), wires = get("wires") as unknown as SVGSVGElement;
  const panTools = get("pan-tools");
  const prev = get<HTMLButtonElement>("pan-left"), next = get<HTMLButtonElement>("pan-right");
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Panning ---------- */
  // Current CSS zoom of the canvas; rects are in zoomed pixels, layout (and the SVG wires) in canvas pixels.
  const scaleOf = () => canvas.getBoundingClientRect().width / canvas.offsetWidth || 1;
  // Scroll offset at which the status column reaches the left edge and freezes (measured in measurePin).
  let pinAt = Infinity;
  function measurePin() {
    const lane = root.querySelector<HTMLElement>("[data-lane]:not([hidden])");
    if (!lane) return;
    const key = lane.querySelector<HTMLElement>(".lane-key")!;
    const left = lane.getBoundingClientRect().left - canvas.getBoundingClientRect().left;
    pinAt = left - parseFloat(getComputedStyle(key).paddingLeft) * scaleOf();
  }
  function syncPan() {
    const end = viewport.scrollWidth - viewport.clientWidth, bottom = viewport.scrollHeight - viewport.clientHeight;
    panTools.hidden = end <= 1;
    prev.disabled = viewport.scrollLeft <= 1;
    next.disabled = viewport.scrollLeft >= end - 1;
    stage.toggleAttribute("data-more-left", viewport.scrollLeft > 1);
    stage.toggleAttribute("data-more-right", viewport.scrollLeft < end - 1);
    stage.toggleAttribute("data-more-up", viewport.scrollTop > 1);
    stage.toggleAttribute("data-more-down", viewport.scrollTop < bottom - 1);
    stage.toggleAttribute("data-pinned", viewport.scrollLeft > pinAt);
  }
  const pan = (dir: number) => viewport.scrollBy({ left: dir * viewport.clientWidth * 0.72, behavior: reduceMotion() ? "instant" : "smooth" });
  prev.addEventListener("click", () => pan(-1));
  next.addEventListener("click", () => pan(1));
  viewport.addEventListener("scroll", syncPan, { passive: true });

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

  /* ---------- Zoom: step the tree's scale on desktop; the frame keeps its size and scrolls ---------- */
  const desktop = window.matchMedia("(min-width: 651px)");
  const { steps } = zoomConfig;
  const level = get<HTMLButtonElement>("zoom-reset");
  const zoomOut = root.querySelector<HTMLButtonElement>('[data-zoom-step="-1"]')!, zoomIn = root.querySelector<HTMLButtonElement>('[data-zoom-step="1"]')!;
  let zoom = zoomConfig.initial;
  function setZoom(next: number) {
    // Keep whatever sits at the centre of the frame in place while the scale changes.
    const before = scaleOf();
    const cx = (viewport.scrollLeft + viewport.clientWidth / 2) / before, cy = (viewport.scrollTop + viewport.clientHeight / 2) / before;
    zoom = next;
    canvas.style.zoom = String(next);
    level.textContent = get("live").textContent = `${Math.round(next * 100)}%`;
    zoomOut.disabled = next <= steps[0];
    zoomIn.disabled = next >= steps[steps.length - 1];
    viewport.scrollTo(cx * next - viewport.clientWidth / 2, cy * next - viewport.clientHeight / 2);
    refresh();
  }
  const step = (dir: number) => {
    const i = steps.reduce((best, s, j) => (Math.abs(s - zoom) < Math.abs(steps[best] - zoom) ? j : best), 0);
    setZoom(steps[Math.min(steps.length - 1, Math.max(0, i + dir))]);
  };
  zoomOut.addEventListener("click", () => step(-1));
  zoomIn.addEventListener("click", () => step(1));
  level.addEventListener("click", () => setZoom(zoomConfig.initial));
  // Phones never zoom; restore the chosen scale when the window is wide again.
  desktop.addEventListener("change", () => { canvas.style.zoom = desktop.matches ? String(zoom) : ""; refresh(); });

  /* ---------- Wires: trunk, forks and rails are drawn from the laid-out nodes ---------- */
  function drawWires() {
    const c = canvas.getBoundingClientRect();
    if (!root.open || !c.width) return;
    const k = scaleOf();
    const box = (el: Element): Box => {
      const r = el.getBoundingClientRect();
      return { l: (r.left - c.left) / k, r: (r.right - c.left) / k, t: (r.top - c.top) / k, b: (r.bottom - c.top) / k, cy: ((r.top + r.bottom) / 2 - c.top) / k };
    };
    const parts: string[] = [];
    const path = (d: string, cls: string, state = "") => parts.push(`<path class="${cls}"${state ? ` data-state="${state}"` : ""} d="${d}"/>`);
    const dot = (x: number, y: number, cls: string) => parts.push(`<circle class="${cls}" cx="${x}" cy="${y}" r="3.5"/>`);
    const f = (n: number) => Math.round(n * 10) / 10;

    // Centre the root on the midpoint of the first and last domain nodes (a transform, so layout is untouched).
    const hubEl = get("hub");
    const domains = branches.map((b) => box(b.querySelector("[data-domain-node]")!));
    const top = f(domains[0].cy), bottom = f(domains[domains.length - 1].cy), hy = f((top + bottom) / 2);
    hubEl.style.transform = "";
    hubEl.style.transform = `translateY(${f(hy - box(hubEl.querySelector(".medal")!).cy)}px)`;
    const hub = box(hubEl.querySelector(".medal")!);

    // Root → one short stub into the trunk; every domain then leaves the trunk on an equal twig.
    const sx = f(hub.r + (domains[0].l - hub.r) / 2);
    const r = Math.max(0, Math.min(12, domains[0].l - sx - 4, (bottom - top) / 2));
    path(`M${f(hub.r)} ${hy} H${sx} M${sx} ${f(top + r)} V${f(bottom - r)}`, "w-trunk");
    path(domains.map((d, i) => {
      const dy = f(d.cy), bend = i === 0 ? r : i === domains.length - 1 ? -r : 0;
      return bend ? `M${sx} ${f(dy + bend)} Q${sx} ${dy} ${f(sx + r)} ${dy} H${f(d.l)}` : `M${sx} ${dy} H${f(d.l)}`;
    }).join(" "), "w-twig");
    dot(sx, hy, "w-knot");

    const BUS = 8; // gap between the shared bus and the top of the quest cards
    branches.forEach((branch, i) => {
      const d = domains[i];
      for (const lane of branch.querySelectorAll<HTMLElement>("[data-lane]")) {
        if (lane.hidden) continue;
        const state = lane.dataset.lane!, empty = lane.dataset.count === "0" ? " w-empty" : "";
        const head = lane.querySelector<HTMLElement>("[data-lane-head]")!;
        // Lane heads stick while panning, so take x from the lane itself rather than the (possibly stuck) head.
        const laneBox = box(lane), py = f(box(head).cy), hl = f(laneBox.l), hr = f(laneBox.l + head.offsetWidth);
        const mx = f((d.r + hl) / 2);
        path(`M${f(d.r)} ${f(d.cy)} C${mx} ${f(d.cy)} ${mx} ${py} ${hl} ${py}`, "w-fork" + empty, state);
        const cards = Array.from(lane.querySelectorAll("[data-leaves] > li"), box);
        if (cards.length < 2) {
          // One quest (or the empty-lane note): a single line that stops at its edge.
          const end = cards[0]?.l ?? box(lane.querySelector("[data-leaves]")!).l;
          path(`M${hr} ${py} H${f(end)}`, "w-bus" + empty, state);
          continue;
        }
        // Several quests: a shared bus above the row and one stem per card, so siblings read as parallel, not as a chain.
        const busY = f(cards[0].t - BUS), x0 = f((hr + cards[0].l) / 2), rr = Math.min(8, x0 - hr, py - busY);
        const stems = cards.map((k) => `M${f((k.l + k.r) / 2)} ${busY} V${f(k.t)}`).join(" ");
        const last = cards[cards.length - 1];
        path(`M${hr} ${py} H${f(x0 - rr)} Q${x0} ${py} ${x0} ${f(py - rr)} V${f(busY + rr)} Q${x0} ${busY} ${f(x0 + rr)} ${busY} H${f((last.l + last.r) / 2)} ${stems}`, "w-bus", state);
      }
      dot(f(d.l), f(d.cy), "w-joint");
    });

    wires.innerHTML = parts.join("");
  }

  let queued = 0;
  const refresh = () => {
    cancelAnimationFrame(queued);
    queued = requestAnimationFrame(() => { drawWires(); measurePin(); syncPan(); });
  };
  const observer = new ResizeObserver(refresh);
  observer.observe(viewport);
  observer.observe(canvas);
  root.addEventListener("toggle", refresh);
  document.fonts?.ready.then(refresh);
  refresh();

  /* ---------- Status filter ---------- */
  for (const button of filters)
    button.addEventListener("click", () => {
      const state = button.dataset.filter!;
      filters.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      root.dataset.filter = state;
      let total = 0;
      for (const lane of lanes) {
        lane.hidden = state !== "all" && lane.dataset.lane !== state;
        if (!lane.hidden) total += Number(lane.dataset.count);
      }
      viewport.scrollTo(0, 0);
      refresh();
      get("live").textContent = `${state === "all" ? words.all : statuses[state as QuestStatus]} · ${total} ${words.results}`;
    });

  /* ---------- Quest details ---------- */
  function show(q: AtlasQuest) {
    const pill = get("status");
    pill.textContent = statuses[q.state];
    pill.dataset.state = q.state;
    get("domain-label").textContent = `${q.domainTitle} · #${q.number}`;
    get("title").textContent = q.title;
    get("summary").textContent = q.summary;
    const facts = get("facts"), related = get("neighbors");
    facts.replaceChildren();
    related.replaceChildren();
    for (const link of q.links) {
      const a = document.createElement("a");
      a.href = link.url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = link.label + " ↗";
      facts.append(a);
    }
    if (q.assignee) {
      const by = document.createElement("span");
      by.textContent = `${words.contributor} · @${q.assignee}`;
      facts.append(by);
    }
    for (const rel of q.related) {
      const other = byId.get(rel.id);
      if (!other) continue;
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.state = other.state;
      b.textContent = `${rel.label} · #${other.number} ${other.title}`;
      b.addEventListener("click", () => show(other));
      related.append(b);
    }
    if (!dialog.open) dialog.showModal();
    else get("close").focus({ preventScroll: true });
  }
  for (const a of root.querySelectorAll<HTMLAnchorElement>("[data-record]")) {
    a.setAttribute("aria-haspopup", "dialog");
    a.addEventListener("click", (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const q = byId.get(a.dataset.record!);
      if (q) { e.preventDefault(); show(q); }
    });
  }
  get("close").addEventListener("click", () => dialog.close());
  let backdrop = false;
  dialog.addEventListener("pointerdown", (e) => { backdrop = e.target === dialog; });
  dialog.addEventListener("click", (e) => { if (backdrop && e.target === dialog) dialog.close(); });
}
