# SPEC 04 — Alta de niño desde la lista

> **Estado:** Aprobado
> **Depende de:** SPEC 01, SPEC 02, SPEC 03
> **Fecha:** 2026-11-12
> **Objetivo:** Convertir «Agregar niño» de `/kids` en un pop-up que replica `agregar-nino.dc.html`, valida nombre, fecha de nacimiento y sala, y persiste el alta en localStorage para mostrarla en la lista agrupada por sala.

## Alcance

**In:**

- El CTA «Agregar niño» de `/kids` deja de ser un `<span>` inerte y pasa a ser un `<button type="button">` con las mismas clases. Al hacer clic abre un `<dialog>` modal centrado sobre un backdrop cálido; la URL no cambia.
- El pop-up replica la tarjeta de `agregar-nino.dc.html`: header con «Cancelar» / «Agregar niño» / «Guardar», y cuerpo con NOMBRE COMPLETO, FECHA DE NACIMIENTO, SALA, ALERGIAS (ETIQUETAS) y NOTAS MÉDICAS.
- Nombre, fecha de nacimiento y sala son obligatorios. La validación corre al enviar, muestra un mensaje inline debajo de cada campo inválido y enfoca el primer campo con error.
- La fecha se carga con `<input type="date">`; se rechazan fechas futuras.
- Sala es un `<select>` con tres opciones mock: Soles, Lunas y Estrellas. Arranca en «Soles», como el mockup.
- Alergias es un texto separado por comas que se convierte en etiquetas. La primera etiqueta se muestra en mayúsculas como pill de alerta en la tarjeta, con el mismo tono de MANÍ y LACTOSA.
- Notas médicas se guarda en el registro del niño; no se muestra en la lista.
- «Guardar» persiste el niño en localStorage bajo `opendaycare:kids:v1`, cierra el pop-up y agrega la tarjeta al final de la sección de su sala. Sin toast ni animación extra.
- `/kids` agrupa la lista por sala con un separador por sala («SALA SOLES», «SALA LUNAS», «SALA ESTRELLAS»), el conteo de niños y la línea divisoria del mockup. Las tres secciones se muestran siempre, incluso con cero niños.
- La tarjeta de un niño creado no es un enlace: muestra inicial, nombre, edad calculada, «N años · sin padres vinculados», pill de alerta si tiene alergias o VINCULAR si no tiene padres ni alergias.
- Los 8 niños del mockup conservan su enlace a `/kids/<id>`, sus perfiles y sus datos. `Kid` suma `roomId` y los 8 quedan en `"soles"`.
- Cancelar, Escape y clic en el backdrop cierran el pop-up. Mientras está abierto, el scroll de `<main>` queda bloqueado; al cerrar se restaura y el foco vuelve al CTA.
- Contenido y tipos nuevos en `data/kids.ts`; componentes nuevos en `components/kids/`. `app/kids/page.tsx` queda como server component delgado.
- El buscador sigue inerte: escribir no filtra la lista.

**Fuera de alcance (para specs futuras):**

- Edición y baja de niños.
- Perfil de los niños creados: su tarjeta no navega a `/kids/<id>`.
- Backend, API routes, server actions o base de datos. La persistencia es solo localStorage del navegador.
- Gestión real de salas: las tres salas son datos mock fijos.
- Filtrado real del buscador.
- Vinculación de padres, invitaciones, avisos y resumen del día.
- Sincronización entre navegadores, usuarios o dispositivos.
- Diseño responsive móvil propio, dark mode y tests automatizados.

### Anclas de fidelidad visual

Además de los tokens de SPEC 01, estos valores son el contrato de «idéntico». El pop-up es la tarjeta del mockup llevada a un diálogo modal; la única diferencia deliberada es el backdrop.

