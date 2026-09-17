# GUÍA · Cómo agregar más tarjetas de aplicaciones

> **Archivo a editar:** `src/data/apps.js`
> Sección: `export const APPS = [...]`

Cada tarjeta de la intranet se define con **un solo objeto** dentro de la lista `APPS`.
Agregar una aplicación NO requiere tocar HTML, CSS ni ningún otro módulo: la grilla, el
buscador, los filtros, el carrusel de frecuentes y las estadísticas se actualizan solos.

---

## 1. Campos de cada aplicación

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `code` | string | ✅ | Código corto mostrado en la tarjeta. Ej: `"FIN-03"` |
| `name` | string | ✅ | Nombre visible de la aplicación |
| `desc` | string | ✅ | Descripción de una línea |
| `cat`  | string | ✅ | Clave del área. Debe existir en `CATS` o usa `"GEN"` |
| `icon` | string | ✅ | Nombre de ícono **Material Symbols** → https://fonts.google.com/icons |
| `url`  | string | ✅ | Enlace de la app. Ej: `"http://192.168.1.50/app"` |
| `status` | string | ✅ | `"ok"` = operativa · `"warn"` = en mantenimiento (bloquea el botón Conectar) |
| `fav`  | boolean | ✅ | `true` → aparece en el carrusel "Aplicaciones Frecuentes" |
| `last` | string | ⬜ | Texto del último acceso. Ej: `"HOY · 08:15 AM"` (usa `"—"` si no hay) |

> El campo `id` NO se escribe: se asigna automáticamente (`APPS.forEach((a, i) => (a.id = i))`).
> El orden en la lista determina los `id` y el orden en que se muestran los filtros/grillas.

---

## 2. Pasos para agregar a mano

1. Abre `src/data/apps.js` y localiza el final de la lista `APPS` (busca `/* ← Pega aquí la siguiente aplicación`).
2. Añade una coma al final del último objeto y pega un bloque nuevo ANTES del corchete `]`:

```js
{
  code: "TI-01",
  name: "Mesa de Ayuda",
  desc: "Soporte técnico interno: tickets y requerimientos.",
  cat: "GEN",
  icon: "support_agent",
  url: "https://soporte.tubrica.com",
  status: "ok",
  fav: false,
  last: "—",
},
```

3. Guarda. Si estás en `pnpm dev`, la página se recarga sola. Si no, ejecuta `pnpm dev` o `pnpm build`.
4. Verifica en el navegador: la tarjeta aparece en "Todas las Aplicaciones", en el buscador y en las estadísticas.

---

## 3. Si la app es de un área nueva (categoría)

Agrega una entrada en `CATS` (mismo archivo, más arriba). El objeto requiere:

- `label` — texto visible. Ej: `"TI"`
- `g` — degradado de la tarjeta del carrusel (clase CSS `g-...`)
- `t` — color de icono en la tarjeta blanca (clase CSS `t-...`)

```js
TI: { label: "TI", g: "g-teal", t: "t-TI" },   // ← según área
```

Si la categoría NO aparece en `CATS`, la app sigue funcionando con el respaldo `GEN`.

### Degradados y colores de icono disponibles

| Área | `g` (carrusel) | `t` (icono) |
|---|---|---|
| CALIDAD | `g-green` | `t-CAL` |
| GESTIÓN | `g-blue` | `t-GES` |
| TALENTO HUMANO | `g-indigo` | `t-RH` |
| CORRESPONDENCIA | `g-navy` | `t-CORR` |
| SITIO WEB | `g-cyan` | `t-WEB` |
| GENERAL (respaldo) | `g-deep` | `t-GEN` |

Para un color nuevo define tu propia clase CSS en `src/styles/main.css`
(p.ej. `.t-TI { background: ...; color: ...; }`).

---

## 4. Prompt listo para pegar (usar con un asistente de IA)

Si quieres que la tarjeta la genere (o la revise) un asistente, copia el texto de abajo
y reemplaza SOLO lo que está entre «corchetes»:

```
Actúa como desarrollador del proyecto de la Intranet Tubrica (proyecto pnpm + Vite,
JavaScript vanilla, configuración en src/data/apps.js).

Agrega una nueva aplicación a la lista APPS en src/data/apps.js, respetando EXACTA
y ÚNICAMENTE el formato existente (objeto { code, name, desc, cat, icon, url, status, fav, last }).

Datos de la aplicación:
- Nombre: [nombre de la app]
- Descripción (1 línea): [descripción]
- Código: [p.ej. TI-02]
- Área/categoría: [CAL | GES | RH | CORR | WEB | GEN | otra → indícame el degradado y color]
- Ícono Material Symbols: [ícono, consulta https://fonts.google.com/icons]
- URL: [enlace]
- Estado: [ok | warn]
- ¿Frecuente (carrusel)?: [sí | no]
- Último acceso: [texto o —]

Reglas:
1. No modifiques ningún otro archivo ni el HTML.
2. Si agregas una categoría nueva, añade también su entrada en CATS con g y t válidos.
3. El campo id no debe escribirse (se asigna solo).
4. Mantén el estilo de comillas y sangría del archivo.
5. Después de editar, ejecuta: node --check src/data/apps.js  (debe pasar sin errores).
```

---

## 5. Verificación rápida después de editar

```bash
node --check src/data/apps.js   # sintaxis OK
pnpm dev                        # ver en el navegador
```

**Errores típicos**

- ❌ Olvidar la coma en el objeto anterior → error de sintaxis.
- ❌ Escribir `id` a mano → se sobrescribe al cargar.
- ❌ `icon` con nombre inexistente → aparece el texto del ícono en lugar del símbolo.
- ❌ `status` distinto de `"ok"`/`"warn"` → cae en estado "Mantenimiento".
- ⚠️ URL sin `https://` o `http://` → el modal muestra la URL como «—».