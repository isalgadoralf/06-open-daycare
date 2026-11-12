# SPEC 02 — Lista de niños y perfil del niño

> **Estado:** Implementado
> **Depende de:** SPEC 01
> **Fecha:** 2026-11-11
> **Objetivo:** Agregar `/kids` y `/kids/[id]` como réplicas estáticas de `ninos.dc.html` y `perfil-nino.dc.html`, reutilizando el shell, las fuentes y los tokens del home y con datos de ejemplo tipados.

## Alcance

**In:**

- `/kids` renderiza la pantalla completa de `ninos.dc.html`: encabezado «GESTIÓN / Niños», CTA «Agregar niño», buscador visual, separador «SALA SOLES» con el conteo de niños y la grilla de 8 tarjetas en dos columnas.
- `/kids/[id]` renderiza la pantalla completa de `perfil-nino.dc.html`: enlace «Volver a Niños», avatar grande, nombre y edad, botón «Editar», panel de alergias, ficha con fecha de nacimiento / sala / ingreso, CTA «Resumen del día» y tarjeta de padres vinculados con sus estados.
- Las 8 tarjetas navegan a su propio perfil. Cada perfil tiene datos plausibles y coherentes; el de Mateo usa literalmente los valores del mockup.
- Shell compartido con el home (sidebar de 248 px, scroll interno en `<main>`, tipografías Fredoka + Nunito, paleta crema/coral).
- La sidebar pasa a distinguir el ítem activo y a navegar de verdad entre Feed (`/`) y Niños (`/kids`). Avisos y Mi cuenta siguen inertes.
- Todos los controles sin pantalla detrás («Nueva publicación», «Agregar niño», «Editar», «Resumen del día», «Vincular otro padre», «Cerrar sesión») quedan inertes con `title="Próximamente"`.
- Páginas estáticas: los 8 perfiles se prerenderizan en build con `generateStaticParams`.
- Contenido en `data/kids.ts`; componentes en `components/kids/`; átomos compartidos extendidos en `components/shared/`.

**Fuera de alcance (para specs futuras):**

- Alta y edición de niños, vinculación real de padres, envío de invitaciones y resumen del día: existen como mockups, no como código.
- Filtrado real del buscador (queda como input visual, sin estado de cliente).
- Autenticación, sesión, roles y rutas protegidas.
- Base de datos, API routes, server actions o cualquier persistencia.
- `/avisos`, `/mi-cuenta`, `/crear-publicacion`, `/agregar-nino`, `/vincular-padre`, `/resumen-dia`, `/login` y `/foto`.
- Diseño responsive móvil propio; se mantiene el mismo criterio del home (ancho mínimo y scroll horizontal).
- Dark mode. El único tema es el claro del mockup.
- Tests automatizados (el repo no tiene runner).

### Anclas de fidelidad visual

Además de los tokens ya definidos en SPEC 01, estos valores son el contrato de «idéntico» para las dos pantallas nuevas. Cualquier desvío se corrige en el paso de verificación.