| Grupo | Valor exacto |
| --- | --- |
| Pop-up · backdrop | `rgba(63,54,46,.45)` sobre toda la ventana |
| Pop-up · tarjeta | ancho `min(520px, calc(100vw - 48px))`; fondo `#FBF4EC`; borde `1px #ECE0D0`; radio 24px; sombra `0 20px 50px -24px rgba(63,54,46,.35)`; `max-height: calc(100vh - 64px)` con scroll interno del cuerpo |
| Pop-up · header | padding `20px 26px`; borde inferior `1px #ECE0D0`; «Cancelar» 15px / 700 `#94887B`; título Fredoka 600 18px `#3F362E`; «Guardar» 15px / 800 `#D9583C` |
| Pop-up · cuerpo | padding `24px 26px` |
| Pop-up · labels | 12px / 800 / `.7px` `#94887B`, `margin-bottom: 8px` |
| Pop-up · inputs | padding `13px 16px`; radio 14px; borde `1.5px #EADFD0`; fondo blanco; texto 15px `#3F362E`; placeholder `#B6A99B` |
| Pop-up · fila fecha/sala | dos columnas iguales, `gap: 14px`, `margin-bottom: 18px` |
| Pop-up · select | misma caja que los inputs, `appearance-none`, texto 15px / 700, chevron 16px `#B0A290` a la derecha |
| Pop-up · textarea | `min-height: 90px`, `resize: vertical`, `line-height: 1.5` |
| Pop-up · error | 12.5px / 700 `#D9583C`, `margin-top: 6px`; el campo inválido usa borde `1.5px #D9583C` |
| Lista · sección | igual a SPEC 02: label 12.5px / 800 / `.8px` `#3F362E`; conteo 13px `#A89A8B`; línea `1px #E7DAC8`; `gap: 12px`, `margin-bottom: 14px`; `margin-top: 22px` entre secciones |
| Lista · pill creada | mismos colores de `pill-alert` / `pill-link`; `max-width: 132px` con truncado por ellipsis para etiquetas largas |

## Modelo de datos

Todo vive en `data/kids.ts`. No se crea un módulo nuevo de datos.

```ts
export type RoomId = "soles" | "lunas" | "estrellas";

export type Room = {
  id: RoomId;
  name: string;          // "Sala Soles"
  short: string;         // "Soles"
  sectionLabel: string;  // "SALA SOLES"
};

export const rooms: Room[] = [/* soles, lunas, estrellas, en ese orden */];
export const room = rooms[0]; // compatibilidad con el perfil de SPEC 02

export type Kid = {
  // campos actuales de SPEC 02
  roomId: RoomId;
};

// Niño creado desde el pop-up, tal como se guarda en localStorage
export type CreatedKid = {
  id: string;            // slug del nombre, único contra demo + creados
  name: string;
  birthDate: string;     // "yyyy-mm-dd", valor del input
  roomId: RoomId;
  allergies: string[];   // etiquetas ya normalizadas
  medicalNotes: string;  // puede ser ""
  createdAt: string;     // ISO, congela el ingreso
};

export const kidsStorageKey = "opendaycare:kids:v1";

export function parseAllergyTags(value: string): string[];
export function buildKidId(name: string, existingIds: string[]): string;
export function createdKidToKid(kid: CreatedKid, position: number): Kid;
export function calculateAge(birthDate: string): number;
export function formatBirthDate(birthDate: string): string;
export function formatAdmission(createdAt: string): string;
export function isCreatedKid(value: unknown): value is CreatedKid;
```

Contenido de `rooms`:

| `id` | `name` | `short` | `sectionLabel` |
| --- | --- | --- | --- |
| `soles` | Sala Soles | Soles | SALA SOLES |
| `lunas` | Sala Lunas | Lunas | SALA LUNAS |
| `estrellas` | Sala Estrellas | Estrellas | SALA ESTRELLAS |

Convenciones:

