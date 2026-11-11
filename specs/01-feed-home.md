# SPEC 01 — Home con el feed de la docente

> **Estado:** Aprobado
> **Depende de:** —
> **Fecha:** 2026-11-10
> **Objetivo:** Reemplazar la home del starter por una réplica estática del mockup `references/pantallas/feed.dc.html`, con datos de ejemplo tipados y sin autenticación ni base de datos.

## Alcance

**In:**

- `/` renderiza la pantalla completa del mockup: sidebar fija de la docente, CTA «Nueva publicación», navegación, tarjeta de usuario, y columna central con encabezado, composer, separador «PUBLICADO HOY» y los 3 posts (logro, actividad con hueco de foto, anuncio).
- Shell de 100vh: la sidebar queda fija y el scroll ocurre dentro de `<main>`, igual que el mockup.
- Paleta, tipografías (Fredoka + Nunito), tamaños, interlineados, sombras, radios e iconos SVG tomados literalmente del mockup.
- Contenido de ejemplo en `data/feed.ts`, un módulo tipado que la página recorre con `map`; reemplazable por datos reales sin tocar la UI.
- Componentes organizados en `components/shared/` (shell y átomos repetidos) y `components/home/` (propios de esta pantalla).
- `lang="es"`, metadata `OpenDayCare`, y limpieza del starter (fuentes Geist, tokens `--background`/`--foreground`, dark mode).
- Enlaces a pantallas inexistentes quedan inertes (no navegan, `title="Próximamente"`).

**Fuera de alcance (para specs futuras):**

- Autenticación, sesión, roles docente/familia y cualquier ruta protegida.
- Base de datos, API routes, server actions o persistencia de cualquier tipo.
- Rutas `/ninos`, `/avisos`, `/mi-cuenta`, `/crear-publicacion`, `/detalle-publicacion`, `/login`, `/foto` y sus pantallas: existen como mockups, no como código.
- Interactividad: dar like, comentar, editar, subir foto, abrir el composer. Todo es visual.
- Diseño responsive móvil propio.
- Dark mode.

### Anclas de fidelidad visual

Estos valores son el contrato de «idéntico». Cualquier desvío se corrige en el paso de verificación, no se negocia en el código.

| Grupo | Valor exacto |
| --- | --- |
| Superficies | app `#F6ECDF`, tarjeta `#FFFDF9`, borde `#ECE0D0`, divisor `#E7DAC8`, borde de acciones `#F0E6D8` |
| Texto | títulos `#3F362E`, cuerpo de post `#4A4038`, secundario `#94887B`, meta `#A89A8B`, labels `#8A7C6D` |
| Acento | gradiente CTA `180deg #F4977E → #EE8164`, coral `#EE8164`, nav activa `#FBE3D8` / `#D9583C`, «Editar» `#C5503A`, corazón `#E0654A` |
| Tipografía | Fredoka 600 para títulos, H1 30px, nombres 16.5px; Nunito en todo el resto; eyebrow 12.5px / 800 / `.8px` |
| Layout | sidebar `248px`, padding `24px 16px`; columna `max-width: 760px`, padding `34px 40px 80px` |
| Tarjetas | radio `20px`, padding `20px 22px`, sombra `0 4px 16px -12px rgba(120,90,60,.5)` |
| Avatares | post `44px`, composer `40px`, sidebar `38px`, radio 50%, inicial en Fredoka 600 |
| Pills de tipo | radio `999px`, padding `6px 12px`, texto 12px / 800 / `.5px` + punto de 8px: LOGRO `#CFEBD8` / `#3E9B6C`, ACTIVIDAD `#C7E7F1` / `#2E89A6`, ANUNCIO `#CCD8F4` / `#4E72C8` |
| Media vacía | alto `200px`, radio `16px`, borde `1.5px dashed #DBCDBA`, fondo `#F4ECE1` |
| Scrollbar | ancho `10px`, pulgar `#E4D6C4`, radio `8px`, borde `3px` transparente con `background-clip: content-box` |