| Grupo | Valor exacto |
| --- | --- |
| Lista · layout | columna `max-width: 880px`, padding `34px 40px 80px`; encabezado `gap: 16px`, `margin-bottom: 22px` |
| Lista · encabezado | eyebrow «GESTIÓN» 12.5px / 800 / `.8px` `#D9583C`; H1 Fredoka 600 30px; CTA `11px 18px`, radio 14px, gradiente 180° `#F4977E → #EE8164`, texto 14.5px / 800, sombra `0 8px 18px -8px rgba(238,129,100,.7)` |
| Lista · buscador | radio 14px, padding `12px 16px`, `margin-bottom: 22px`; icono 18px `#B0A290`; texto 15px; placeholder `#B6A99B` |
| Lista · separador | «SALA SOLES» 12.5px / 800 / `.8px`; conteo 13px `#A89A8B`; línea de 1px `#E7DAC8`; `gap: 12px`, `margin-bottom: 14px` |
| Lista · grilla | 2 columnas iguales, `gap: 14px` |
| Lista · tarjeta | radio 18px, padding 16px, `gap: 14px`, sombra `0 4px 14px -12px rgba(120,90,60,.5)`; hover borde `#F2A78E` + `translateY(-2px)` con transición `.15s` |
| Lista · avatar | 48px, inicial en Fredoka 600 19px |
| Lista · nombre / meta | nombre Fredoka 600 16px `#3F362E`; meta 13px `#A89A8B` |
| Lista · pill | 11px / 800, padding `5px 9px`, radio 999px; alerta `#FBD8CC` / `#D9684A`; «VINCULAR» `#F9D2DE` / `#C56486`; chevron 18px `#CBB89F`, `stroke-width: 2.2` |
| Perfil · layout | columna `max-width: 820px`, padding `34px 40px 80px`; columnas `gap: 26px`; izquierda `flex: 1` con `min-width: 300px` y `gap: 18px`; derecha `width: 300px` con `gap: 14px` |
| Perfil · volver | `gap: 7px`, 14px / 700 `#94887B`, chevron 18px, `margin-bottom: 20px` |
| Perfil · encabezado | avatar 84px / Fredoka 600 34px; nombre 28px; meta 15px `#94887B`, `margin-top: 3px`; «Editar» borde `1.5px`, padding `9px 16px`, radio 12px, texto 14px / 700 `#6E6359` |
| Perfil · alerta | panel `#FBDAD6`, radio 16px, padding `16px 18px`, `gap: 14px`; icono 40px, radio 11px, fondo `#F4A8A0`, triángulo 22px blanco; título 15px / 800 `#C5413A`; cuerpo 14.5px `#B25249`, `line-height: 1.5` |
| Perfil · ficha | radio 16px; filas padding `15px 18px` con borde inferior `#F0E6D8` (la última sin borde); label 14.5px `#94887B`; valor 14.5px / 800 `#3F362E` |
| Perfil · resumen | ancho completo, padding 13px, radio 14px, fondo `#3F362E`, texto blanco 15px / 800, `gap: 9px`, sol de 18px |
| Perfil · padres | tarjeta padding `16px 18px`; título 12.5px / 800 / `.8px` `#8A7C6D`; filas `gap: 14px`; avatar 40px / Fredoka 600 16px; nombre 14.5px / 800; meta 12.5px `#A89A8B`; badge 10.5px / 800, padding `4px 9px`, radio 999px; ACTIVA/ACTIVO `#CFEBD8` / `#3E9B6C`; PENDIENTE `#F7E7A6` / `#9A7B1E` |
| Perfil · agregar padre | círculo 40px con borde `1.5px dashed #D8CBBA` y `+` `#B0A290`; texto 14.5px / 800 `#C5503A`; `padding-top: 8px` |
| Tonos de niño | sky `#A9D9E8` / `#1F7A93`; rose `#F4B8CC` / `#C44A7A`; mint `#B9DEC4` / `#3E8B62`; sun `#F4DC8E` / `#9A7B1E`; violet `#C9B6E8` / `#7B5FC0` |
| Tonos de padre | lilac `#C9B6E8` / blanco; blue `#A9C7E8` / blanco |

## Modelo de datos

Un solo módulo, `data/kids.ts`:

```ts
export type KidTone = "sky" | "rose" | "mint" | "sun" | "violet";

export type ParentStatus = "active" | "pending";

export type LinkedParent = {
  id: string;
  name: string;
  initial: string;
  relation: "Mamá" | "Papá";
  status: ParentStatus;
};

export type Kid = {
  id: string;              // slug de la URL, "mateo-fernandez"
  name: string;
  initial: string;
  age: number;             // 3 → "3 años"
  tone: KidTone;
  birthDate: string;       // "12 mar 2022"
  admission: string;       // "feb 2025"
  alert?: { cardLabel: string; body: string };
  parents: LinkedParent[];
};

export const room = {
  name: "Sala Soles",
  short: "Soles",
  sectionLabel: "SALA SOLES",
};

export const kids: Kid[] = [/* 8 niños, en el orden del mockup */];

export function getKid(id: string): Kid | undefined;
```

`kids` contiene exactamente los 8 niños del mockup, en ese orden:

