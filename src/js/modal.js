import { APPS, catOf } from "../data/apps.js";
import { toast } from "./toast.js";
import { copyText } from "./utils.js";

const el = (id) => document.getElementById(id);

let currentApp = null;
let connTimers = [];

export function openModal(a) {
  currentApp = a;
  el("mIcon").textContent = a.icon;
  el("mIconBox").className = "ac-ic " + catOf(a).t;
  el("mName").textContent = a.name;
  el("mCode").textContent = a.code + " · " + catOf(a).label;
  el("mUrl").textContent = a.url;
  el("connModal").classList.add("on");
  document.body.style.overflow = "hidden";
  el("mGo").focus();
}

export function closeModal() {
  el("connModal").classList.remove("on");
  document.body.style.overflow = "";
}

export function cancelConnection() {
  connTimers.forEach(clearTimeout);
  connTimers = [];
  el("ov").classList.remove("on");
  document.body.style.overflow = "";
  toast("CONEXIÓN CANCELADA", "warn");
}

function runConnection(a) {
  let host = a.url;
  try {
    host = new URL(a.url).host;
  } catch (_) {}
  el("ovHost").textContent = host;
  el("ovSteps").innerHTML = "";
  el("ovBar").style.width = "0%";
  el("ov").classList.add("on");
  document.body.style.overflow = "hidden";

  const steps = [
    "VERIFICANDO ENLACE",
    "ABRIENDO CANAL CIFRADO TLS 1.3",
    "REDIRIGIENDO A " + host.toUpperCase(),
  ];
  connTimers.forEach(clearTimeout);
  connTimers = [];

  steps.forEach((s, i) => {
    connTimers.push(
      setTimeout(() => {
        const li = document.createElement("li");
        li.innerHTML = '<span class="msym">check_circle</span>' + s;
        el("ovSteps").appendChild(li);
        el("ovBar").style.width = ((i + 1) / steps.length) * 100 + "%";
      }, 450 + i * 500),
    );
  });

  connTimers.push(
    setTimeout(() => {
      window.location.href = a.url;
    }, 450 + steps.length * 500 + 400),
  );
}

function copyClick(elCopy) {
  const url = elCopy.dataset.url;
  const shown = url.replace("https://", "");
  const done = () =>
    toast(
      '<span class="msym" style="font-size:14px;vertical-align:-2px">content_copy</span>&nbsp; ENLACE COPIADO · ' +
        shown,
      "ok",
    );
  copyText(url, done);
}

export function bindModal() {
  document.addEventListener("click", (e) => {
    const copy = e.target.closest(".js-copy");
    const blocked = e.target.closest(".js-blocked");
    const card = e.target.closest(".js-connect");
    if (copy) {
      copyClick(copy);
      return;
    }
    if (blocked) {
      const a = APPS[+blocked.dataset.idx];
      toast(
        '<span class="msym" style="font-size:14px;vertical-align:-2px">warning</span>&nbsp; ' +
          a.code +
          " EN MANTENIMIENTO PROGRAMADO",
        "warn",
      );
      return;
    }
    if (card) {
      openModal(APPS[+card.dataset.idx]);
    }
  });

  el("mClose").addEventListener("click", closeModal);
  el("mCancel").addEventListener("click", closeModal);
  el("connModal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  el("mGo").addEventListener("click", () => {
    if (!currentApp) return;
    const a = currentApp;
    closeModal();
    runConnection(a);
  });
  el("ovCancel").addEventListener("click", cancelConnection);
}