- Los identificadores (tipos, props, funciones, constantes, archivos) van en inglés. Los textos visibles van en español, con acentos.
- `room` se mantiene exportado y apunta a `rooms[0]`. El perfil de SPEC 02 sigue usándolo; los 8 niños demo son de Soles, así que no cambia ninguna pantalla existente.
- `Kid` suma `roomId` obligatorio y los 8 niños del mockup lo reciben con `"soles"`.
- `birthDate` de `CreatedKid` se guarda en ISO (`yyyy-mm-dd`). La fecha visible se arma con `formatBirthDate`, usando una tabla fija `["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]` y sin ceros a la izquierda: `"3 may 2023"`.
- `calculateAge` usa años cumplidos y fechas locales (`new Date(year, month - 1, day)`), nunca `new Date("yyyy-mm-dd")` para evitar corrimientos de zona horaria.
- `formatAdmission(createdAt)` devuelve mes y año en español a partir de `createdAt`, por ejemplo `"nov 2026"`. Se deriva de `createdAt` y no de la fecha actual, para que no cambie al recargar en otro mes.
- `parseAllergyTags` separa por comas, recorta espacios, descarta vacíos y elimina duplicados sin distinguir mayúsculas.
- `buildKidId` normaliza el nombre (minúsculas, sin diacríticos, no alfanumérico a `-`), recorta guiones sobrantes y usa `nino` si queda vacío. Si el slug ya existe, agrega `-2`, `-3`, etc.
- `createdKidToKid` deriva la vista de tarjeta: inicial de la primera letra en mayúscula, edad con `calculateAge`, `birthDate` visible, `admission` con `formatAdmission`, `parents: []` y, si hay alergias, `alert: { cardLabel: allergies[0].toLocaleUpperCase("es-AR"), body: medicalNotes }`.
- El tono del niño creado se asigna ciclando `["sky", "rose", "mint", "sun", "violet"]` según su posición entre los creados (`position % 5`). Es estable entre recargas.
- `isCreatedKid` valida la forma mínima: `id` y `name` string no vacíos, `birthDate` con formato `yyyy-mm-dd`, `roomId` presente en `rooms`, `allergies` array de strings no vacíos, `medicalNotes` string y `createdAt` fecha parseable. Una entrada inválida se descarta al leer.
- El subtítulo de la tarjeta creada es `N años · sin padres vinculados`, con singular `1 año`.
- La pill de la tarjeta creada sigue el criterio de SPEC 02: alerta si hay alergias; si no, VINCULAR porque no tiene padres. La alerta gana sobre VINCULAR.
- La lista se ordena por `rooms`; dentro de cada sala van primero los 8 demo en su orden y después los creados en orden de creación.
- `KidsDirectory` pasa `href={`/kids/${kid.id}`}` solo a los niños demo. `KidCard` acepta `href?: string` y renderiza `<Link>` o un `<div>` con las mismas clases base, sin hover ni `cursor-pointer` cuando no hay enlace.
- El conteo de cada sección usa `${n} niños`, con `1 niño` en singular.
- localStorage se lee en `useEffect`, nunca durante el render: el primer render muestra solo los 8 demo y los creados aparecen después de montar. Esto evita mismatches de hidratación.
- La escritura va en `try/catch`. Si localStorage está bloqueado o lleno, el niño se agrega igual al estado en memoria y el pop-up se cierra; solo se pierde al recargar.

## Plan de implementación

Cada paso deja el sistema compilando y navegable.

1. **Icono.** Agregar `ChevronDownIcon` a `components/shared/icons.tsx` (16px, `path d="m6 9 6 6 6-6"`, `stroke="#B0A290"`, `stroke-width: 2.2`, `stroke-linecap/linejoin: round`). No se agregan tokens nuevos: se reutilizan `field-border`, `coral-strong`, `placeholder`, `pill-alert` y `pill-link`. Manual: `npx tsc --noEmit`.

2. **Salas.** En `data/kids.ts`, agregar `RoomId`, `Room`, `rooms` y mantener `room = rooms[0]`. Agregar `roomId: RoomId` a `Kid` y `roomId: "soles"` a los 8 niños. Manual: `/kids` y los perfiles se ven igual que antes.

3. **Tipos y helpers.** En `data/kids.ts`, agregar `CreatedKid`, `kidsStorageKey`, `parseAllergyTags`, `buildKidId`, `calculateAge`, `formatBirthDate`, `formatAdmission`, `createdKidToKid` e `isCreatedKid`. Manual: `npx tsc --noEmit`.

4. **Tarjeta.** En `components/kids/kid-card.tsx`, cambiar la prop a `{ kid: Kid; href?: string }`. Si hay `href`, renderizar `<Link>` con el hover actual; si no, un `<div>` con las clases base sin hover. Agregar `max-w-[132px] truncate` a la pill. Manual: `/kids` mantiene los 8 enlaces y los perfiles siguen funcionando.