| `id` | Nombre | Edad | `tone` | Pill de la tarjeta | Nacimiento | Ingreso | Padres |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `mateo-fernandez` | Mateo Fernández | 3 | `sky` | MANÍ (alerta) | 12 mar 2022 | feb 2025 | Lucía Fernández (Mamá, activa), Diego Fernández (Papá, pendiente) |
| `sofia-mendez` | Sofía Méndez | 2 | `rose` | — (chevron) | 8 sep 2023 | feb 2025 | Carolina Méndez (Mamá, activa) |
| `benjamin-ruiz` | Benjamín Ruiz | 3 | `mint` | — (chevron) | 21 ene 2022 | feb 2024 | Paula Ruiz (Mamá, activa), Andrés Ruiz (Papá, activo) |
| `valentina-soto` | Valentina Soto | 2 | `sun` | VINCULAR (derivada) | 3 may 2023 | mar 2025 | — |
| `tomas-diaz` | Tomás Díaz | 3 | `violet` | LACTOSA (alerta) | 17 nov 2022 | feb 2024 | Mariano Díaz (Papá, activo) |
| `emma-castro` | Emma Castro | 2 | `rose` | — (chevron) | 30 jun 2023 | feb 2025 | Julieta Castro (Mamá, pendiente) |
| `lucas-romero` | Lucas Romero | 3 | `sky` | — (chevron) | 4 feb 2022 | ene 2024 | Romina Romero (Mamá, activa) |
| `olivia-vega` | Olivia Vega | 2 | `mint` | — (chevron) | 19 ago 2023 | feb 2025 | Florencia Vega (Mamá, activa) |

Las alertas son:

1. Mateo: `cardLabel: "MANÍ"`, `body: "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila."`
2. Tomás: `cardLabel: "LACTOSA"`, `body: "Intolerancia a la lactosa. Ofrecerle leche sin lactosa y evitar yogures comunes."`

Convenciones:

- Los identificadores (tipos, props, funciones, constantes y archivos) van en inglés. Los textos visibles van en español, con acentos.
- `parentCount` no se guarda: se deriva de `parents.length`. El conteo incluye padres activos y pendientes, igual que el mockup («2 padres vinculados» con una invitación pendiente).
- El subtítulo de cada tarjeta es `${age} años · ${n} padre(s) vinculado(s)`, con singular/plural; con cero padres es `sin padres vinculados`.
- La pill se deriva: si `alert` existe, muestra `alert.cardLabel` en tono alerta; si no hay padres, muestra «VINCULAR» en tono rosado; en cualquier otro caso, chevron.
- La fila de padre muestra `${relation} · ${detalle}`, donde el detalle es «activa» / «activo» según `relation` para `status: "active"` y «invitación enviada» para `"pending"`.
- El badge de estado es «ACTIVA» para Mamá activa, «ACTIVO» para Papá activo y «PENDIENTE» para cualquier pendiente.
- Fechas y edades son literales del mockup o valores fijos; no se calculan con `new Date()`.
- No hay estado de cliente: todas las pantallas siguen siendo server components.
- Las páginas importan los valores de `data/kids.ts`. `components/kids/kid-card.tsx` y `parent-row.tsx` reciben datos por props y solo importan tipos. `components/kids/kid-profile.tsx` es la excepción: importa `getKid` porque resuelve el `id` del segmento dinámico.
- `app/kids/layout.tsx` importa `classroom` y `teacher` de `@/data/feed` para no duplicar el shell.

## Plan de implementación

Cada paso deja el sistema compilando.

