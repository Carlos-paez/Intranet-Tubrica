# Intranet Tubrica · Documentación Técnica

**Versión:** 4.1.0 · **Pila:** JavaScript vanilla · **Build:** Vite 7 · **Gestor:** pnpm

Portal de acceso único a las aplicaciones, sistemas y recursos internos de
Tuberías Industriales, C.A. (Valencia, Edo. Carabobo, Venezuela).

---

## 1. Resumen de arquitectura

La aplicación es un **SPA ligera sin frameworks**: HTML semántico en `index.html`,
estilos en un único CSS con variables de diseño, y lógica JS dividida en **módulos ES
por responsabilidad**. Los datos (aplicaciones y áreas) viven aislados en `src/data/apps.js`,
de modo que agregar tarjetas no requiere tocar código de presentación.

**Sin dependencias de runtime.** Se eliminaron jQuery, Bootstrap y Materialize
(reemplazados por JS vanilla y un sistema de toasts propio), reduciendo el JS servido
al navegador de ~200 KB de librerías CDN a ~12 KB minificados.

```
                     ┌────────────────────────────┐
                     │         index.html         │  maquetado estático + IDs
                     └──────────────┬─────────────┘
                                    │ <script type="module">
                                    ▼
                     ┌────────────────────────────┐
                     │         src/main.js        │  entrada: orquesta módulos,
                     └──┬──────┬──────┬──────┬────┘  atajos de teclado
                        ▼      ▼      ▼      ▼
                 catalog.js carousel clock  modal
                 search/favs  grid    reloj  conexión
                       │          │            │
                       └──── data/apps.js ─────┘   CATS + APPS + catOf()
```

---

## 2. Stack y versiones

| Herramienta | Función | Notas |
|---|---|---|
| Node.js ≥ 20.19 | Runtime | Se verificó en v25 |
| pnpm ≥ 10 | Gestor de paquetes / workspace | Instala y ejecuta scripts |
| Vite 7 | Dev server + bundler | `base: "./"` → build portable |
| Google Fonts | `Plus Jakarta Sans` + `JetBrains Mono` | Cargadas por CDN |
| Material Symbols | Iconografía (variable font) | Cargada por CDN |

> El proyecto **no** tiene dependencias de producción (`dependencies` vacío).
> Solo `vite` como `devDependency`.

---

## 3. Estructura del proyecto

```
intranet-tubrica/
├── index.html                 # Maquetado (sin lógica ni estilos inline)
├── index-original.html        # Respaldado del monolito original (no usar)
├── package.json               # Scripts + config pnpm
├── pnpm-workspace.yaml        # allowlist de builds + verifyDepsBeforeRun
├── vite.config.js             # base './', target es2018
├── dist/                      # Generado con `pnpm build` (no versionar)
└── src/
    ├── main.js                # Bootstrap de la app + atajos de teclado
    ├── data/
    │   └── apps.js            # ★ DATOS: CATS, APPS, catOf(), ids automáticos
    ├── styles/
    │   └── main.css           # Todos los estilos + variables + media queries
    └── js/
        ├── state.js           # Estado global compartido {q, cat}
        ├── utils.js           # esc(), escReg(), hl(), copyText()
        ├── toast.js           # Sistema de toasts (reemplazo de M.toast)
        ├── clock.js           # Reloj, fecha y saludo del hero
        ├── carousel.js        # Carrusel "Aplicaciones Frecuentes"
        ├── catalog.js         # stats, filtros, grilla, buscador
        ├── modal.js           # Modal de conexión + overlay de redirección
        ├── floats.js          # Botones flotantes (WhatsApp / volver arriba)
        └── nav.js             # Menú móvil hamburguesa
```

---

## 4. Ciclo de desarrollo

```bash
pnpm install     # primera vez (instala vite)
pnpm dev         # dev server → http://localhost:5173 (HMR)
pnpm build       # bundle de producción → dist/
pnpm preview     # sirve el build para probarlo localmente
```

**Comandos de verificación**

```bash
node --check src/data/apps.js      # valida sintaxis del data (tras editar apps)
# Lint/typecheck: no configurados — el proyecto es JS puro, el build de Vite
# ya falla si hay errores de sintaxis o de resolución de imports.
```