5. **Pop-up.** Crear `components/kids/add-kid-dialog.tsx` (`"use client"`):
   - Props `{ open, onClose, onCreate, existingIds }`.
   - `<dialog ref>` con `aria-labelledby`, backdrop cálido y tarjeta de 520px; efecto que llama `showModal()` / `close()` y sincroniza `onClose` con el evento `close`.
   - `<form>` que envuelve header y cuerpo; «Cancelar» es `type="button"`, «Guardar» es `type="submit"`.
   - Campos controlados: nombre, fecha, sala (default `"soles"`), alergias y notas.
   - Validación al enviar con mensajes inline, `aria-invalid`, `aria-describedby`, foco al primer inválido y limpieza del error del campo al editarlo.
   - Clic en backdrop (`event.target === event.currentTarget`) cierra. Mientras `open`, guarda y bloquea el `overflow` de `dialog.closest("main")`, y lo restaura al cerrar.
   - Al guardar, construye el `CreatedKid` con `buildKidId`, `parseAllergyTags`, `createdAt: new Date().toISOString()`, limpia el formulario y llama `onCreate`.
   Manual: el diálogo abre y valida; todavía no está conectado a la página.

6. **Lista cliente.** Crear `components/kids/kids-directory.tsx` (`"use client"`) con props `{ demoKids: Kid[]; rooms: Room[] }`:
   - Estado `createdKids` y `isDialogOpen`; lectura de localStorage en `useEffect` con `try/catch` e `isCreatedKid`.
   - Header «GESTIÓN / Niños» y CTA `<button>` que abre el diálogo.
   - Buscador inerte con el mismo markup de SPEC 02.
   - Secciones para las tres salas, siempre visibles, con conteo y grilla de tarjetas; los creados se mapean con `createdKidToKid` y sin `href`.
   - `handleCreate`: agrega al estado, persiste `[...createdKids, kid]` con `try/catch` y cierra el diálogo.
   - Renderiza `<AddKidDialog existingIds={[...demoIds, ...createdIds]} />`.
   Manual: crear un niño en Soles, Lunas y Estrellas; la tarjeta aparece en su sección y sobrevive al reload.

7. **Página.** Reducir `app/kids/page.tsx` a un server component que importa `kids` y `rooms` y renderiza `<KidsDirectory demoKids={kids} rooms={rooms} />`. Manual: `/kids` sigue siendo estática y el resto de la app no cambia.

8. **Paridad visual.** Con Playwright a `1280×800`, capturar `/kids` con el pop-up abierto contra `agregar-nino.dc.html` abierto con `file:///…`, y la lista después de crear un niño en Lunas. Guardar todo en `.playwright-mcp/` y corregir diferencias de spacing, sombra, tracking o line-height. Verificar también el estado de error y el pop-up cerrado con el foco de vuelta en el CTA.

9. **Cierre.** `npx tsc --noEmit`, `npx eslint app` y `npm run build`; confirmar que `/kids` sigue prerenderizada como estática y que los 8 perfiles se generan igual.

## Criterios de aceptación

