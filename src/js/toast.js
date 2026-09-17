let container = null;

function getContainer() {
  container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }
  return container;
}

export function toast(html, cls) {
  const el = document.createElement("div");
  el.className = "tub-toast" + (cls ? " " + cls : "");
  el.setAttribute("role", "status");
  el.innerHTML = html;
  getContainer().appendChild(el);

  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("in")));

  setTimeout(() => {
    el.classList.add("out");
    setTimeout(() => el.remove(), 320);
  }, 4000);

  return el;
}