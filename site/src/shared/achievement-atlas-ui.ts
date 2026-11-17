import type { AtlasMedal, AtlasMedalRef, MedalState } from "./achievements";

type Model = { medals: AtlasMedal[]; statuses: Record<MedalState, string>; words: Record<string, string>; zoom: { initial: number; min: number; max: number } };
type Box = { l: number; r: number; t: number; b: number; cy: number };

export function initAtlas(root: HTMLDetailsElement) {
  const { medals, statuses, words, zoom: zoomConfig } = JSON.parse(root.dataset.model!) as Model;
  const get = <T extends HTMLElement = HTMLElement>(attr: string) => root.querySelector<T>(`[data-${attr}]`)!;
  const byId = new Map(medals.map((m) => [m.id, m]));
  const filters = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-filter]"));
  const lanes = Array.from(root.querySelectorAll<HTMLElement>("[data-lane]"));
  const branches = Array.from(root.querySelectorAll<HTMLElement>("[data-domain]"));
  const cards = Array.from(root.querySelectorAll<HTMLAnchorElement>("[data-record]"));
  const dialog = get<HTMLDialogElement>("detail");
  const stage = get("stage"), viewport = get("scroll"), canvas = get("canvas"), wires = get("wires") as unknown as SVGSVGElement;
  const panTools = get("pan-tools");
  const prev = get<HTMLButtonElement>("pan-left"), next = get<HTMLButtonElement>("pan-right");
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Panning ---------- */
  // Current CSS zoom of the canvas; rects are in zoomed pixels, layout (and the SVG wires) in canvas pixels.
  const scaleOf = () => canvas.getBoundingClientRect().width / canvas.offsetWidth || 1;
  // Scroll offset at which the branch column reaches the left edge and freezes (measured in measurePin).
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

    // Centre the root on the midpoint of the first and last route nodes (a transform, so layout is untouched).
    const hubEl = get("hub");
    const routes = branches.map((b) => box(b.querySelector("[data-domain-node]")!));
    const top = f(routes[0].cy), bottom = f(routes[routes.length - 1].cy), hy = f((top + bottom) / 2);
    hubEl.style.transform = "";
    hubEl.style.transform = `translateY(${f(hy - box(hubEl.querySelector(".medal")!).cy)}px)`;
    const hub = box(hubEl.querySelector(".medal")!);

    // Root → one short stub into the trunk; every route then leaves the trunk on an equal twig.
    const sx = f(hub.r + (routes[0].l - hub.r) / 2);
    const r = Math.max(0, Math.min(12, routes[0].l - sx - 4, (bottom - top) / 2));
    path(`M${f(hub.r)} ${hy} H${sx} M${sx} ${f(top + r)} V${f(bottom - r)}`, "w-trunk");
    path(routes.map((d, i) => {
      const dy = f(d.cy), bend = i === 0 ? r : i === routes.length - 1 ? -r : 0;
      return bend ? `M${sx} ${f(dy + bend)} Q${sx} ${dy} ${f(sx + r)} ${dy} H${f(d.l)}` : `M${sx} ${dy} H${f(d.l)}`;
    }).join(" "), "w-twig");
    dot(sx, hy, "w-knot");

    const BUS = 8; // gap between the shared bus and the top of the medal cards
    branches.forEach((branch, i) => {
      const d = routes[i];
      for (const lane of branch.querySelectorAll<HTMLElement>("[data-lane]")) {
        if (lane.hidden) continue;
        const head = lane.querySelector<HTMLElement>("[data-lane-head]")!;
        // Branch heads stick while panning, so take x from the lane itself rather than the (possibly stuck) head.
        const laneBox = box(lane), py = f(box(head).cy), hl = f(laneBox.l), hr = f(laneBox.l + head.offsetWidth);
        const mx = f((d.r + hl) / 2);
        path(`M${f(d.r)} ${f(d.cy)} C${mx} ${f(d.cy)} ${mx} ${py} ${hl} ${py}`, "w-fork");
        const items = Array.from(lane.querySelectorAll<HTMLElement>("[data-leaves] > li")).filter((li) => !li.hidden);
        const states = items.map((li) => li.querySelector<HTMLElement>("[data-record]")!.dataset.state!);
        const boxes = items.map(box);
        if (boxes.length === 0) continue;
        if (boxes.length === 1) {
          // One medal: a single line that stops at its edge, dashed while the medal is locked.
          path(`M${hr} ${py} H${f(boxes[0].l)}`, "w-bus", states[0]);
          continue;
        }
        // Several medals: a shared bus above the row and one stem per card, so siblings read as parallel, not as a chain.
        const busY = f(boxes[0].t - BUS), x0 = f((hr + boxes[0].l) / 2), rr = Math.min(8, x0 - hr, py - busY);
        const last = boxes[boxes.length - 1];
        path(`M${hr} ${py} H${f(x0 - rr)} Q${x0} ${py} ${x0} ${f(py - rr)} V${f(busY + rr)} Q${x0} ${busY} ${f(x0 + rr)} ${busY} H${f((last.l + last.r) / 2)}`, "w-bus");
        boxes.forEach((k, j) => path(`M${f((k.l + k.r) / 2)} ${busY} V${f(k.t)}`, "w-bus", states[j]));
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

  /* ---------- State filter: hide the cards, then any branch left without one ---------- */
  for (const button of filters)
    button.addEventListener("click", () => {
      const state = button.dataset.filter!;
      filters.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      root.dataset.filter = state;
      let total = 0;
      for (const card of cards) {
        const hide = state !== "all" && card.dataset.state !== state;
        card.parentElement!.hidden = hide;
        if (!hide) total += 1;
      }
      for (const lane of lanes)
        lane.hidden = !lane.querySelector<HTMLElement>("[data-leaves] > li:not([hidden])");
      viewport.scrollTo(0, 0);
      refresh();
      get("live").textContent = `${state === "all" ? words.all : statuses[state as MedalState]} · ${total} ${words.results}`;
    });

  /* ---------- Medal details ---------- */
  const label = (text: string) => {
    const p = document.createElement("p");
    p.className = "dossier-label";
    p.textContent = text;
    return p;
  };
  const chip = (text: string, url: string) => {
    const a = document.createElement("a");
    a.className = "chip";
    a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = text;
    return a;
  };
  function relationGroup(title: string, refs: AtlasMedalRef[]) {
    const group = document.createElement("div");
    group.className = "relations";
    for (const ref of refs) {
      const other = byId.get(ref.id);
      if (!other) continue;
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.state = other.state;
      b.textContent = `${statuses[other.state]} · ${other.name}`;
      b.addEventListener("click", () => show(other));
      group.append(b);
    }
    return group.children.length ? [label(title), group] : [];
  }

  function show(m: AtlasMedal) {
    const pill = get("status");
    pill.textContent = statuses[m.state];
    pill.dataset.state = m.state;
    get("domain-label").textContent = `${m.routeTitle} · ${m.branchTitle}`;
    get("title").textContent = m.name;
    get("summary").textContent = m.intent;
    get("evidence").textContent = m.evidence;

    const note = get("note");
    const notes = [m.pending, m.unregistered.length ? `${m.unregistered.map((n) => "#" + n).join(" ")} ${words.unregistered}` : ""].filter(Boolean);
    note.hidden = notes.length === 0;
    note.textContent = notes.join(" · ");

    // The quests that light it, each with its Task Board status.
    const facts = get("facts");
    facts.replaceChildren();
    if (m.tasks.length) {
      const list = document.createElement("div");
      list.className = "quests";
      for (const task of m.tasks) {
        const row = document.createElement("div");
        row.className = "quest";
        const main = document.createElement("a");
        main.href = task.links[0].url; main.target = "_blank"; main.rel = "noopener noreferrer";
        main.textContent = `#${task.number} ${task.title}`;
        const meta = document.createElement("span");
        meta.className = "quest-meta";
        meta.dataset.status = task.status;
        meta.textContent = task.assignee ? `${task.statusLabel} · ${words.contributor} @${task.assignee}` : task.statusLabel;
        row.append(main, meta, ...task.links.slice(1).map((link) => chip(link.label, link.url)));
        list.append(row);
      }
      facts.append(label(words.quests), list);
    }

    const related = get("neighbors");
    related.replaceChildren(...relationGroup(words.needs, m.requires), ...relationGroup(words.unlocks, m.unlocks));

    if (!dialog.open) dialog.showModal();
    else get("close").focus({ preventScroll: true });
  }

  for (const a of cards) {
    a.setAttribute("aria-haspopup", "dialog");
    a.addEventListener("click", (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const m = byId.get(a.dataset.record!);
      if (m) { e.preventDefault(); show(m); }
    });
  }
  get("close").addEventListener("click", () => dialog.close());
  let backdrop = false;
  dialog.addEventListener("pointerdown", (e) => { backdrop = e.target === dialog; });
  dialog.addEventListener("click", (e) => { if (backdrop && e.target === dialog) dialog.close(); });
}
