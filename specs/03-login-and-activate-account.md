# SPEC 03 — Login y activación de cuenta

> **Estado:** Aprobado
> **Depende de:** SPEC 01, SPEC 02
> **Fecha:** 2026-11-12
> **Objetivo:** Agregar `/login` y `/activate-account` como réplicas de `login.dc.html` (sin el bloque «INGRESO COMO», por decisión del usuario) y `activar-cuenta.dc.html`, con una auth simulada que guarda el email en localStorage y «Cerrar sesión» como enlace al login.

## Alcance

**In:**

- `/login` renderiza el mockup `login.dc.html` **sin** el bloque «INGRESO COMO: Personal / Familia» ni sus dos botones (desviación deliberada, confirmada). El formulario queda: título «Iniciar sesión», subtítulo «Ingresá para ver el día de hoy.», EMAIL, CONTRASEÑA, «¿Olvidaste tu contraseña?» inerte, botón «Iniciar sesión» y footer «¿Te invitó la guardería? Activá tu cuenta».
- Layout split a pantalla completa (sin sidebar): panel izquierdo con gradiente coral, marca, headline y footer «🌿 Guardería Sala Soles»; columna derecha centrada con el formulario de `max-width: 392px`.
- `/activate-account` renderiza la réplica estática de `activar-cuenta.dc.html`: badge degradado con sol, «Bienvenida a OpenDayCare», tarjeta «Te invitaron a seguir a / Mateo · Sala Soles», código `7K4P9`, email de Lucía, campo de contraseña, checkbox de consentimiento marcado (visual, no interactivo) y botón «Activar mi cuenta» inerte.
- Auth simulada: al enviar el formulario del login se guarda `{ email }` en localStorage bajo una clave versionada y se navega a `/`. Sin backend, sin validación, sin sesión real.
- El botón «Cerrar sesión» de la sidebar pasa de inerte a `<Link href="/login">` con las mismas clases. Es el único cambio en pantallas existentes.
- Cross-links: «Activá tu cuenta» (login) → `/activate-account`; «Iniciar sesión» (footer de activar) → `/login`.
- Contenido en `data/auth.ts`; componentes en `components/auth/`; primer componente `"use client"` del repo, contenido en `login-form.tsx`.

**Fuera de alcance (para specs futuras):**

- Autenticación real: validación de credenciales, cookies de sesión, rutas protegidas, logout real.
- El toggle Personal/Familia y los emails precargados por rol del mockup (`caro@…` / `lucia@…` ligados al rol).
- Las vistas de familia (`familia-feed`, `detalle-publicacion`, `resumen-dia`, `familia-cuenta`): ninguna pantalla reacciona al estado guardado en esta spec.
- Recuperación de contraseña (la pantalla no existe como mockup).
- Activación real de cuentas: el botón «Activar mi cuenta» queda inerte.
- Otras pantallas de `references/pantallas/` no incluidas arriba.
- Diseño responsive móvil propio, dark mode, tests automatizados.

### Anclas de fidelidad visual

Además de los tokens de SPEC 01, estos valores son el contrato de «idéntico». El fondo de ambas pantallas es `#FBF4EC` (no el `#F6ECDF` del feed).