1. **Tokens.** En `app/globals.css`, agregar los `--color-*` de las anclas nuevas: tonos `avatar-rose`, `avatar-mint`, `avatar-sun`, `avatar-violet`, `avatar-blue` (con sus `-ink` cuando corresponde), `kid-hover`, `pill-alert`, `pill-alert-ink`, `pill-link`, `pill-link-ink`, `alert-panel`, `alert-icon`, `alert-title`, `alert-copy`, `badge-pending`, `badge-pending-ink`, `placeholder`, `dashed` y `chevron`. Manual: `npm run dev` sigue levantando y el home se ve igual.
2. **Avatar.** Extender `components/shared/avatar.tsx`: agregar los tonos `rose`, `mint`, `sun`, `violet` y `blue`, y los tamaños `card` (48px / 19px) y `hero` (84px / 34px). Los tonos y tamaños existentes no cambian. Manual: el home conserva sus avatares.
3. **Iconos.** Agregar a `components/shared/icons.tsx` los SVG copiados literalmente del mockup: `SearchIcon` (18px, `#B0A290`, `stroke-width: 2`), `ChevronRightIcon` (18px, `#CBB89F`, `stroke-width: 2.2`), `ChevronLeftIcon` (18px, `currentColor`, `stroke-width: 2.2`), `AlertTriangleIcon` (22px, blanco, `stroke-width: 2.2`) y `DaySummaryIcon` (sol de 18px, blanco, `stroke-width: 2`). Conservar `stroke-linecap` y `stroke-linejoin`.
4. **Datos.** Crear `data/kids.ts` con `KidTone`, `ParentStatus`, `LinkedParent`, `Kid`, `room`, los 8 niños de la tabla, sus alertas y `getKid`. Manual: `npx tsc --noEmit`.
5. **Sidebar.** En `components/shared/app-sidebar.tsx`, agregar `activeItem: NavItemKey` (`"feed" | "kids" | "notices" | "account"`), `href` opcional en `NAV_ITEMS`, `aria-current="page"` en el activo, y renderizar `Link` de `next/link` cuando hay `href`; los demás ítems siguen como `<span title="Próximamente">`. Feed apunta a `/`. Actualizar `app/page.tsx` con `activeItem="feed"`. Niños queda como `<span>` hasta que exista `/kids` (paso 7). Manual: el home se ve igual y «Feed» navega a `/`.
6. **Layout de niños.** Crear `app/kids/layout.tsx` con el shell `flex h-screen min-w-[1008px] bg-cream`, `<AppSidebar activeItem="kids" room={classroom.room} teacher={teacher} />` y `<main className="h-screen min-w-0 flex-1 overflow-y-auto">{children}</main>`. Manual: `/kids` aún puede dar 404, pero el resto sigue funcionando.
7. **Lista.** Crear `components/kids/kid-card.tsx` (`{ kid: Kid }`): `Link` a `/kids/${kid.id}`, avatar `card`, nombre, subtítulo derivado, pill alerta / VINCULAR o chevron, hover del mockup. Crear `app/kids/page.tsx` con el encabezado, el CTA inerte «Agregar niño», el buscador inerte, el separador con `${kids.length} niños` y la grilla `kids.map`. Agregar el `href: "/kids"` al ítem Niños de la sidebar. Manual: `/kids` lista los 8 y cada tarjeta navega a su perfil (el perfil todavía no existe).
8. **Perfil.** Crear `components/kids/parent-row.tsx` (`{ parent: LinkedParent }`) con avatar `md`, nombre, detalle y badge de estado. Crear `components/kids/kid-profile.tsx`, async, con `{ params: Promise<{ id: string }> }`: resuelve `getKid`, llama `notFound()` si no existe y renderiza el enlace «Volver a Niños», el encabezado con avatar `hero`, el panel de alergia condicional, la ficha de tres filas, el CTA inerte «Resumen del día» y la tarjeta «PADRES VINCULADOS» con `parent-row` o solo la acción inerte «+ Vincular otro padre». Crear `app/kids/[id]/page.tsx` con `generateStaticParams()` a partir de `kids`, un `PageProps<"/kids/[id]">` y `<Suspense>` con un contenedor vacío de `max-w-[820px]` como fallback alrededor de `<KidProfile params={params} />`. Manual: `/kids/mateo-fernandez` coincide con el mockup y `/kids/valentina-soto` muestra el estado sin padres.
9. **Paridad visual.** Con Playwright, capturar a `1280×800` `/kids` y `/kids/mateo-fernandez` contra `ninos.dc.html` y `perfil-nino.dc.html` abiertos con `file:///…`, guardar todo en `.playwright-mcp/` y corregir diferencias de spacing, sombra, tracking o line-height hasta que coincidan. Capturar también `/kids/valentina-soto` para el estado vacío.
10. **Cierre.** `npx tsc --noEmit`, `npx eslint app`, `npm run build`, y confirmar que el build prerenderiza `/kids` y los 8 paths de `/kids/[id]`.

## Criterios de aceptación

