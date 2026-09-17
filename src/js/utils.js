export function esc(s) {
  const div = document.createElement("i");
  div.textContent = String(s == null ? "" : s);
  return div.innerHTML;
}

export function escReg(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function hl(t, q) {
  if (!q) return esc(t);
  return esc(t).replace(
    new RegExp("(" + escReg(esc(q)) + ")", "gi"),
    "<mark>$1</mark>",
  );
}

export function copyText(text, done) {
  const finish = () =>
    navigator.clipboard
      ? navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done))
      : fallbackCopy(text, done);
  finish();
}

function fallbackCopy(text, cb) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand("copy");
  } catch (_) {}
  document.body.removeChild(ta);
  cb();
}