| Grupo | Valor exacto |
| --- | --- |
| Login · layout | grid `min-height: 100vh`, columnas `1.05fr 1fr`, fondo `#FBF4EC`, `min-w-[960px]` con scroll horizontal por debajo |
| Login · panel | gradiente `155deg #F6A98E 0%, #F2937A 45%, #EC7E62 100%`, padding `56px 60px`, `justify-content: space-between`, texto blanco |
| Login · círculos | 420px `rgba(255,255,255,.12)` en `top:-140px right:-120px`; 300px `rgba(255,255,255,.10)` en `bottom:-110px left:-80px` |
| Login · marca | caja 46px radio 14px fondo `rgba(255,255,255,.22)` con sol 26px (`stroke-width: 2.2`); «OpenDayCare» Fredoka 600 21px / `.5px` |
| Login · headline | H1 Fredoka 600 42px / 1.12 con salto literal «El día de cada niño,<br>compartido con su familia.»; párrafo 17px / 1.6 `rgba(255,255,255,.92)` `max-width: 430px` |
| Login · footer panel | 14px `rgba(255,255,255,.9)`: «🌿 Guardería Sala Soles» |
| Login · formulario | columna `max-width: 392px` centrada con padding `40px`; H2 Fredoka 600 30px; subtítulo 15px `#94887B` con `margin-bottom: 28px` |
| Campos | label 12px / 700 / `.7px` `#94887B`; input padding `14px 16px`, radio 14px, borde `1.5px #EADFD0`, fondo blanco, texto 15px, placeholder `#B6A99B` |
| Login · olvido | alineado a la derecha, 13.5px / 700 `#C5503A`, `margin-bottom: 20px` |
| Botón primario | padding 15px, radio 15px, gradiente `180deg #F4977E → #EE8164`, blanco 800 16px, sombra `0 10px 22px -8px rgba(238,129,100,.7)` |
| Login · footer | 14.5px `#94887B`, `margin-top: 24px`; link `#C5503A` 800 |
| Activar · layout | centrado, padding `40px`, columna `max-width: 440px`, fondo `#FBF4EC` |
| Activar · badge | 58px, radio 18px, gradiente `155deg #F8C3A8 → #F2937A`, sol 30px blanco, sombra `0 12px 26px -10px rgba(238,129,100,.65)`, `margin-bottom: 22px` |
| Activar · textos | H1 Fredoka 600 32px / 1.15; párrafo 15.5px / 1.55 `#94887B` |
| Activar · tarjeta invitación | fondo blanco, borde `1.5px #EADFD0`, radio 16px, padding `14px 16px`, `gap: 14px`, `margin-bottom: 22px`; avatar 44px `#A9D9E8` / `#1F7A93` Fredoka 600 19px; label 13px `#94887B`; nombre 17px Fredoka 600 |
| Activar · código | Fredoka 700 18px, `letter-spacing: 3px`, `margin-bottom: 18px` |
| Activar · contraseña | igual a los demás campos pero borde `#F2A78E` |
| Activar · consentimiento | label fondo `#FBF1D6`, radio 14px, padding `14px 16px`, `margin-bottom: 24px`; caja 24px radio 8px `#5FB97E` con check 15px (`stroke-width: 3`); texto 14px `#8A7234` / 1.45 |
| Activar · footer | 14.5px `#94887B`, `margin-top: 22px`; link «Iniciar sesión» `#C5503A` 800 |

## Modelo de datos

Un módulo nuevo, `data/auth.ts`:

```ts
// Clave versionada: permite migrar el formato sin romper sesiones viejas
export const sessionStorageKey = "opendaycare:session:v1";

export type DemoSession = { email: string };

// Valor inicial del campo email (estado por defecto del mockup)
export const demoEmail = "caro@opendaycare.com";

export const invitation = {
  childInitial: "M",
  childName: "Mateo",
  room: "Sala Soles",
  code: "7K4P9",
  email: "lucia.fernandez@gmail.com",
  consent:
    "Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app.",
};
```

Convenciones:

- El login escribe `JSON.stringify({ email })` en `localStorage` bajo `sessionStorageKey` dentro del handler de submit, nunca durante el render (evita mismatch de hidratación).
- La escritura va envuelta en `try/catch`: si `localStorage` está bloqueado (modo privado), el error se ignora y la navegación a `/` prosigue.
- Ninguna pantalla lee el estado en esta spec; el guardado existe para que las vistas de familia lo consuman en specs futuras.
- `demoEmail` es el `defaultValue` del input; el usuario puede editarlo y se guarda lo editado.
- Identificadores en inglés; textos visibles en español, con acentos.

## Plan de implementación

Cada paso deja el sistema compilando y navegable.

