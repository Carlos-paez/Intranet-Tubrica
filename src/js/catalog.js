import { APPS, catOf } from "../data/apps.js";
import { esc, hl } from "./utils.js";
import { state } from "./state.js";
import { renderFavs } from "./carousel.js";

const el = (id) => document.getElementById(id);

function stChip(a) {
  return a.status === "ok"
    ? '<span class="stat ok"><i class="dot"></i>Operativa</span>'
    : '<span class="stat warn"><i class="dot"></i>Mantenimiento</span>';
}

export function renderStats() {
  const ok = APPS.filter((a) => a.status === "ok").length;
  const wn = APPS.length - ok;
  el("stats").innerHTML =
    `<span class="stat-chip"><b>${APPS.length}</b> APLICACIONES</span>` +
    `<span class="stat-chip"><span class="dot" style="background:var(--ok)"></span><b>${ok}</b> OPERATIVAS</span>` +
    (wn
      ? `<span class="stat-chip"><span class="dot" style="background:#d97706"></span><b>${wn}</b> EN MANTENIMIENTO</span>`
      : "");
}

export function renderFilters() {
  const counts = {};
  APPS.forEach((a) => (counts[a.cat] = (counts[a.cat] || 0) + 1));
  let html = `<button class="chip ${state.cat === "ALL" ? "on" : ""}" data-cat="ALL">Todas<span class="n">${APPS.length}</span></button>`;
  for (const c in counts) {
    html += `<button class="chip ${state.cat === c ? "on" : ""}" data-cat="${c}">${c}<span class="n">${counts[c]}</span></button>`;
  }
  el("filters").innerHTML = html;
}

export function render() {
  const q = state.q.trim();
  const ql = q.toLowerCase();
  const list = APPS.filter((a) => {
    if (state.cat !== "ALL" && a.cat !== state.cat) return false;
    if (!ql) return true;
    return (a.name + " " + a.desc + " " + a.code + " " + catOf(a).label)
      .toLowerCase()
      .includes(ql);
  });

  const grid = el("appGrid");
  if (!list.length) {
    grid.innerHTML = `
      <div class="empty" style="grid-column:1/-1">
        <span class="msym">search_off</span>
        <b>SIN COINCIDENCIAS</b>
        <p>Ninguna aplicación corresponde a <span class="q">«${esc(q)}»</span></p>
        <button class="pill solid" id="emptyClear"><span class="msym">close</span>Limpiar búsqueda</button>
      </div>`;
  } else {
    grid.innerHTML = list
      .map(
        (a, i) => `
      <div class="app-card" style="--d:${i}">
        <div class="ac-top">
          <span class="ac-ic ${catOf(a).t}"><span class="msym">${a.icon}</span></span>
          ${stChip(a)}
        </div>
        <b class="ac-name">${hl(a.name, q)}</b>
        <p class="ac-desc">${hl(a.desc, q)}</p>
        <div class="ac-meta">${hl(a.code, q)} · ${catOf(a).label} · ${a.last}</div>
        <div class="ac-foot">
          <button class="icon-btn js-copy" data-url="${a.url}" aria-label="Copiar enlace de ${esc(a.name)}"><span class="msym">content_copy</span></button>
          ${
            a.status === "ok"
              ? `<button class="pill solid js-connect" data-idx="${a.id}">Conectar<span class="msym">arrow_forward</span></button>`
              : `<button class="pill ghost js-blocked" data-idx="${a.id}" style="color:var(--warn);border-color:#f3d9ad"><span class="msym">warning</span>Bloqueada</button>`
          }
        </div>
      </div>`,
      )
      .join("");
  }

  el("resCount").innerHTML =
    "MOSTRANDO <b>" + list.length + "</b> DE " + APPS.length +
    " APLICACIONES REGISTRADAS";
  el("heroCount").textContent = list.length + " / " + APPS.length;
  el("qClear").style.display = q.length ? "grid" : "none";
  renderFavs();
}

export function bindSearch() {
  const q = el("q");
  q.addEventListener("input", () => {
    state.q = q.value;
    render();
  });

  el("qClear").addEventListener("click", () => {
    state.q = "";
    q.value = "";
    q.focus();
    render();
  });

  el("filters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.cat = chip.dataset.cat;
    el("filters").querySelectorAll(".chip").forEach((c) => c.classList.remove("on"));
    chip.classList.add("on");
    render();
  });

  document.addEventListener("click", (e) => {
    const clear = e.target.closest("#emptyClear");
    if (!clear) return;
    state.q = "";
    state.cat = "ALL";
    renderFilters();
    render();
  });
}