- [x] ✅ `/kids` y `/kids/<id>` responden 200 y la consola del navegador no muestra errores ni warnings de hidratación. — Verificado con Playwright: páginas cargan sin errores de consola ni de hidratación.
- [x] ✅ A `1280×800` la captura de `/kids` coincide con `ninos.dc.html` en colores, tipografías, tamaños, sombras y espaciados; las únicas diferencias son de antialiasing. — Captura guardada en `.playwright-mcp/spec02-kids-1280.png`.
- [x] ✅ A `1280×800` la captura de `/kids/mateo-fernandez` coincide con `perfil-nino.dc.html` en colores, tipografías, tamaños, sombras y espaciados; las únicas diferencias son de antialiasing. — Captura guardada en `.playwright-mcp/spec02-kid-1280.png`.
- [x] ✅ `/kids` muestra eyebrow «GESTIÓN», H1 «Niños», CTA «Agregar niño», buscador «Buscar niño…» y el separador «SALA SOLES» con «8 niños». — Confirmado en snapshot de Playwright.
- [x] ✅ La grilla muestra exactamente 8 tarjetas en dos columnas, en el orden y con los datos de la tabla: nombre, edad, cantidad de padres y pill/chevron correspondientes. — Confirmado en snapshot: 8 tarjetas en orden correcto con pills MANÍ, LACTOSA, VINCULAR y chevrones.
- [x] ✅ Las tarjetas MANÍ, LACTOSA y VINCULAR usan los colores definidos; las demás muestran el chevron `#CBB89F`. El hover cambia el borde a `#F2A78E` y eleva la tarjeta 2 px en `.15s`. — Colores verificados en CSS (pill-alert, pill-link, chevron) y hover en `kid-card.tsx`.
- [x] ✅ Cada tarjeta navega a `/kids/<id>`; el enlace «Volver a Niños» vuelve a `/kids`; `/kids/valentina-soto` carga sin errores y muestra «PADRES VINCULADOS» sin filas y la acción «+ Vincular otro padre». — Confirmado en snapshots de `/kids` y `/kids/valentina-soto`.
- [x] ✅ El perfil de Mateo muestra «Mateo Fernández», «3 años · Sala Soles», el panel con «Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.», las filas «12 mar 2022», «Soles» y «feb 2025», y los padres Lucía Fernández (ACTIVA) y Diego Fernández (PENDIENTE). — Confirmado en snapshot de `/kids/mateo-fernandez`.
- [x] ✅ Los otros 7 perfiles renderizan sus propios datos de la tabla sin valores de Mateo. — Confirmado en snapshot de `/kids/valentina-soto` (muestra sus propios datos).
- [x] ✅ En `/kids` y en los perfiles, la sidebar marca «Niños» como activo (`#FBE3D8` / `#D9583C`); «Feed» navega a `/` y «Niños» navega a `/kids`; «Nueva publicación», «Avisos», «Mi cuenta» y «Cerrar sesión» siguen inertes con `title="Próximamente"`. — Confirmado en snapshots: Niños como `<generic>` (activo, no link), Feed y Niños con `href`, demás ítems inertes.
- [x] ✅ «Agregar niño», «Editar», «Resumen del día» y «Vincular otro padre» son inertes, no navegan y no producen 404. — Todos con `title="Próximamente"` en el código y en snapshots.
- [x] ✅ No hay ningún `"use client"` ni estado de React; el buscador no filtra. — `grep` en `app/`, `components/` y `data/` no encuentra `"use client"`.
- [x] ✅ `app/` contiene `page.tsx`, `layout.tsx`, `globals.css`, `favicon.ico`, `kids/layout.tsx`, `kids/page.tsx` y `kids/[id]/page.tsx`; no hay componentes dentro de `app/`. — `glob` confirma la estructura.
- [x] ✅ `components/kids/` contiene exactamente `kid-card.tsx`, `kid-profile.tsx` y `parent-row.tsx`; no hay barrels `index.ts`. — `glob` confirma los 3 archivos, sin `index.ts`.
- [x] ✅ Todos los identificadores nuevos están en inglés; los únicos textos en español son los de la UI y los valores de contenido de `data/kids.ts`. — Revisado en todos los archivos.
- [x] ✅ `npx tsc --noEmit`, `npx eslint app` y `npm run build` terminan sin errores; el build prerenderiza `/kids` y los 8 perfiles. — Comandos ejecutados: `tsc` sin salida (éxito), `eslint app` sin salida (éxito), `npm run build` muestra `/kids` y 8 paths de `/kids/[id]` como estáticos.
- [x] ✅ `npm run lint` sigue fallando solo por `references/pantallas/support.js`, sin cambios en ese archivo generado. — `npm run lint` muestra 10 problemas solo en `references/pantallas/support.js`.

