export function initClock() {
  const hdrDate = document.getElementById("hdrDate");
  const hdrClock = document.getElementById("hdrClock");
  const greet = document.getElementById("greet");

  function tick() {
    const d = new Date();
    const f = new Intl.DateTimeFormat("es-VE", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    })
      .format(d)
      .toUpperCase();
    const h = d.toLocaleTimeString("es-VE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    hdrDate.textContent = f;
    hdrClock.textContent = h;

    const hr = d.getHours();
    const sal =
      hr < 12 ? "BUENOS DÍAS" : hr < 19 ? "BUENAS TARDES" : "BUENAS NOCHES";
    greet.textContent = "◈ " + sal + ", EQUIPO TUBRICA — TURNO EN CURSO";
  }

  tick();
  setInterval(tick, 1000);
}