/* ═══════════════════════════════════════════════════════════════════════════
   CONFIGURACIÓN DE LA INTRANET · AQUÍ SE AGREGAN LAS TARJETAS
   ═══════════════════════════════════════════════════════════════════════════

   ▶ PARA AGREGAR UNA NUEVA APLICACIÓN:
     1. Copia un bloque { ... } de la lista APPS de abajo.
     2. Pégalo al final de la lista (antes del corchete de cierre ]).
     3. Cambia: code, name, desc, cat, icon, url y fav. Listo.
        Aparece sola en la grilla, en el buscador, en los filtros
        y en las estadísticas. No hay que tocar nada más.

   ▶ CAMPOS DE CADA APLICACIÓN:
     code  : código corto que se muestra en la tarjeta (ej: 'FIN-03')
     name  : nombre visible de la aplicación
     desc  : descripción de una línea
     cat   : clave del área (debe existir en CATS, o usa 'GEN')
     icon  : nombre de ícono Material Symbols → fonts.google.com/icons
     url   : enlace real de la aplicación (http://192.168.1.50/app, etc.)
     status: 'ok' = operativa · 'warn' = en mantenimiento (bloquea el acceso)
     fav   : true = aparece en el carrusel de "Aplicaciones Frecuentes"
     last  : texto informativo del último acceso

   ▶ PARA UN ÁREA NUEVA (categoría): agrega una línea en CATS con
     su degradado (g-...) y color de icono (t-...). Si no la agregas,
     la app funciona igual usando el estilo GENÉRICO de respaldo.
   ═══════════════════════════════════════════════════════════════════════════ */

// ── Áreas y sus colores ─────────────────────────────────────────────
// g-… = degradado de tarjeta destacada · t-… = color de icono en tarjeta blanca
export const CATS = {
  CAL: { label: "CALIDAD", g: "g-green", t: "t-CAL" },
  GES: { label: "GESTIÓN", g: "g-blue", t: "t-GES" },
  RH: { label: "TALENTO HUMANO", g: "g-indigo", t: "t-RH" },
  CORR: { label: "CORRESPONDENCIA", g: "g-navy", t: "t-CORR" },
  WEB: { label: "SITIO WEB", g: "g-cyan", t: "t-WEB" },
  GEN: { label: "GENERAL", g: "g-deep", t: "t-GEN" }, // respaldo
};

// ── Aplicaciones de la Intranet ─────────────────────────────────────
export const APPS = [
  {
    code: "CAL-01",
    name: "ISO Document",
    desc: "Documentación del Sistema de Gestión de Calidad ISO 9001:2015.",
    cat: "CAL",
    icon: "folder_shared",
    url: "https://isodocument.tubrica.com",
    status: "ok",
    fav: true,
    last: "HOY · 08:15 AM",
  },
  {
    code: "GES-01",
    name: "Gesting",
    desc: "Sistema de gestión administrativa: procesos, seguimiento y reportes.",
    cat: "GES",
    icon: "analytics",
    url: "https://gesting.tubrica.com",
    status: "ok",
    fav: true,
    last: "HOY · 09:02 AM",
  },
  {
    code: "RH-01",
    name: "Vacaciones",
    desc: "Solicitud y aprobación de vacaciones, permisos y días disponibles.",
    cat: "RH",
    icon: "beach_access",
    url: "https://vacaciones.tubrica.com",
    status: "ok",
    fav: true,
    last: "AYER · 03:40 PM",
  },
  {
    code: "COR-01",
    name: "Correo Corporativo",
    desc: "Buzones institucionales y correspondencia oficial (Outlook Web).",
    cat: "CORR",
    icon: "mail",
    url: "https://correo.tubrica.com",
    status: "ok",
    fav: true,
    last: "HOY · 08:05 AM",
  },
  {
    code: "WEB-01",
    name: "tubrica.com",
    desc: "Sitio web público de la empresa: catálogo, noticias y contacto.",
    cat: "WEB",
    icon: "public",
    url: "https://tubrica.com",
    status: "ok",
    fav: true,
    last: "AYER · 05:12 PM",
  },
  /* ← Pega aquí la siguiente aplicación, ejemplo:
,
{
  code: 'TI-01',
  name: 'Mesa de Ayuda',
  desc: 'Soporte técnico interno: tickets y requerimientos.',
  cat: 'GEN',
  icon: 'support_agent',
  url: 'https://soporte.tubrica.com',
  status: 'ok',
  fav: false,
  last: '—'
}
*/
];

APPS.forEach((a, i) => (a.id = i));

// Helper de área: si el catálogo no existe, usa el respaldo GEN
export function catOf(a) {
  return CATS[a.cat] || CATS.GEN;
}