import { toast } from "./toast.js";

export function bindFloats() {
  document.getElementById("fabWa").addEventListener("click", () => {
    toast(
      '<span class="msym" style="font-size:14px;vertical-align:-2px">support_agent</span>&nbsp; MESA DE AYUDA TI · EXT. 4100 · soporte.interno@tubrica.com',
      "ok",
    );
  });

  const fabTop = document.getElementById("fabTop");
  window.addEventListener(
    "scroll",
    () => fabTop.classList.toggle("on", window.scrollY > 400),
    { passive: true },
  );
  fabTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
}