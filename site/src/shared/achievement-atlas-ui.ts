import type { AtlasMedal, AtlasMedalRef, MedalState } from "./achievements";
import { medalRows } from "./achievement-atlas-layout";

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
  const stage = get("stage"), viewport = get("scroll"), canvas = get("canvas");
  const paths = root.querySelector<SVGGElement>("[data-paths]")!;
  const panTools = get("pan-tools");
  const prev = get<HTMLButtonElement>("pan-left"), next = get<HTMLButtonElement>("pan-right");
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(any-hover: hover)");

  /* ---------- Panning ---------- */
  // Current CSS zoom of the canvas; rects are in zoomed pixels, layout (and the SVG wires) in canvas pixels.
  const scaleOf = () => canvas.getBoundingClientRect().width / canvas.offsetWidth || 1;
  function syncPan() {
    const end = viewport.scrollWidth - viewport.clientWidth, bottom = viewport.scrollHeight - viewport.clientHeight;
    panTools.hidden = end <= 1;
    prev.disabled = viewport.scrollLeft <= 1;
    next.disabled = viewport.scrollLeft >= end - 1;
    stage.toggleAttribute("data-more-left", viewport.scrollLeft > 1);
    stage.toggleAttribute("data-more-right", viewport.scrollLeft < end - 1);
    stage.toggleAttribute("data-more-up", viewport.scrollTop > 1);
    stage.toggleAttribute("data-more-down", viewport.scrollTop < bottom - 1);
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

  /* ---------- Wires: the trunk groups lanes, arrows connect dependent medals ---------- */
  function drawWires() {
    const c = canvas.getBoundingClientRect();
    if (!root.open || !c.width) return;
    const k = scaleOf();
    const box = (el: Element): Box => {
      const r = el.getBoundingClientRect();
      return { l: (r.left - c.left) / k, r: (r.right - c.left) / k, t: (r.top - c.top) / k, b: (r.bottom - c.top) / k, cy: ((r.top + r.bottom) / 2 - c.top) / k };
    };
    const parts: string[] = [];
    const path = (d: string, cls: string) => parts.push(`<path class="${cls}" d="${d}"/>`);
    const dot = (x: number, y: number, cls: string) => parts.push(`<circle class="${cls}" cx="${x}" cy="${y}" r="3.5"/>`);
    const f = (n: number) => Math.round(n * 10) / 10;

    // Centre the root on the midpoint of the first and last route nodes (a transform, so layout is untouched).
    const hubEl = get("hub");
    const visibleBranches = branches.filter((b) => !b.hidden);
    hubEl.hidden = !visibleBranches.length;
    if (hubEl.hidden) { paths.replaceChildren(); return; }
    hubEl.style.gridRow = `1 / span ${visibleBranches.length}`;
    const routes = visibleBranches.map((branch) => {
      const node = branch.querySelector<HTMLElement>("[data-domain-node]")!;
      const visibleLanes = branch.querySelectorAll("[data-lane]:not([hidden])");
      const upper = visibleLanes[Math.floor((visibleLanes.length - 1) / 2)];
      const lower = visibleLanes[Math.floor(visibleLanes.length / 2)];
      // Keep the middle twig horizontal even when categories contain different numbers of medals.
      const centre = (box(upper).cy + box(lower).cy) / 2;
      node.style.transform = `translateY(${f(centre - box(branch).cy)}px)`;
      return box(node);
    });
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

    const focused = canvas.querySelector<HTMLElement>("[data-record]:focus-visible");
    const hovered = canHover.matches ? canvas.querySelector<HTMLElement>("[data-record]:hover") : null;
    const active = dialog.open ? undefined : (focused ?? hovered)?.dataset.record;
    const selected = active ? byId.get(active) : undefined;
    const edges = selected ? [
      ...selected.requires.map((parent) => ({ from: parent, to: selected })),
      ...selected.unlocks.map((child) => ({ from: selected, to: child })),
    ] : [];
    const filter = root.dataset.filter;
    const visibleEdges = edges.filter(({ from, to }) =>
      !filter || filter === "all" || (from.state === filter && to.state === filter)
    );
    const positions = new Map<string, Box>();
    const inlineEdges = new Map<string, string>();
    visibleBranches.forEach((branch, i) => {
      const d = routes[i];
      for (const lane of branch.querySelectorAll<HTMLElement>("[data-lane]")) {
        if (lane.hidden) continue;
        const head = lane.querySelector<HTMLElement>("[data-lane-head]");
        let startX = f(d.r), startY = f(d.cy);
        if (head) {
          // Sticky headings keep their original connection point during horizontal panning.
          const heading = box(head), titleX = f(box(lane).l), titleY = f(heading.cy);
          const mx = f((d.r + titleX) / 2);
          const allLocked = !lane.querySelector('[data-record]:not([data-state="locked"])');
          path(`M${startX} ${startY} C${mx} ${startY} ${mx} ${titleY} ${titleX} ${titleY}`, allLocked ? "w-fork w-locked" : "w-fork");
          startX = f(titleX + heading.r - heading.l);
          startY = titleY;
        }
        const leaves = lane.querySelector<HTMLElement>("[data-leaves]")!;
        const firstColumnX = box(leaves).l;
        const forkX = f((startX + firstColumnX) / 2);
        const rowEnds = new Map<number, string>();
        const attachments = [startY];
        const memberPaths = [`M${startX} ${startY} H${forkX}`];
        for (const item of leaves.querySelectorAll<HTMLElement>(":scope > li:not([hidden])")) {
          const id = item.querySelector<HTMLElement>("[data-record]")!.dataset.record!;
          const card = box(item);
          positions.set(id, card);
          const row = Number(item.style.gridRowStart);
          const parent = rowEnds.get(row);
          if (parent) {
            inlineEdges.set(id, parent);
          } else {
            const y = f(card.cy);
            memberPaths.push(`M${forkX} ${y} H${f(card.l)}`);
            attachments.push(y);
          }
          rowEnds.set(row, id);
        }
        memberPaths.push(`M${forkX} ${Math.min(...attachments)} V${Math.max(...attachments)}`);
        path(memberPaths.join(" "), "w-membership");
      }
      dot(f(d.l), f(d.cy), "w-joint");
    });

    // Follow the gaps between cards, including across categories. Only visible endpoints are linked.
    const gap = parseFloat(getComputedStyle(canvas).getPropertyValue("--leaf-gap"));
    for (const [child, parent] of inlineEdges) {
      if (!visibleEdges.some(({ from, to }) => from.id === parent && to.id === child))
        visibleEdges.push({ from: byId.get(parent)!, to: byId.get(child)! });
    }
    for (const { from, to } of visibleEdges) {
      const source = positions.get(from.id), target = positions.get(to.id);
      if (!source || !target || source.r >= target.l) continue;
      const x1 = f(source.r + gap / 2), x2 = f(target.l - gap / 2);
      const approachY = f(target.t - 4);
      const turns = inlineEdges.get(to.id) === from.id ? "" : Math.abs(x1 - x2) < 1
        ? `H${x2} V${f(target.cy)}`
        : `H${x1} V${approachY} H${x2} V${f(target.cy)}`;
      const d = `M${f(source.r)} ${f(source.cy)} ${turns} H${f(target.l - 1)}`;
      parts.push(`<path class="w-dependency" data-from="${from.id}" data-to="${to.id}" data-state="${from.state}" d="${d}" marker-end="url(#atlas-arrow)"/>`);
    }
    paths.innerHTML = parts.join("");
  }

  let queued = 0;
  const refresh = () => {
    cancelAnimationFrame(queued);
    queued = requestAnimationFrame(() => { drawWires(); syncPan(); });
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
      const visibleColumns = [...new Set(medals.filter((m) => state === "all" || m.state === state).map((m) => m.column))].sort((a, b) => a - b);
      let total = 0;
      for (const card of cards) {
        const hide = state !== "all" && card.dataset.state !== state;
        card.parentElement!.hidden = hide;
        if (!hide) {
          const column = byId.get(card.dataset.record!)!.column;
          card.parentElement!.style.gridColumnStart = String(visibleColumns.indexOf(column) + 1);
          total += 1;
        }
      }
      for (const lane of lanes) {
        const shown = Array.from(lane.querySelectorAll<HTMLElement>("li:not([hidden]) [data-record]"));
        const rows = medalRows(shown.map((card) => byId.get(card.dataset.record!)!));
        for (const card of shown) card.parentElement!.style.gridRowStart = String(rows.get(card.dataset.record!));
        lane.hidden = shown.length === 0;
      }
      for (const branch of branches)
        branch.hidden = !branch.querySelector("[data-lane]:not([hidden])");
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
      const status = document.createElement("span");
      status.className = "pill";
      status.dataset.state = other.state;
      status.textContent = statuses[other.state];
      b.append(other.name + " ", status);
      b.addEventListener("click", () => show(other));
      group.append(b);
    }
    return group.children.length ? [label(title), group] : [];
  }

  function show(m: AtlasMedal) {
    const pill = get("status");
    pill.textContent = statuses[m.state];
    pill.dataset.state = m.state;
    get("domain-label").textContent = m.branchTitle ? `${m.routeTitle} · ${m.branchTitle}` : m.routeTitle;
    get("title").textContent = m.name;
    get("summary").textContent = m.intent;
    get("evidence").textContent = m.evidence;

    const note = get("note");
    const notes = [m.acceptedReport === null ? words.awaitingReport : "", m.pending, m.unregistered.length ? `${m.unregistered.map((n) => "#" + n).join(" ")} ${words.unregistered}` : ""].filter(Boolean);
    note.hidden = notes.length === 0;
    note.textContent = notes.join(" · ");

    // Evidence links and the status of each related Task Board quest.
    const facts = get("facts");
    facts.replaceChildren();
    if (m.mergedPr) facts.append(chip(words.mergedPr, m.mergedPr));
    if (m.acceptedReport) facts.append(chip(words.report, m.acceptedReport));
    if (m.prerequisiteTasks.length) {
      const list = document.createElement("div");
      list.className = "quests";
      for (const task of m.prerequisiteTasks) {
        const text = `#${task.number} ${task.title} · ${task.completed ? words.accepted : words.pendingTask}`;
        list.append(task.url ? chip(text, task.url) : document.createTextNode(text));
      }
      facts.append(label(words.requiredTasks), list);
    }
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
    const prerequisiteTitle = m.anyPrerequisite ? words.needsAny : m.state === "locked" ? words.unlockCondition : words.needs;
    related.replaceChildren(...relationGroup(prerequisiteTitle, m.requires), ...relationGroup(words.unlocks, m.unlocks));

    if (!dialog.open) dialog.showModal();
    else get("close").focus({ preventScroll: true });
  }

  for (const a of cards) {
    for (const event of ["pointerenter", "pointerleave", "focus", "blur"]) a.addEventListener(event, refresh);
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

  // A category link should bring both the toolbar and the category inside the panned board into view.
  function revealLinkedLane() {
    const hash = location.hash.slice(1);
    const heading = document.getElementById(hash === "atlas-method-tools" ? "atlas-heading-auto-bench" : hash);
    if (!heading || !root.contains(heading)) return;
    const section = heading.hasAttribute("data-lane-head") ? heading.closest("[data-lane]")
      : heading.matches("[data-domain-node] h3") ? heading.closest("[data-domain]") : null;
    if (!section) return;
    root.open = true;
    if (heading.closest("[hidden]")) filters[0].click();
    requestAnimationFrame(() => {
      if (desktop.matches) {
        root.scrollIntoView({ block: "start", behavior: "instant" });
        const offset = section.getBoundingClientRect().top - viewport.getBoundingClientRect().top;
        viewport.scrollTo({ left: 0, top: viewport.scrollTop + offset - 12, behavior: "instant" });
      } else {
        viewport.scrollLeft = 0;
        heading.scrollIntoView({ block: "center", behavior: "instant" });
      }
    });
  }
  window.addEventListener("hashchange", revealLinkedLane);
  window.addEventListener("pageshow", revealLinkedLane);
  if (document.readyState === "complete") revealLinkedLane();
}