## Modelo de datos

Un solo módulo, `data/feed.ts`:

```ts
type BasePost = {
  id: string;
  time: string;   // "14:20"
  author: string; // "publicado por vos"
  audience: string; // "Para: familia de Mateo" | "Para: toda la sala"
  body: string;
  likes: number;
  comments: number;
  photoCaption?: string; // "Foto · pintando con témperas"
};

export type PostKind = "achievement" | "activity" | "announcement";

export type Post =
  | (BasePost & { kind: "achievement" | "activity"; child: string }) // "Mateo"
  | (BasePost & { kind: "announcement" });

export type Teacher = { name: string; initial: string; role: string };

export const teacher: Teacher = {
  name: "Caro Giménez",
  initial: "C",
  role: "Maestra · Soles",
};

export const classroom = {
  room: "Sala Soles",
  eyebrow: "GUARDERÍA · SALA SOLES",
  salutation: "Buenas, Caro",
  summary: "12 niños · martes 17 jun",
};
```

`posts` contiene exactamente los 3 posts del mockup, en ese orden:

1. `id: "post-achievement"`, `kind: "achievement"`, `child: "Mateo"`, `time: "14:20"`, `audience: "Para: familia de Mateo"`, likes `3`, comments `1`, body «¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.»
2. `id: "post-activity"`, `kind: "activity"`, `child: "Mateo"`, `time: "09:40"`, `audience: "Para: familia de Mateo"`, likes `5`, comments `2`, body «Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.», `photoCaption: "Foto · pintando con témperas"`.
3. `id: "post-announcement"`, `kind: "announcement"`, `time: "07:50"`, `audience: "Para: toda la sala"`, likes `8`, comments `0`, body «El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.»

Correspondencia entre el identificador interno y la etiqueta visible:

| `kind` | Etiqueta en pantalla | Fondo / texto / punto |
| --- | --- | --- |
| `achievement` | LOGRO | `#CFEBD8` / `#3E9B6C` / `#3E9B6C` |
| `activity` | ACTIVIDAD | `#C7E7F1` / `#2E89A6` / `#2E89A6` |
| `announcement` | ANUNCIO | `#CCD8F4` / `#4E72C8` / `#4E72C8` |

Convenciones:

- `kind` es una unión discriminada: define avatar + nombre del niño (`achievement`/`activity`) o círculo con megáfono + «Anuncio general» (`announcement`).
- Los identificadores (tipos, funciones, props, constantes y archivos) van en inglés. Los textos que se ven en pantalla van en español.
- Los valores de datos (`"Mateo"`, `"martes 17 jun"`, los cuerpos de los posts) conservan el español porque son contenido, no código.
- La fecha es literal (`"martes 17 jun"`), no se calcula con `new Date()`.
- No hay estado de cliente: todo son componentes de servidor.
- Ningún componente importa valores de `@/data/feed`; solo `app/page.tsx` los importa y pasa datos por props. Los tipos compartidos (`Post`, `PostKind`, `Teacher`) sí se importan con `import type`.

## Plan de implementación

Cada paso deja el sistema compilando y navegable.