1. **Tokens.** En `app/globals.css`, agregar los `--color-*` de las anclas: `auth-bg` (`#FBF4EC`), `panel-from`/`panel-mid`/`panel-to`, `field-border` (`#EADFD0`), `field-border-warm` (`#F2A78E`), `consent-bg` (`#FBF1D6`), `consent-box` (`#5FB97E`), `consent-ink` (`#8A7234`). Reutilizar los tokens ya existentes para `#C5503A`, `#94887B` y el gradiente del CTA. Manual: `npm run dev` levanta y el home se ve igual.
2. **Datos.** Crear `data/auth.ts` con `sessionStorageKey`, `DemoSession`, `demoEmail` e `invitation`. Manual: `npx tsc --noEmit`.
3. **Iconos.** Agregar `CheckIcon` a `components/shared/icons.tsx` (15px, `polyline 20 6 9 17 4 12`, `stroke-width: 3`, `stroke-linecap/linejoin: round`). El sol de marca ya existe de SPEC 01. Manual: `tsc` sigue pasando.
4. **Panel de marca.** Crear `components/auth/login-brand-panel.tsx` (server): panel con gradiente `155deg`, los dos círculos decorativos absolutos, la marca (caja 46px + sol 26px + «OpenDayCare»), el H1 de 42px con salto de línea literal, el párrafo y el footer «🌿 Guardería Sala Soles».
5. **Formulario de login.** Crear `components/auth/login-form.tsx` (`"use client"`): estado `email` (inicial `demoEmail`) y `password`; labels e inputs según las anclas; «¿Olvidaste tu contraseña?» como `<span>` inerte con `title="Próximamente"`; `<form>` cuyo `onSubmit` hace `preventDefault`, escribe la sesión con `try/catch` y navega a `/` con `router.push`; botón primario; footer con `<Link href="/activate-account">Activá tu cuenta</Link>`.
6. **Página de login.** Crear `app/login/page.tsx`: grid `min-h-screen grid-cols-[1.05fr_1fr] min-w-[960px]` sobre fondo `auth-bg`, con `<LoginBrandPanel />` y la columna derecha centrada con `<LoginForm />`. Manual: `/login` se ve completa, envía y aterriza en `/`.
7. **Tarjeta de invitación.** Crear `components/auth/invitation-card.tsx` (`{ invitation }`): avatar 44px con inicial, «Te invitaron a seguir a» y «Mateo · Sala Soles» (`${childName} · ${room}`).
8. **Formulario de activación.** Crear `components/auth/activate-account-form.tsx` (`{ invitation }`, server): labels CÓDIGO DE INVITACIÓN / EMAIL / CREAR CONTRASEÑA con los valores literales (`defaultValue`), el consentimiento visual (caja marcada, no interactiva) y el botón «Activar mi cuenta» inerte con `title="Próximamente"`.
9. **Página de activación.** Crear `app/activate-account/page.tsx`: contenedor centrado `max-w-[440px]`, badge degradado con sol, H1 «Bienvenida a OpenDayCare», párrafo, `<InvitationCard />`, `<ActivateAccountForm />` y footer con `<Link href="/login">Iniciar sesión</Link>`. Manual: `/activate-account` coincide con el mockup y ambos cross-links navegan.
10. **Sidebar.** En `components/shared/app-sidebar.tsx`, convertir «Cerrar sesión» de `<span title="Próximamente">` a `<Link href="/login">` conservando clases e icono. Esto obsoleta la parte del criterio de SPEC 02 que lo listaba inerte. Manual: el home se ve igual y «Cerrar sesión» lleva a `/login`.
11. **Paridad visual.** Con Playwright a `1280×800`, capturar `/login` (panel izquierdo y columna derecha por separado, tolerando el bloque eliminado) contra `login.dc.html`, `/activate-account` contra `activar-cuenta.dc.html`, y el home para confirmar que no cambió. Todo en `.playwright-mcp/`; corregir diferencias de spacing, sombra o tracking.
12. **Cierre.** `npx tsc --noEmit`, `npx eslint app`, `npm run build`; confirmar que el build prerenderiza `/login` y `/activate-account` como páginas estáticas.

## Criterios de aceptación

- [ ] `/login` y `/activate-account` responden 200 y la consola del navegador no muestra errores ni warnings de hidratación.
- [ ] `/login` no renderiza «INGRESO COMO» ni los botones «Personal»/«Familia»; después del subtítulo va directo al label EMAIL.
- [ ] A `1280×800`, el panel izquierdo de `/login` (gradiente, círculos, marca, headline, footer) coincide con `login.dc.html` en colores, tipografías, tamaños y espaciados.
- [ ] A `1280×800`, la captura de `/activate-account` coincide con `activar-cuenta.dc.html` salvo antialiasing.
- [ ] El campo email es editable con valor inicial `caro@opendaycare.com`; la contraseña es `type="password"` con placeholder `••••••••`.
- [ ] Al enviar el formulario, `localStorage` queda con `{"email": "…"}` bajo la clave `opendaycare:session:v1` y la app navega a `/`.
- [ ] Con `localStorage` bloqueado, el submit no lanza error y navega a `/` igualmente.
- [ ] «¿Olvidaste tu contraseña?» y «Activar mi cuenta» son inertes con `title="Próximamente"` y no navegan.
- [ ] «Activá tu cuenta» navega a `/activate-account` y «Iniciar sesión» (footer de activar) navega a `/login`.
- [ ] `/activate-account` muestra literalmente: badge con sol, «Bienvenida a OpenDayCare», «Te invitaron a seguir a» / «Mateo · Sala Soles», código `7K4P9`, `lucia.fernandez@gmail.com`, contraseña con borde `#F2A78E` y el consentimiento marcado con el texto exacto.
- [ ] El checkbox de consentimiento no cambia al hacer clic (es visual).
- [ ] En `/`, `/kids` y los perfiles, «Cerrar sesión» es un enlace a `/login` y ninguna otra parte de esas pantallas cambió (captura del home idéntica a la de SPEC 01).
- [ ] Solo `components/auth/login-form.tsx` contiene `"use client"`; ningún archivo existente lo agrega.
- [ ] `app/` contiene exactamente los archivos previos más `login/page.tsx` y `activate-account/page.tsx`; `components/auth/` contiene exactamente `login-brand-panel.tsx`, `login-form.tsx`, `invitation-card.tsx` y `activate-account-form.tsx`; sin barrels `index.ts`.
- [ ] Todos los identificadores nuevos están en inglés; los únicos textos en español son los de la UI y los valores de `data/auth.ts`.
- [ ] `npx tsc --noEmit`, `npx eslint app` y `npm run build` terminan sin errores, con `/login` y `/activate-account` prerenderizadas.
- [ ] `npm run lint` sigue fallando solo por `references/pantallas/support.js`, sin cambios en ese archivo.

