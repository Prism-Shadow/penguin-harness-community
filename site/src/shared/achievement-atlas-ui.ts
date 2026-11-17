import type { AtlasQuest } from "./achievements";
import type { QuestStatus } from "./community";

type Model = { quests: AtlasQuest[]; statuses: Record<QuestStatus, string>; words: Record<string, string> };
type Box = { l: number; r: number; t: number; b: number; cy: number };

export function initAtlas(root: HTMLDetailsElement) {
  const { quests, statuses, words } = JSON.parse(root.dataset.model!) as Model;
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
  // Scroll offset at which the status column reaches the left edge and freezes (measured in measurePin).
  let pinAt = Infinity;
  function measurePin() {
    const lane = root.querySelector<HTMLElement>("[data-lane]:not([hidden])");
    if (!lane) return;
    const key = lane.querySelector<HTMLElement>(".lane-key")!;
    const left = lane.getBoundingClientRect().left - canvas.getBoundingClientRect().left;
    pinAt = left - parseFloat(getComputedStyle(key).paddingLeft);
  }
  function syncPan() {
    const end = viewport.scrollWidth - viewport.clientWidth;
    panTools.hidden = end <= 1;
    prev.disabled = viewport.scrollLeft <= 1;
    next.disabled = viewport.scrollLeft >= end - 1;
    stage.toggleAttribute("data-more-left", viewport.scrollLeft > 1);
    stage.toggleAttribute("data-more-right", viewport.scrollLeft < end - 1);
    stage.toggleAttribute("data-pinned", viewport.scrollLeft > pinAt);
  }
  const pan = (dir: number) => viewport.scrollBy({ left: dir * viewport.clientWidth * 0.72, behavior: reduceMotion() ? "instant" : "smooth" });
  prev.addEventListener("click", () => pan(-1));
  next.addEventListener("click", () => pan(1));
  viewport.addEventListener("scroll", syncPan, { passive: true });

  // Drag the canvas with a mouse; touch and trackpads already scroll natively.
  let drag: { x: number; left: number; moved: boolean } | null = null;
  viewport.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || viewport.scrollWidth <= viewport.clientWidth) return;
    drag = { x: e.clientX, left: viewport.scrollLeft, moved: false };
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) < 5) return;
    if (!drag.moved) { drag.moved = true; viewport.setPointerCapture(e.pointerId); viewport.classList.add("dragging"); }
    viewport.scrollLeft = drag.left - dx;
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

  /* ---------- Wires: trunk, forks and rails are drawn from the laid-out nodes ---------- */
  function drawWires() {
    const c = canvas.getBoundingClientRect();
    if (!root.open || !c.width) return;
    const box = (el: Element): Box => {
      const r = el.getBoundingClientRect();
      return { l: r.left - c.left, r: r.right - c.left, t: r.top - c.top, b: r.bottom - c.top, cy: (r.top + r.bottom) / 2 - c.top };
    };
    const parts: string[] = [];
    const path = (d: string, cls: string, state = "") => parts.push(`<path class="${cls}"${state ? ` data-state="${state}"` : ""} d="${d}"/>`);
    const dot = (x: number, y: number, cls: string) => parts.push(`<circle class="${cls}" cx="${x}" cy="${y}" r="3.5"/>`);
    const f = (n: number) => Math.round(n * 10) / 10;

    const hub = box(get("hub").querySelector(".medal")!);
    const domains = branches.map((b) => box(b.querySelector("[data-domain-node]")!));
    const hy = hub.cy, sx = f(hub.r + (domains[0].l - hub.r) / 2), r = 14;
    const trunk: string[] = [];
    for (const d of domains) {
      const dy = f(d.cy);
      if (Math.abs(dy - hy) < r) trunk.push(`M${f(hub.r)} ${f(hy)} C${sx} ${f(hy)} ${sx} ${dy} ${f(d.l)} ${dy}`);
      else trunk.push(`M${f(hub.r)} ${f(hy)} H${sx - r} Q${sx} ${f(hy)} ${sx} ${f(hy + Math.sign(dy - hy) * r)} V${dy - Math.sign(dy - hy) * r} Q${sx} ${dy} ${sx + r} ${dy} H${f(d.l)}`);
    }
    path(trunk.join(" "), "w-trunk-halo");
    path(trunk.join(" "), "w-trunk");

    branches.forEach((branch, i) => {
      const d = domains[i];
      for (const lane of branch.querySelectorAll<HTMLElement>("[data-lane]")) {
        if (lane.hidden) continue;
        const state = lane.dataset.lane!, empty = lane.dataset.count === "0";
        const head = lane.querySelector<HTMLElement>("[data-lane-head]")!;
        // Lane heads stick while panning, so take x from the lane itself rather than the (possibly stuck) head.
        const laneBox = box(lane), hy2 = f(box(head).cy), hl = f(laneBox.l), hr = f(laneBox.l + head.offsetWidth);
        const mx = f((d.r + hl) / 2);
        path(`M${f(d.r)} ${f(d.cy)} C${mx} ${f(d.cy)} ${mx} ${hy2} ${hl} ${hy2}`, empty ? "w-fork w-empty" : "w-fork", state);
        const leaves = box(lane.querySelector("[data-leaves]")!);
        const end = empty ? leaves.l : Math.max(leaves.l, leaves.r - 24);
        path(`M${hr} ${hy2} H${f(end)}`, empty ? "w-rail w-empty" : "w-rail", state);
      }
      dot(f(d.l), f(d.cy), "w-joint");
    });
    dot(f(hub.r), f(hy), "w-joint");

    wires.setAttribute("width", String(canvas.scrollWidth));
    wires.setAttribute("height", String(canvas.scrollHeight));
    wires.setAttribute("viewBox", `0 0 ${canvas.scrollWidth} ${canvas.scrollHeight}`);
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
      viewport.scrollLeft = 0;
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