1. **Tokens.** En `app/globals.css`: borrar `--background`/`--foreground`, el bloque `prefers-color-scheme` y la fuente Arial. Agregar `@theme inline` con los `--color-*` de la tabla, `--font-sans: var(--font-nunito)`, `--font-heading: var(--font-fredoka)`, más `body` con fondo/texto/fuente y el scrollbar del mockup. Manual: `npm run dev` sigue levantando.
2. **Fuentes y metadata.** En `app/layout.tsx`: reemplazar Geist por `Fredoka` y `Nunito` de `next/font/google` con `subsets: ["latin"]`, `lang="es"` y `title: "OpenDayCare"`. Manual: `/` muestra la sans nueva.
3. **Datos.** Crear `data/feed.ts` con los tipos, `teacher`, `classroom` y `posts` de esta spec.
4. **Iconos.** Crear `components/shared/icons.tsx` con los SVG copiados literalmente del mockup (sol de marca, más, casa, niños, campana, usuario, salir, cámara, corazón, comentario, imagen, megáfono), respetando `stroke-width`, `stroke-linecap` y `stroke-linejoin`.
5. **Avatar.** Crear `components/shared/avatar.tsx` con props `{ label, tone: "peach" | "sky" | "lilac", size: "sm" | "md" | "lg" }` (38 / 40 / 44 px) y un `icon` opcional para el caso del anuncio.
6. **Badge.** Crear `components/shared/post-kind-badge.tsx` con props `{ kind: PostKind }` y un mapa `Record<PostKind, { label, background, text, dot }>` con la tabla de correspondencia (`achievement` → «LOGRO», `activity` → «ACTIVIDAD», `announcement` → «ANUNCIO»).
7. **Sidebar.** Crear `components/shared/brand-mark.tsx` (logo degradado + «OpenDayCare» / sala) y `components/shared/app-sidebar.tsx`, que recibe `{ room, teacher }` por props, define `NAV_ITEMS` (4 ítems, `label` en español y `active` en Feed) y deja inertes CTA, ítems no-Feed y botón de salir.
8. **Piezas del home.** Crear `components/home/feed-composer.tsx` (`{ initial }`) y `components/home/section-label.tsx` (`{ children }`).
9. **Tarjeta de post.** Crear `components/home/feed-post-card.tsx` con `{ post: Post }`. La cabecera discrimina por `kind`: `achievement`/`activity` muestran avatar y `post.child`; `announcement` muestra el círculo con megáfono y «Anuncio general». Incluye badge, destinatario, cuerpo, media vacía opcional y fila de acciones (corazón + número, comentario + número, «Editar»), todo inerte.
10. **Home.** Reemplazar `app/page.tsx` por el shell (`flex h-screen min-w-[1008px] bg-cream`) con `<AppSidebar />` y `<main className="h-screen overflow-y-auto">`, encabezado desde `classroom`, `<FeedComposer />`, `<SectionLabel>PUBLICADO HOY</SectionLabel>` y `posts.map(<FeedPostCard />)`. `1008px` sale de `248 + 760`: por debajo aparece scroll horizontal en vez de reflow.
11. **Paridad visual.** Con Playwright, capturar a `1280×800` desde `http://localhost:3000` y desde `file:///…/references/pantallas/feed.dc.html`, ambas en `.playwright-mcp/`, y corregir diferencias de spacing, sombra, tracking o line-height hasta que coincidan.
12. **Cierre.** `npx tsc --noEmit`, `npx eslint app`, `npm run build`.

## Criterios de aceptación