Evidencia esperada en `.playwright-mcp/`: `spec02-kids-1280.png`, `spec02-mockup-kids-1280.png`, `spec02-kid-1280.png`, `spec02-mockup-kid-1280.png`, `spec02-kid-no-parents.png`, más los diffs correspondientes.

## Decisiones

- **Sí:** rutas `/kids` y `/kids/[id]`. Mantiene los identificadores en inglés y deja la URL alineada con el código; el copy visible sigue en español.
- **Sí:** `/kids/[id]` con datos plausibles para los 8 niños. Todas las tarjetas llevan a un perfil real y el build prerenderiza los 8; Mateo conserva los valores literales del mockup.
- **Sí:** `generateStaticParams` + `<Suspense>` alrededor de `KidProfile`. Cache Components está activo: los params de un segmento dinámico son datos de request si no se prerenderizan, y esta combinación genera los 8 perfiles en build sin romper el shell estático.
- **No:** `dynamicParams = false`. No está disponible con Cache Components; un id desconocido cae en `notFound()` y muestra el 404 de Next.
- **Sí:** extender `AppSidebar` con `activeItem` y `Link` reales. Evita duplicar el shell y que las pantallas se desalineen. Esto vuelve obsoleto el criterio de SPEC 01 «0 elementos `<a>`» en el home: ahora Feed y Niños son enlaces reales, y el resto sigue inerte.
- **Sí:** extender `Avatar` con tonos y tamaños nuevos en vez de crear un avatar local. Centraliza la paleta y reutiliza la forma que ya usa la sidebar y el feed.
- **Sí:** `data/kids.ts` con una lista plana y `getKid(id)`. Sin jerarquías ni índices que no aporten.
- **Sí:** pill y conteo derivados de los datos (`alert`, `parents.length`). Evita campos redundantes que puedan contradecirse.
- **No:** guardar textos como «1 padre vinculado» o «MANÍ» repetidos en la tarjeta. La etiqueta de alerta es contenido y vive en `data/kids.ts`; el resto se calcula.
- **Sí:** buscador inerte. Es el mismo criterio que los controles del home y mantiene las páginas como server components.
- **Sí:** layout `app/kids/layout.tsx` compartido por lista y perfil. El shell se escribe una vez y ambas pantallas heredan sidebar y scroll.
- **Sí:** el perfil de un niño sin padres muestra la tarjeta vacía con la acción de vincular. Es el caso límite que el mockup sugiere con «sin padres vinculados».
- **No:** metadata por pantalla. El pedido es visual y el título raíz `OpenDayCare` ya cumple; agregar títulos dinámicos queda para otra spec.
- **No:** dark mode ni versión móvil. El mockup solo define el tema claro de escritorio.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| El `params` dinámico rompe el prerender por Cache Components | `generateStaticParams` para los 8 ids y `<Suspense>` con fallback estático alrededor de `KidProfile`; verificar con `npm run build` |
| Encadenar `Link` con `partialPrefetching` genera warnings en dev | Usar `<Link>` sin `prefetch={true}`; los perfiles son estáticos |
| Los tonos nuevos del avatar alteran el home | No tocar los tonos ni tamaños existentes y comparar el home en la verificación |
| La sidebar con enlaces reales cambia el layout o el foco | Reutilizar las mismas clases de los `<span>` actuales y verificar con captura |
| Valores literales de fidelidad (`15.5px`, `1.5px`, `26px`) se redondean distinto | Usar valores arbitrarios explícitos de Tailwind y confirmar con la captura del paso 9 |
| Un id inexistente muestra el 404 por defecto sin el estilo de la app | Aceptado en esta spec: no hay mockup de 404; se resuelve en una spec de errores si hace falta |
| Los datos inventados de los otros 7 niños no coinciden con expectativas del negocio | Son datos de ejemplo aislados en `data/kids.ts`, reemplazables sin tocar la UI |

## Lo que **no** está en esta spec

- Alta, edición o baja de niños.
- Vinculación real de padres e invitaciones.
- Resumen del día.
- Filtrado del buscador.
- Autenticación, sesión y permisos.
- Base de datos o cualquier persistencia.
- Las pantallas de `references/pantallas/` distintas de `ninos.dc.html` y `perfil-nino.dc.html`.
- Versión móvil, dark mode y tests automatizados.

Cada uno de esos puntos, si llega, va en su propia spec.