- [x] ✅ `/kids` responde 200 y la consola no muestra errores ni warnings de hidratación. — Re-verificado 2026-11-13: `/kids` → 200; consola de toda la sesión (abrir, validar, guardar, recargar y navegar los 8 perfiles): 0 errores y 0 warnings, solo mensajes INFO/LOG de React DevTools y HMR. Sin warnings de hidratación.
- [x] ✅ «Agregar niño» es un `<button>` que abre el pop-up sin cambiar la URL; el pop-up muestra «Cancelar», «Agregar niño» y «Guardar». — Re-verificado 2026-11-13: clic en `getByRole("button", { name: "Agregar niño" })` abre `dialog[open]` con URL fija en `/kids`; el header contiene los tres textos («Cancelar» 15px/700 `#94887B`, título Fredoka 600 18px `#3F362E`, «Guardar» 15px/800 `#D9583C`).
- [x] ✅ A `1280×800`, la tarjeta del pop-up coincide con `agregar-nino.dc.html` en colores, tipografías, tamaños y espaciados, salvo el backdrop; evidencia en `.playwright-mcp/`. — Re-verificado 2026-11-13 con comparación programática elemento a elemento (este modelo no procesa imágenes): app y mockup miden lo mismo — tarjeta 520×503, fondo `rgb(251,244,236)`, radio 24px, borde `rgb(236,224,208)`, sombra `rgba(63,54,46,.35) 0 20px 50px -24px`, backdrop `rgba(63,54,46,0.45)`; header `20px 26px` con borde inferior `#ECE0D0`, cuerpo `24px 26px`, labels 12px/800/.7px `#94887B` con `margin-bottom: 8px`, inputs `13px 16px` radio 14 fondo blanco 15px `#3F362E` (CSS generado: `border-width: 1.5px` `#EADFD0`), fila fecha/sala `flex` `gap: 14px` `margin-bottom: 18px`, select 15px/700 con chevron 16px `#B0A290` `stroke-width: 2.2`, textarea `min-height: 90px`/`resize: vertical`/`line-height: 22.5px`; mismas posiciones relativas: nombre y=112, fila fecha/sala y=178, alergias y=292, notas y=382. Evidencia: `.playwright-mcp/spec04-dialog-1280.png`, `spec04-dialog-card.png`, `spec04-mockup-add-kid-1280.png`, `spec04-mockup-card.png`.
- [x] ✅ El formulario muestra NOMBRE COMPLETO, FECHA DE NACIMIENTO (`type="date"`), SALA (`<select>` con Soles, Lunas y Estrellas; Soles seleccionada), ALERGIAS (ETIQUETAS) y NOTAS MÉDICAS. — Re-verificado 2026-11-13: snapshot del diálogo con los cinco labels; `input[type=date]` confirmado por DOM; `select` con valores `soles`/`lunas`/`estrellas` y valor inicial `soles`.
- [x] ✅ Enviar con nombre y fecha vacíos muestra un error inline debajo de cada uno, no guarda nada y enfoca el campo nombre. — Re-verificado 2026-11-13: alertas `["Ingresá el nombre completo.", "Ingresá la fecha de nacimiento."]`, `aria-invalid="true"` en ambos, `aria-describedby` presente, foco en `placeholder="Ej. Martina López"`, `localStorage` sigue en `null`; error 12.5px/700 `#D9583C` con `margin-top: 6px` y campo inválido con borde `#D9583C`; el error del nombre se limpia al editar. Evidencia: `.playwright-mcp/spec04-validation-1280.png`.
- [x] ✅ Una fecha posterior a hoy muestra «La fecha no puede ser futura.» y no guarda. — Re-verificado 2026-11-13: fecha `2030-01-01` → alerta exacta «La fecha no puede ser futura.», foco en `input[type=date]`, `aria-invalid="true"`, diálogo abierto y `localStorage` sin cambios.
- [x] ✅ Un alta válida escribe en localStorage bajo `opendaycare:kids:v1` un objeto con `id`, `name`, `birthDate` ISO, `roomId`, `allergies` como array, `medicalNotes` y `createdAt`; el pop-up se cierra. — Re-verificado 2026-11-13: valor guardado `{"id":"martina-lopez","name":"Martina López","birthDate":"2023-04-15","roomId":"lunas","allergies":["Maní","Lactosa"],"medicalNotes":"Lleva inhalador en la mochila.","createdAt":"2026-11-13T14:55:32.419Z"}`; `dialog.open === false` y formulario limpio tras guardar.
- [x] ✅ La tarjeta nueva aparece al final de su sala, el conteo de esa sección sube y la tarjeta sigue ahí después de recargar. — Re-verificado 2026-11-13: «SALA LUNAS · 1 niño» con Martina como única tarjeta de Lunas después de los 8 de Soles; tras `reload()` sigue presente con el mismo conteo. Evidencia: `.playwright-mcp/spec04-list-after-create-1280.png`.
- [x] ✅ Crear un niño en Lunas muestra «SALA LUNAS» con su conteo; las tres secciones se ven siempre, incluso con «0 niños». — Re-verificado 2026-11-13: lista con SALA SOLES 8, SALA LUNAS 1 y SALA ESTRELLAS 0 sin crear nada en Estrellas; con más altas muestra SALA SOLES 9 / SALA ESTRELLAS 1 y «1 niño» en singular. Evidencia: `.playwright-mcp/spec04-rooms-1280.png`.
- [ ] ❌ La tarjeta creada no es un enlace, muestra la inicial, la edad calculada, «N años · sin padres vinculados», el ingreso del mes de creación y la pill con la primera alergia en mayúsculas, o VINCULAR si no hay alergias. — Re-verificado 2026-11-13: pasa todo salvo el ingreso. Tarjeta `DIV` sin `<a>` ni `href`, `cursor: auto`; «M», «3 años · sin padres vinculados» (edad calculada de `2023-04-15`), pill «MANÍ» (primera alergia en mayúsculas); sin alergias cae en VINCULAR (Julieta Ramos, mismo criterio que Valentina); tonos ciclando por posición (sky/rose/mint). **Sigue fallando la parte del ingreso:** `createdKidToKid` deriva `admission` de `createdAt` (`nov 2026`) pero `KidCard` no lo renderiza, y el mockup `ninos.dc.html` tampoco muestra ingreso en la tarjeta. El criterio contradice el Alcance («muestra inicial, nombre, edad calculada, subtítulo, pill») y las anclas visuales. Pendiente de decisión de la persona: corregir la redacción del criterio o agregar el ingreso a la tarjeta (rompería la paridad visual).
- [x] ✅ Una etiqueta de alergia larga se trunca con ellipsis y no rompe el layout de la tarjeta. — Re-verificado 2026-11-13: pill con `max-width: 132px`, `scrollWidth 414 > clientWidth 132`, `text-overflow: ellipsis`, `white-space: nowrap`; tarjeta de 393px sin desborde (`overflow-x: visible`). Evidencia: `.playwright-mcp/spec04-long-tag-1280.png`.
- [x] ✅ Cancelar, Escape y clic en el backdrop cierran el pop-up; el foco vuelve al CTA y el scroll de `<main>` queda restaurado. — Re-verificado 2026-11-13: Escape y clic en backdrop (80,720) dejan `dialog.open === false`; `document.activeElement` es el CTA «Agregar niño» en Escape, backdrop y Cancelar; `main.style.overflow === "hidden"` con el pop-up abierto y `""` tras cada cierre.
- [x] ✅ Los 8 niños demo siguen navegando a sus perfiles y los perfiles no cambian. — Re-verificado 2026-11-13: los 8 perfiles responden 200 con su heading correcto (`mateo-fernandez` … `olivia-vega`); el build lista `○ /kids/[id]` con los 8 paths; `KidCard` recibe `href` solo para los demo (`components/kids/kids-directory.tsx`).
- [x] ✅ Escribir en el buscador no filtra la lista. — Re-verificado 2026-11-13: al tipear «Martina» y «zzzz» la lista no cambia (mismas grillas y 8 enlaces demo) y el input conserva el valor; el valor no se usa en el render.
- [x] ✅ `components/kids/` contiene `kid-card.tsx`, `kid-profile.tsx`, `parent-row.tsx`, `kids-directory.tsx` y `add-kid-dialog.tsx`, sin barrels `index.ts`. — Re-verificado 2026-11-13: `glob components/kids/*` devuelve exactamente esos cinco archivos; `components/kids/index.ts` no existe.
- [x] ✅ Solo `components/kids/kids-directory.tsx` y `components/kids/add-kid-dialog.tsx` agregan `"use client"`; ningún archivo existente lo agrega. — Re-verificado 2026-11-13: grep de `"use client"` en `*.ts(x)`: `kids-directory.tsx`, `add-kid-dialog.tsx` y el preexistente `components/auth/login-form.tsx` (SPEC 01/03, sin cambios en esta spec).
- [x] ✅ Todos los identificadores nuevos están en inglés; los únicos textos en español son los de la UI y los valores de `data/kids.ts`. — Re-verificado 2026-11-13: `RoomId`, `rooms`, `CreatedKid`, `kidsStorageKey`, `parseAllergyTags`, `buildKidId`, `calculateAge`, `formatBirthDate`, `formatAdmission`, `createdKidToKid`, `isCreatedKid`, `AddKidDialog`, `KidsDirectory`; textos visibles en español con acentos.
- [x] ✅ `npx tsc --noEmit`, `npx eslint app` y `npm run build` terminan sin errores; `/kids` sigue prerenderizada como estática. — Re-verificado 2026-11-13: los tres comandos con exit 0 (tsc requiere que `npm run build` o `next dev` hayan generado `.next/types`; en un checkout limpio correr tsc antes del build falla solo por `PageProps`/`LayoutProps`); el build marca `○ /kids` (estática) y `◐ /kids/[id]` con los 8 perfiles. `npx eslint app components data` también exit 0.
- [x] ✅ `npm run lint` sigue fallando solo por `references/pantallas/support.js`, sin cambios en ese archivo generado. — Re-verificado 2026-11-13: `npm run lint` exit 1 con 2 errores y 8 warnings, todos en `support.js`; `git diff` del archivo vacío y `app`, `components` y `data` limpios con `npx eslint`.