- [x] ✅ `/` responde 200 y la consola del navegador no muestra errores ni warnings de hidratación. — `next start -p 3001`: HTTP 200 y 0 mensajes de consola. En dev: 0 errores; solo 2 warnings de preload del overlay de `nextjs.org/agent-feedback`, ajenos a la app.
- [x] ✅ A `1280×800` la captura de `/` coincide con la de `feed.dc.html` en colores, tipografías, tamaños, sombras y espaciados; las únicas diferencias visibles son las derivadas del min-width. — `spec01-home-prod-1280.png` vs `spec01-mockup-1280.png`: 18 px distintos de 1.024.000 (0,002 %, delta máx. 7) por antialiasing de fuentes. Medidas: sidebar 248 px, `<main>` 1032 px, columna 760 px. El círculo del anuncio usa `tone="periwinkle"` (`#CCD8F4`/`#4E72C8`), tono que el paso 5 no enumeraba pero exige el mockup.
- [x] ✅ El documento tiene `lang="es"` y el título de la pestaña es `OpenDayCare`. — `document.documentElement.lang === "es"` y `document.title === "OpenDayCare"`.
- [x] ✅ No queda ninguna referencia a Geist, `--background`, `--foreground` ni al modo oscuro del starter. — `grep` sobre `app/`, `components/` y `data/` sin coincidencias de `Geist`, `--background`, `--foreground`, `prefers-color-scheme` ni `use client`.
- [x] ✅ El body no scrollea verticalmente: scrollea solo `<main>`, y la sidebar permanece visible al llegar al final del feed. — `body.scrollHeight 800 = clientHeight 800`; `<main>` 1242/800 con `overflow-y: auto`. Con `<main>` al final, la sidebar sigue en `top: 0` y 800 px de alto.
- [x] ✅ Ningún clic de la página lleva a una ruta inexistente ni produce 404. — 0 elementos `<a>`; 14 controles inertes con `title="Próximamente"`.
- [x] ✅ Los 3 posts muestran tipo, hora, destinatario, texto, likes y comentarios exactos del mockup, en ese orden. — DOM: logro (14:20, 3/1), actividad (09:40, 5/2, foto), anuncio (07:50, 8/0), con destinatarios y cuerpos literales.
- [x] ✅ Los `kind` del código son `achievement`, `activity` y `announcement`; en pantalla se ven «LOGRO», «ACTIVIDAD» y «ANUNCIO». — `data/feed.ts` y `post-kind-badge.tsx`; textos confirmados en el DOM.
- [x] ✅ El post de actividad muestra el hueco punteado de 200px con «Foto · pintando con témperas». — Medido: 200 px de alto, `border-radius` 16 px, fondo `#F4ECE1`, borde `dashed #DBCDBA` (`border-[1.5px]`; Chrome lo reporta como 1 px en `getComputedStyle`).
- [x] ✅ La barra de scroll del área central se ve con el pulgar `#E4D6C4`. — Regla en `app/globals.css` (`::-webkit-scrollbar-thumb`, 10 px, radio 8 px); 2032 px del color renderizados en los últimos 11 px de la captura.
- [x] ✅ A `900px` de ancho el layout no se superpone: aparece scroll horizontal y el contenido conserva sus medidas. — Viewport 900: `scrollWidth 1008` (scroll horizontal), `<main>` 760 px, sidebar 248 px, contenido sin reflow.
- [x] ✅ `app/` contiene solo `page.tsx`, `layout.tsx`, `globals.css` y `favicon.ico`; no hay componentes dentro de `app/`. — Listado del directorio.
- [x] ✅ `components/shared/` contiene exactamente `app-sidebar.tsx`, `brand-mark.tsx`, `avatar.tsx`, `post-kind-badge.tsx` e `icons.tsx`; `components/home/` contiene `feed-composer.tsx`, `feed-post-card.tsx` y `section-label.tsx`. No hay barrels `index.ts`. — Listados exactos; `glob components/**/index.{ts,tsx}` sin resultados.
- [x] ✅ Solo `app/page.tsx` importa valores de `@/data/feed`; los componentes solo importan tipos con `import type` (`Post`, `PostKind`, `Teacher`), y ningún archivo lleva `"use client"`. — Criterio ajustado con aprobación: el plan tipa `PostKind`/`Post` desde `data/feed.ts`, así que prohibir el `import type` contradecía los pasos 6 y 9.
- [x] ✅ Todos los identificadores (tipos, props, variables, funciones, constantes y nombres de archivo) están en inglés; los únicos textos en español son los que se ven en pantalla y los valores de contenido de `data/feed.ts`. — Búsqueda de identificadores en español en `app/`, `components/` y `data/` sin coincidencias; los textos españoles aparecen solo en strings de UI y valores de contenido.
- [x] ✅ `npx tsc --noEmit`, `npx eslint app` y `npm run build` terminan sin errores. — Los tres comandos salen con código 0; build: 4 páginas estáticas generadas.
- [x] ✅ `npm run lint` sigue fallando solo por `references/pantallas/support.js`, sin cambios en ese archivo generado. — 2 errores en `support.js` (`react/no-deprecated`, `@next/next/no-assign-module-variable`); `git status` limpio.