> **Nota pnpm:** si `pnpm install` avisa de `ERR_PNPM_IGNORED_BUILDS (esbuild)`, es inofensivo:
> el binario nativo viaja como paquete de plataforma (`@esbuild/win32-x64`) dentro de
> `node_modules/.pnpm`. `pnpm-workspace.yaml` incluye `verifyDepsBeforeRun: false` para que
> `pnpm run`/`pnpm exec` no ejecuten un `install` automático. Si quieres ejecutar el
> script de build de esbuild igualmente: `pnpm approve-builds` (interactivo).

---

## 5. Fuente de datos: `src/data/apps.js`

Es el único archivo que se edita cuando cambia el catálogo. Ver guía práctica en
[`docs/GUIA-AGREGAR-APPS.md`](GUIA-AGREGAR-APPS.md).

### 5.1 `CATS` — áreas / categorías

```js
export const CATS = {
  CAL:  { label: "CALIDAD",           g: "g-green",  t: "t-CAL"  },
  GES:  { label: "GESTIÓN",           g: "g-blue",   t: "t-GES"  },
  RH:   { label: "TALENTO HUMANO",    g: "g-indigo", t: "t-RH"   },
  CORR: { label: "CORRESPONDENCIA",   g: "g-navy",   t: "t-CORR" },
  WEB:  { label: "SITIO WEB",         g: "g-cyan",   t: "t-WEB"  },
  GEN:  { label: "GENERAL",           g: "g-deep",   t: "t-GEN"  }, // respaldo
};
```

- `label` — texto visible en tarjetas y meta.
- `g` — clase del degradado del carrusel (`.g-*` en CSS).
- `t` — clase de color de icono en tarjeta blanca (`.t-*` en CSS).

Si una app referencia un `cat` inexistente, `catOf()` devuelve `CATS.GEN`.

### 5.2 `APPS` — catálogo de aplicaciones

Cada objeto:

| Campo | Tipo | Descripción |
|---|---|---|
| `code` | string | Código corto (ej. `"CAL-01"`) |
| `name` | string | Nombre visible |
| `desc` | string | Descripción de una línea |
| `cat` | string | Clave de `CATS` (o `"GEN"`) |
| `icon` | string | Nombre de Material Symbol |
| `url` | string | Enlace real de la aplicación |
| `status` | `"ok"` \| `"warn"` | Decide si bloquea el acceso |
| `fav` | boolean | Si aparece en el carrusel de frecuentes |
| `last` | string | Texto del último acceso (ej. `"HOY · 08:15 AM"`) |

**Los `id` son automáticos:** se asigna `a.id = i` (índice) en el módulo al cargar.
Nunca se escriben a mano. El orden del arreglo = orden en filtros y grillas.

### 5.3 Helper `catOf(a)`

```js
export function catOf(a) {
  return CATS[a.cat] || CATS.GEN;
}
```
Resuelve la categoría con respaldo seguro ante categorías no registradas.

---

## 6. Módulos JavaScript

### 6.1 `main.js` — entrada / orquestador

- Importa CSS y todos los módulos.
- Inicializa en orden: `nav → clock → carousel → search/modal/floats`.
- Registra el **keyboard global**:

| Tecla | Acción |
|---|---|
| `/` | Enfoca el buscador (si no hay menú abierto y no se está escribiendo) |
| `Esc` | 1) cierra el menú móvil · 2) cancela el overlay de redirección · 3) cierra el modal · 4) limpia y desenfoca el buscador |
- Ejecuta el render inicial: `renderStats()`, `renderFilters()`, `render()`.

### 6.2 `state.js`

```js
export const state = { q: "", cat: "ALL" };
```
Estado compartido de búsqueda (`q`) y filtro de categoría (`cat`). `"ALL"` = sin filtro.

### 6.3 `utils.js`

| Función | Descripción |
|---|---|
| `esc(s)` | Escapa texto a HTML seguro (crea `<i>` con `textContent` y lee `.innerHTML`) |
| `escReg(s)` | Escapa metacaracteres regex |
| `hl(t, q)` | Resalta coincidencias de `q` en `t` con `<mark>…</mark>` (case-insensitive) |
| `copyText(text, done)` | Copia al portapapeles; usa `navigator.clipboard` y cae a `document.execCommand('copy')` en contextos no seguros (HTTP intranet) |

### 6.4 `toast.js`

