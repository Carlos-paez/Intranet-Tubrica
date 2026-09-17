import { APPS, catOf } from "../data/apps.js";
import { esc, hl } from "./utils.js";
import { state } from "./state.js";

const el = (id) => document.getElementById(id);

function favList() {
  return APPS.filter((a) => a.fav);
}

export function renderFavs() {
  const favs = favList();
  el("carTrack").innerHTML = favs
    .map(
      (a) => `
    <button class="fav-card ${catOf(a).g} js-connect" data-idx="${a.id}" aria-label="Conectar a ${esc(a.name)}">
      <div class="fc-top">
        <span class="fc-ic"><span class="msym">${a.icon}</span></span>
        <span class="fc-st"><i class="dot"></i>${a.status === "ok" ? "OPERATIVA" : "MANTENIMIENTO"}</span>
      </div>
      <div class="fc-name">${hl(a.name, state.q.trim())}</div>
      <div class="fc-desc">${esc(a.desc)}</div>
      <div class="fc-meta">${a.code} · ${catOf(a).label}</div>
      <div class="fc-actions">
        <span class="pill glass js-copy" data-url="${a.url}" role="button" tabindex="-1"><span class="msym">content_copy</span></span>
        <span class="pill white go">Conectar<span class="msym">arrow_forward</span></span>
      </div>
    </button>`,
    )
    .join("");
  el("carDots").innerHTML = favs
    .map(
      (_, i) =>
        `<button class="dot-c ${i === 0 ? "on" : ""}" data-i="${i}" aria-label="Ir a tarjeta ${i + 1}"></button>`,
    )
    .join("");
  updateCarUI();
}

function carStep() {
  const c = el("carTrack").querySelector(".fav-card");
  return c ? c.offsetWidth + 20 : 300;
}

function updateCarUI() {
  const tr = el("carTrack");
  if (!tr) return;
  const max = tr.scrollWidth - tr.clientWidth - 4;
  el("carPrev").disabled = tr.scrollLeft < 10;
  el("carNext").disabled = tr.scrollLeft > max;
  const n = Math.max(1, favList().length);
  const i = Math.min(n - 1, Math.round(tr.scrollLeft / carStep()));
  el("carDots")
    .querySelectorAll(".dot-c")
    .forEach((d, j) => d.classList.toggle("on", j === i));
}

export function initCarousel() {
  const tr = el("carTrack");
  tr.addEventListener(
    "scroll",
    () => requestAnimationFrame(updateCarUI),
    { passive: true },
  );
  el("carPrev").addEventListener("click", () =>
    tr.scrollBy({ left: -carStep(), behavior: "smooth" }),
  );
  el("carNext").addEventListener("click", () =>
    tr.scrollBy({ left: carStep(), behavior: "smooth" }),
  );
  el("carDots").addEventListener("click", (e) => {
    const dot = e.target.closest(".dot-c");
    if (!dot) return;
    tr.scrollTo({ left: +dot.dataset.i * carStep(), behavior: "smooth" });
  });
}