Evidencia en `.playwright-mcp/`: `spec01-home-1280.png`, `spec01-mockup-1280.png`, `spec01-home-prod-1280.png`, `spec01-home-900.png`, `spec01-diff-1280.png`.

## Decisiones

- **Sí:** Tailwind con valores arbitrarios exactos y tokens en `@theme inline`. Es el mecanismo que ya usa el proyecto y permite hex/px literales sin CSS paralelo.
- **No:** CSS Modules o `style={{…}}` inline. Reproducen igual, pero rompen la convención del repo y complican el mantenimiento.
- **Sí:** `components/` en la raíz del repo, importado como `@/components/...`. No participa del routing y aprovecha el alias existente.
- **Sí:** `components/{shared,home}` por pertenencia. `shared` es el shell de la app más los átomos que el mockup repite; `home` es lo que solo existe en esta pantalla.
- **No:** `components/ui/` genérico y barrels `index.ts`. Imports directos y explícitos, sin capas vacías.
- **Sí:** archivos en kebab-case y exports en PascalCase, igual que `app/page.tsx` y `app/layout.tsx`.
- **Sí:** `data/` en la raíz, en espejo de `components/`. Los componentes reciben datos por props; solo la página toca el módulo.
- **Sí:** identificadores en inglés (`PostKind`, `achievement`, `activity`, `announcement`, `teacher`, `NAV_ITEMS`) y textos de UI en español. Sigue la regla de código de `AGENTS.md`: el idioma del negocio vive en los datos y en lo que se ve, no en los nombres del código.
- **No:** `logro`/`actividad`/`anuncio` como valores del tipo. Obligarían a traducir en cada `switch` y mezclarían dominio con copy.
- **Sí:** datos estáticos con unión discriminada por `kind`. Separa contenido de presentación para enchufar datos reales más adelante.
- **No:** rutas placeholder. Se evita duplicar el shell en pantallas que todavía no tienen spec.
- **Sí:** enlaces inexistentes inertes como `<span>` con `title="Próximamente"`. No muestran cursor de mano y no producen 404.
- **Sí:** `next/font/google` para Fredoka y Nunito. Autohospeda y evita el FOUT del `<link>` del mockup.
- **Sí:** shell de `100vh` con scroll interno y `min-w-[1008px]`. Es el comportamiento del mockup en desktop y en angosto degrada a scroll horizontal en lugar de inventar un layout móvil sin diseño.
- **No:** `dvh` en vez de `vh`. El mockup usa `vh`; cambiarlo altera la altura en móvil.
- **Sí:** fecha literal del mockup. Evita diferencias por `new Date()` y mantiene la paridad visual pedida.
- **No:** dark mode. El mockup solo define el tema claro y el pedido es el estilo exacto.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| `next/font/google` descarga las fuentes en build y sin red el build falla | Si ocurre, volver al `<link>` del mockup y anotarlo como pendiente |
| Tailwind redondea o colapsa valores arbitrarios (`15.5px`, `1.55`) | Verificar con la captura del paso 11 y usar `text-[15.5px] leading-[1.55]` explícitos |
| La copia de SVG pierde `stroke-linecap`/`stroke-width` y cambia el trazo | Copiar los atributos completos y comparar los iconos en la captura |
| `min-w-[1008px]` genera scroll horizontal también en tablets | Aceptado: no hay diseño móvil aprobado; se resuelve en una spec de responsive |
| El módulo de datos crece acoplado a la pantalla | Los componentes reciben props; `data/feed.ts` solo lo consume `app/page.tsx` |

## Lo que **no** está en esta spec

- Login, sesión y permisos.
- Base de datos o cualquier persistencia.
- Las pantallas de `references/pantallas/` distintas de `feed.dc.html`.
- Likes, comentarios, edición, subida de fotos y creación de publicaciones.
- Versión móvil.
- Dark mode.
- Tests automatizados (el repo no tiene runner).

Cada uno de esos puntos, si llega, va en su propia spec.