Evidencia esperada en `.playwright-mcp/`: `spec04-dialog-1280.png`, `spec04-mockup-add-kid-1280.png`, `spec04-validation-1280.png`, `spec04-list-after-create-1280.png`, `spec04-rooms-1280.png`. Re-verificación 2026-11-13 agrega `spec04-dialog-card.png` y `spec04-mockup-card.png` (comparación de tarjeta a tarjeta) y `spec04-long-tag-1280.png`.

> **Re-verificación `spec-check` (2026-11-12):** `npx tsc --noEmit` y `npx eslint app components data` con exit 0; `npm run build` con exit 0 (`○ /kids` estática y los 8 perfiles); `npm run lint` con exit 1 solo por `references/pantallas/support.js` (2 errores, 8 warnings). Capturas nuevas: `.playwright-mcp/spec04-check-dialog-1280.png`, `spec04-check-validation-1280.png`, `spec04-check-after-create-1280.png`, `spec04-check-rooms-1280.png`. Medido en el pop-up: 520px, `rgb(251,244,236)`, radio 24px, backdrop `rgba(63,54,46,0.45)`, header `20px 26px`, cuerpo `24px 26px`, labels 12px/800/.7px, inputs `13px 16px` radio 14px, textarea `min-height: 90px`/`resize: vertical`/`line-height: 1.5`. Escape y backdrop restauran el scroll de `<main>` y devuelven el foco al CTA tras el ciclo de React.

