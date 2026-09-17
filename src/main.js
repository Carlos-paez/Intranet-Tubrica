import "./styles/main.css";
import { state } from "./js/state.js";
import { initClock } from "./js/clock.js";
import { initCarousel } from "./js/carousel.js";
import { bindSearch, render, renderStats, renderFilters } from "./js/catalog.js";
import { bindModal, closeModal, cancelConnection } from "./js/modal.js";
import { bindFloats } from "./js/floats.js";
import { bindNav } from "./js/nav.js";

const nav = bindNav();

initClock();
initCarousel();
bindSearch();
bindModal();
bindFloats();

document.addEventListener("keydown", (e) => {
  const t = e.target;
  const typing = !!(t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA"));

  if (e.key === "/" && !typing) {
    if (nav.isOpen()) return;
    e.preventDefault();
    document.getElementById("q").focus();
    return;
  }

  if (e.key === "Escape") {
    if (nav.isOpen()) {
      nav.close();
      return;
    }
    if (document.getElementById("ov").classList.contains("on")) {
      cancelConnection();
      return;
    }
    if (document.getElementById("connModal").classList.contains("on")) {
      closeModal();
      return;
    }
    if (typing) {
      const q = document.getElementById("q");
      q.value = "";
      state.q = "";
      render();
      q.blur();
    }
  }
});

renderStats();
renderFilters();
render();