Evidencia esperada en `.playwright-mcp/`: `spec03-login-panel-1280.png`, `spec03-login-form-1280.png`, `spec03-mockup-login-1280.png`, `spec03-activate-1280.png`, `spec03-mockup-activate-1280.png`, `spec03-home-unchanged-1280.png`.

## Decisiones

- **Sí:** eliminar el bloque «INGRESO COMO» del login. Decisión explícita del usuario: sin opciones Personal/Familia. Es la única desviación del mockup y queda documentada aquí.
- **Sí:** rutas `/login` y `/activate-account`. Identificadores en inglés como `/kids` por `ninos.dc.html`; la UI visible sigue en español.
- **Sí:** localStorage con clave versionada `opendaycare:session:v1`. Sin backend, no toca el prerender de las pantallas existentes; el `:v1` permite migrar el formato después.
- **No:** cookies. Leerlas obliga a `Suspense` y vuelve dinámicas pantallas hoy estáticas; la simulación no lo necesita.
- **Sí:** auth simulada que solo guarda `{ email }` al enviar. Nada la lee en esta spec; las vistas de familia la consumirán en specs futuras.
- **Sí:** email precargado con `caro@opendaycare.com`. Es el estado por defecto del mockup; editable y lo editado es lo que se guarda.
- **Sí:** isla client mínima (`login-form.tsx`). Primer `"use client"` del repo, contenida en un componente; el resto sigue siendo server components.
- **No:** toggle de rol vía `searchParams`. Quedó sin sentido al eliminar el bloque, y Cache Components lo encarecería.
- **Sí:** activar-cuenta 100% estática con los valores literales del mockup. No hay activación real y el botón no tiene pantalla destino.
- **Sí:** «Cerrar sesión» → `<Link href="/login">`. Único punto de entrada descubrible; se registra que obsoleta la parte correspondiente del criterio de SPEC 02.
- **No:** pantallas de familia o reacción al rol en esta spec. Cada vista que llegue va en su propia spec.
- **No:** dark mode ni versión móvil. Mismo criterio que SPEC 01/02.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Primer componente client genera mismatch de hidratación si se toca `localStorage` en render | Escribir solo dentro de `onSubmit`; el render es puro |
| `localStorage` bloqueado (modo privado) rompe el submit | `try/catch` alrededor de `setItem`; la navegación continúa |
| La comparación visual del login se falsea por el bloque eliminado | Capturar panel izquierdo y columna derecha por separado; la desviación está documentada |
| `Link` + `partialPrefetching` genera warnings en dev | No usar `prefetch={true}` en ningún enlace nuevo |
| Valores finos (`42px/1.12`, `.5px`, `3px` de tracking, `.7px`) se redondean | Valores arbitrarios explícitos de Tailwind y verificación con captura |
| Cambiar la sidebar altera el home existente | Solo convertir el `<span>` en `<Link>` con las mismas clases; captura del home como evidencia |

## Lo que **no** está en esta spec

- Autenticación, sesión y rutas protegidas reales.
- Toggle Personal/Familia y emails por rol.
- Vistas de familia y cualquier reacción al estado guardado.
- Recuperación de contraseña.
- Activación real de cuentas e invitaciones.
- Las demás pantallas de `references/pantallas/`.
- Versión móvil, dark mode y tests automatizados.

Cada uno de esos puntos, si llega, va en su propia spec.
