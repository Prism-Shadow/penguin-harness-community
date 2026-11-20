export function bindResearchDetails(root: HTMLDetailsElement, viewport: HTMLElement) {
  const panel = root.querySelector<HTMLElement>("[data-research-details]");
  if (!panel) return () => {};
  const body = panel.querySelector<HTMLElement>("[data-research-body]")!;
  const close = panel.querySelector<HTMLButtonElement>("[data-research-close]")!;
  let active: HTMLButtonElement | undefined;
  let pinned = false;
  let timer = 0;
  let returningFocus = false;

  function hide(restoreFocus = false) {
    window.clearTimeout(timer);
    if (!active) return;
    const trigger = active;
    active = undefined;
    pinned = false;
    trigger.setAttribute("aria-expanded", "false");
    panel!.hidden = true;
    if (restoreFocus) {
      returningFocus = true;
      trigger.focus({ preventScroll: true });
      returningFocus = false;
    }
  }

  function show(button: HTMLButtonElement) {
    window.clearTimeout(timer);
    if (active === button) return;
    hide();
    const template = button.parentElement!.querySelector<HTMLTemplateElement>("[data-research-template]")!;
    body.replaceChildren(template.content.cloneNode(true));
    active = button;
    button.setAttribute("aria-expanded", "true");
    panel!.hidden = false;
    const anchor = button.getBoundingClientRect();
    const { offsetWidth: width, offsetHeight: height } = panel!;
    const left = Math.max(12, Math.min(innerWidth - width - 12, anchor.left + (anchor.width - width) / 2));
    const below = anchor.bottom + height + 20 <= innerHeight;
    const top = below ? anchor.bottom + 8 : Math.max(12, anchor.top - height - 8);
    panel!.style.left = `${left}px`;
    panel!.style.top = `${top}px`;
  }

  function hideAfterLeave() {
    window.clearTimeout(timer);
    if (pinned) return;
    timer = window.setTimeout(() => {
      if (!panel.matches(":hover") && !active?.matches(":hover, :focus-visible")) hide();
    }, 220);
  }

  for (const button of root.querySelectorAll<HTMLButtonElement>("[data-research-phase]")) {
    button.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse" && !pinned) show(button);
    });
    button.addEventListener("pointerleave", hideAfterLeave);
    button.addEventListener("focus", () => {
      if (!returningFocus && button.matches(":focus-visible")) show(button);
    });
    button.addEventListener("blur", hideAfterLeave);
    button.addEventListener("click", (event) => {
      if (pinned && active === button) {
        hide();
        return;
      }
      show(button);
      pinned = true;
      if (event.detail === 0) close.focus({ preventScroll: true });
    });
  }
  panel.addEventListener("pointerenter", () => window.clearTimeout(timer));
  panel.addEventListener("pointerleave", hideAfterLeave);
  panel.addEventListener("click", (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (event.target instanceof Element && event.target.closest("[data-quest-jump]")) hide();
  });
  close.addEventListener("click", () => hide(true));
  document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (target instanceof Node && !panel.contains(target) && !active?.contains(target)) hide();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || panel.hidden) return;
    event.preventDefault();
    hide(panel.contains(document.activeElement));
  });
  viewport.addEventListener("scroll", () => hide(), { passive: true });
  window.addEventListener("scroll", () => hide(), { passive: true });
  window.addEventListener("resize", () => hide());
  root.addEventListener("toggle", () => { if (!root.open) hide(); });
  root.addEventListener("atlas-version-change", () => hide());
  return () => hide();
}
