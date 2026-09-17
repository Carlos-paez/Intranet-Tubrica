export function bindNav() {
  const toggle = document.getElementById("navToggle");
  const panel = document.getElementById("navPanel");
  if (!toggle || !panel) return;

  function open() {
    panel.classList.add("on");
    toggle.classList.add("on");
    toggle.setAttribute("aria-expanded", "true");
  }

  function close() {
    panel.classList.remove("on");
    toggle.classList.remove("on");
    toggle.setAttribute("aria-expanded", "false");
  }

  function isOpen() {
    return panel.classList.contains("on");
  }

  toggle.addEventListener("click", () => (isOpen() ? close() : open()));

  panel.addEventListener("click", (e) => {
    if (e.target.closest("a")) close();
  });

  document.addEventListener("click", (e) => {
    if (isOpen() && !e.target.closest(".tb-nav")) close();
  });

  return { close, isOpen };
}