Reemplazo ligero de `M.toast` de Materialize con idéntica apariencia:

- Añade un contenedor fijo `#toast-container` (abajo a la derecha, `z-index` alto).
- Crea `.tub-toast` (+ variantes `.ok` / `.warn` para el borde izquierdo).
- Animación de entrada (`in`) y salida (`out`), duración total ≈ 4.3 s.
- En pantallas ≤ 640 px el contenedor pasa a ancho completo bajo el viewport.

### 6.5 `clock.js`

- Cada segundo actualiza `#hdrDate` (format `es-VE`, UPPERCASE) y `#hdrClock` (HH:MM:SS 24 h).
- Calcula el saludo según hora del sistema en `#greet`:
  - `< 12` → `BUENOS DÍAS`
  - `< 19` → `BUENAS TARDES`
  - resto → `BUENAS NOCHES`

### 6.6 `carousel.js` — Aplicaciones Frecuentes

- Filtra `APPS` por `fav === true` y renderiza tarjetas `.fav-card` + puntos `.dot-c`.
- Paso de scroll: `tarjeta.offsetWidth + 20` (gap).
- `updateCarUI()` (se dispara con scroll vía `requestAnimationFrame`):
  - habilita/deshabilita `#carPrev` / `#carNext`,
  - sincroniza el punto activo.
- Controles: botones laterales, dots y **scroll-snap táctil** (nativo).
- Las tarjetas reutilizan `hl()` → el carrusel también refleja la búsqueda activa.
- En móvil los botones laterales se ocultan (se navega por swipe).

### 6.7 `catalog.js` — stats, filtros, grilla y búsqueda

| Función | Descripción |
|---|---|
| `renderStats()` | Chips del hero: total, operativas y (si aplica) en mantenimiento |
| `renderFilters()` | Chips por categoría con contadores derivados de `APPS` |
| `render()` | Filtra por `state.cat` + `state.q` (nombre, desc, código, label), dibuja grilla o estado vacío, actualiza `#resCount`, `#heroCount`, visibilidad de `#qClear` y re-renderiza el carrusel |
| `bindSearch()` | Eventos: `input` del buscador, limpiar `#qClear`, click en chips, limpiar desde el estado vacío |

**Orden de prioridad del click en la grilla (delegación en `modal.js`):** copiar →
bloqueada → conectar. Ver 6.8.

### 6.8 `modal.js` — confirmación y redirección

Delegación de eventos a nivel `document` para tarjetas dinámicas:

1. `.js-copy` — copia la URL al portapapeles y avisa con toast; evita disparar el modal.
2. `.js-blocked` — aplicación en mantenimiento: muestra toast de advertencia.
3. `.js-connect` — abre el modal `#connModal` con los datos de la app.

**Flujo de conexión:**
```
click "Conectar" → openModal() → confirmar "Conectar" → closeModal() →
runConnection() → overlay #ov con host, barra de progreso y 3 pasos →
window.location.href = url (aplicación redirige)
```
- Timers con `setTimeout` (450 ms + i·500 ms). `cancelConnection()` limpia `connTimers`.
- `Esc` cancela el overlay; click fuera del `modal-box` cierra el modal.
- `document.body.style.overflow = "hidden"` bloquea el scroll mientras hay capa abierta.

### 6.9 `floats.js`

- `#fabWa` — toast con datos de la mesa de ayuda TI.
- `#fabTop` — aparece al hacer scroll > 400 px; vuelve arriba con animación suave.

### 6.10 `nav.js` — menú móvil

- Solo visible en `≤ 991 px` (`@media (max-width: 991px)`): botón `#navToggle` (menú/cerrar)
  que despliega `#navPanel` con los 4 enlaces.
- Cierra al: pulsar el toggle, tocar un enlace, hacer click fuera del header, o `Esc`.
- Estado accesible: `aria-expanded` manejado.
- `bindNav()` devuelve `{ close, isOpen }` para que `main.js` coordine atajos.

---

## 7. Estilos: `src/styles/main.css`

### 7.1 Variables de diseño (`:root`)

```css
--navy #0d2b6b · --navy-2 #0a2158 · --navy-3 #16409c · --blue #1d5fd0
--bg #f4f7fc · --card #ffffff · --line/-2 … · --ink #12234d
--mut #5c6b8a · --dim #8b97b3
--ok/-bg #15803d/#e8f7ee · --warn/-bg #b45309/#fdf3e3
--mono "JetBrains Mono"
```