> **Re-verificación `spec-check` (2026-11-13, issue #7):** 18/19 criterios ✅, 1 ❌ pendiente de decisión (ingreso en la tarjeta, contradicción con el Alcance y el mockup). Comandos: `npm ci` + `npx tsc --noEmit` exit 0 (tras `npm run build` exit 0 que genera `.next/types`), `npx eslint app components data` exit 0, `npm run lint` exit 1 solo por `support.js`. Comparación programática app vs mockup a 1280×800: tarjeta idéntica 520×503 con cada campo en la misma posición relativa (nombre y=112, fila fecha/sala y=178, alergias y=292, notas y=382), mismos colores, tipografías y espaciados; backdrop `rgba(63,54,46,0.45)`. Alta válida, validación vacía, fecha futura, truncado de alergia larga, VINCULAR sin alergias, tonos sky/rose/mint por posición, Escape/backdrop/Cancelar con foco al CTA y scroll restaurado, 8 perfiles en 200 y buscador inerte: todo verificado con consola limpia. Nota: el modelo de esta corrida no procesa imágenes, por eso la paridad visual se acreditó midiendo estilos computados y bounding boxes de ambos lados en vez de comparar PNGs a ojo.

## Decisiones

- **Sí:** localStorage bajo `opendaycare:kids:v1`. Es el mismo patrón de SPEC 03, sobrevive al reload y no toca el prerender estático.
- **No:** estado de React únicamente. La tarjeta desaparecería al recargar y el alta se sentiría falsa.
- **No:** backend, API routes o server actions. El repo es una maqueta estática y no hay base de datos.
- **Sí:** tarjeta creada sin enlace. Evita un 404 y deja el perfil de niños nuevos para otra spec.
- **Sí:** `<input type="date">`. Da validación real y evita parsear `dd/mm/aaaa` a mano; el formato visible depende del locale del navegador.
- **Sí:** tres salas mock (Soles, Lunas, Estrellas) y lista agrupada. Es coherente con elegir sala y no requiere backend.
- **Sí:** las tres secciones se muestran siempre, con «0 niños» cuando corresponde. Hace visible que existen las tres salas y evita que la lista cambie de forma sin explicación.
- **Sí:** Soles preseleccionada. Es el valor del mockup y la sala real de la app; la obligatoriedad queda como guarda del modelo.
- **Sí:** validación al enviar con errores inline. «Guardar» siempre activo; el usuario entiende qué falta en vez de adivinar por un botón gris.
- **Sí:** rechazar fechas futuras. Un alta de guardería no puede tener nacimiento futuro.
- **Sí:** `<dialog>` nativo. Trae foco atrapado, Escape y top layer sin dependencias; el cierre por backdrop se resuelve comparando `event.target` con el diálogo.
- **Sí:** bloquear el scroll de `<main>` mientras el pop-up está abierto. El layout scrollea en `<main>`, no en `<body>`; se guarda y restaura el `overflow` con `dialog.closest("main")`.
- **No:** toast de confirmación. La tarjeta nueva en su sección es feedback suficiente y el mockup no define un aviso.
- **Sí:** alergias como tags separados por comas y primera etiqueta como pill. Reutiliza el campo de alerta de SPEC 02 sin inventar UI nueva.
- **Sí:** la alerta gana sobre VINCULAR. Es el criterio que ya usan Mateo y Tomás.
- **Sí:** derivar edad, ingreso, tono e inicial del formulario. Mantiene el alta en los cinco campos del mockup y genera datos creíbles.
- **Sí:** guardar `createdAt` y derivar el ingreso de ahí. Si se derivara de la fecha actual, el ingreso cambiaría solo con el paso de los meses.
- **Sí:** tono por posición entre los creados. Es estable, reparte la paleta y no requiere que el docente elija un color.
- **Sí:** leer localStorage en `useEffect`. Evita el mismatch de hidratación que produciría leerlo durante el render.
- **Sí:** descartar entradas inválidas al leer. Un storage corrupto no debe romper la lista.
- **Sí:** `KidCard` con `href` opcional. Los demo conservan navegación y los creados se muestran con la misma tarjeta sin ser clickeables.
- **Sí:** mantener `room` exportado. El perfil de SPEC 02 lo usa y los 8 niños son de Soles; cambiarlo sería ruido innecesario.
- **No:** filtrado del buscador. La lista pasa a ser client, pero filtrar es otra funcionalidad y otra spec.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Mismatch de hidratación por leer localStorage en render | Estado inicial vacío y lectura en `useEffect`; el primer render coincide con el HTML del servidor |
| localStorage bloqueado, lleno o corrupto | `try/catch` en lectura y escritura, `isCreatedKid` descarta entradas inválidas y el alta sigue en memoria |
| `type="date"` muestra otro formato según el locale | Se guarda siempre ISO y la fecha visible se formatea con una tabla fija en español |
| El bloqueo de scroll depende de que el diálogo esté dentro de `<main>` | `dialog.closest("main")` con fallback silencioso si no existe; el diálogo funciona igual sin bloqueo |
| El foco no vuelve al CTA después de cerrar | Se usa `<dialog>` nativo, que restaura el foco al elemento que lo abrió; se verifica con Playwright |
| Etiquetas de alergia largas rompen la tarjeta | Pill con `max-width: 132px` y truncado por ellipsis |
| Los niños creados no tienen perfil y el usuario espera abrirlos | Tarjeta sin hover ni cursor de enlace; queda documentado como fuera de alcance |
| Los datos solo viven en el navegador | Es una maqueta sin backend; se documenta y se limpia borrando la clave `opendaycare:kids:v1` |
| La edad calculada cambia con el tiempo | Es el comportamiento esperado; los demo conservan la edad literal de SPEC 02 |
| El pop-up agrega altura y desborda en pantallas bajas | `max-height: calc(100vh - 64px)` y scroll interno del cuerpo |

## Lo que **no** está en esta spec

- Edición y baja de niños.
- Perfil de los niños creados.
- Backend, base de datos, API routes o server actions.
- Gestión real de salas y alta de salas nuevas.
- Filtrado del buscador.
- Vinculación de padres e invitaciones.
- Avisos, resumen del día y vistas de familia.
- Sincronización entre navegadores, usuarios o dispositivos.
- Versión móvil, dark mode y tests automatizados.

Cada uno de esos puntos, si llega, va en su propia spec.