### 7.2 Secciones clave

| Bloque | Contenido |
|---|---|
| `.pill` | Botones pastilla (`.solid`, `.ghost`, `.white`, `.glass`) |
| `.tb-nav` / `.nav-in` | Cabecera sticky azul marino; reloj |
| `.nav-toggle` / `.nav-panel` | Menú móvil |
| `.hero`, `.search`, `.stats` | Cabecera de bienvenida, buscador cápsula, chips |
| `.car-track`, `.fav-card`, `.g-*` | Carrusel con scroll-snap y degradados |
| `.chip` | Filtros por área |
| `.grid-apps`, `.app-card` | Grilla responsive; animación `cardIn` con `--d` (retardo) |
| `.footer`, `.fab` | Pie y botones flotantes |
| `.modal-*`, `.ov-*` | Modal y overlay de redirección; animación `stepIn` |
| `.tub-toast`, `#toast-container` | Toasts propios |

### 7.3 Responsive (breakpoints)

| Breakpoint | Cambios |
|---|---|
| `≤ 991 px` | Oculta `.nav-links` y muestra hamburguesa; tarjetas frecuentes a 2 columnas; footer a 1 columna |
| `≤ 767.98 px` | Oculta el reloj (replica `d-none d-md-block` de Bootstrap) |
| `≤ 640 px` | Tarjetas frecuentes al 86 % con swipe; sin botones de carrusel; buscador 56 px; grilla 1 columna; toasts full-width |

Se mantiene `@media (prefers-reduced-motion: reduce)` que desactiva animaciones/transiciones.

### 7.4 Accesibilidad aplicada

- `:focus-visible` con outline en `--blue`.
- Roles/aria: `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-label`, `aria-expanded`.
- `kbd`/hint de atajos visibles; `scroll-snap` respeta `prefers-reduced-motion`.
- Texto con contraste alto sobre fondos navy/white.

---

## 8. Build y despliegue

### 8.1 `vite.config.js`

```js
export default defineConfig({
  base: "./",          // rutas relativas → portable a cualquier subruta de la intranet
  build: { sourcemap: false, target: "es2018" },
});
```

### 8.2 Salida de `pnpm build` (referencia)

| Archivo | Tamaño aprox. |
|---|---|
| `dist/index.html` | ~11 kB (gzip ~3.6 kB) |
| `dist/assets/*.css` | ~19 kB (gzip ~4.8 kB) |
| `dist/assets/*.js` | ~12 kB (gzip ~4.7 kB) |

> La IA/Recursos externos (Google Fonts + Material Symbols) se cargan por CDN y no se
> bundlean; requieren conexión.

### 8.3 Puesta en producción de la intranet

1. `pnpm build`
2. Subir el contenido de `dist/` al servidor web (p.ej. IIS / Nginx) en la ruta deseada.
3. No es necesario ejecutar el dev server en producción; `dist/` es estático.

---

## 9. Notas de mantenimiento

- **Añadir apps/categorías:** solo edita `src/data/apps.js` (ver guía).
- **Íconos:** usa la familia *Material Symbols Outlined*; nombres válidos en
  `https://fonts.google.com/icons`. El CSS `.msym` configura `font-variation-settings`.
- **Estados:** `"warn"` bloquea el botón "Conectar" (muestra «Bloqueada» + toast).
- **Búsqueda:** insensible a mayúsculas; busca en `name + desc + code + label`.
- **Portapapeles en HTTP:** `navigator.clipboard` solo existe en contextos seguros
  (HTTPS o `localhost`); `copyText()` cae automáticamente al fallback legacy.
- **Concurrencia de timers:** todos los `setTimeout` de la conexión se registran en
  `connTimers` y se limpian al cancelar, evitando redirecciones fantasma.

---

## 10. Glosario de IDs usados por el JS

`hdrDate, hdrClock, greet, q, heroCount, qClear, stats, carTrack, carPrev,
carNext, carDots, filters, appGrid, resCount, fabWa, fabTop, connModal,
mIcon, mIconBox, mName, mCode, mUrl, mGo, mClose, mCancel, ov, ovHost,
ovSteps, ovBar, ovCancel, navToggle, navPanel`