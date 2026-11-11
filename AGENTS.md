<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->

# OpenDayCare

App de gestión de guardería con UI en español. `app/` sigue siendo el starter de `create-next-app` (`page.tsx` por defecto, fuentes Geist, metadata de placeholder); la UI del producto todavía no está construida.

## Fuente de verdad del diseño

- `references/pantallas/*.dc.html` son mockups HTML estáticos de cada pantalla: vistas de docente (`feed`, `ninos`, `perfil-nino`, `agregar-nino`, `vincular-padre`, `avisos`, `mi-cuenta`, `crear-publicacion`), vistas de familia (`familia-feed`, `detalle-publicacion`, `resumen-dia`, `familia-cuenta`), y pantallas de auth/media (`login`, `activar-cuenta`, `foto`). Leé el mockup correspondiente antes de construir una pantalla; respetá su layout y sus textos en vez de inventar.
- `references/screenshots/` tiene PNGs renderizados de algunas de esas pantallas.
- Lenguaje visual: fondo crema `#F6ECDF`, superficie `#FFFDF9`, borde `#ECE0D0`, texto `#3F362E`, acento coral `#EE8164` / `#D9583C`. Títulos en Fredoka, cuerpo en Nunito (solo cargadas dentro de los mockups; `app/layout.tsx` todavía carga Geist).
- Los textos, etiquetas y datos de la UI van en español, con acentos. Mantené el texto nuevo en español.

## Comandos

- `npm run dev` — servidor de desarrollo con Turbopack. Escribe `.next/dev/lock` (PID/puerto); no mates un servidor existente sin mirar.
- `npm run build` — la verificación real: compila, chequea tipos y prerenderiza. Corrélo antes de dar por terminado un cambio.
- `npx tsc --noEmit` — solo chequeo de tipos, más rápido que un build completo.
- `npx eslint app` — lintea el código de la app.
- `npm run lint` hoy sale con código 1 porque también lintea `references/pantallas/support.js` (runtime generado de los mockups). Linteá `app`; nunca edites ese archivo generado para silenciarlo.
- No hay runner de tests configurado.

## Particularidades de Next.js 16

- `next.config.ts` habilita `cacheComponents` y `partialPrefetching`. PPR es el comportamiento por defecto: los datos dinámicos sin cachear (`cookies()`, `headers()`, `connection()`, `fetch`) deben ir dentro de `<Suspense>` o cacheados con `"use cache"`, o el prerender falla. No agregues `export const runtime`: Cache Components solo corre en Node.
- Con `partialPrefetching`, los links prefetchean un App Shell estático por ruta. `<Link prefetch={true}>` también trae datos que dependen de la URL y puede generar warnings en dev; usalo solo si hace falta.
- Tailwind 4 está conectado mediante el loader `@tailwindcss/turbopack` declarado en `next.config.ts`. No hay archivo de PostCSS ni `tailwind.config`: no los crees, y usá la sintaxis v4 `@import "tailwindcss"` + `@theme inline` que ya está en `app/globals.css`.
- `LayoutProps<"/">` y `PageProps<"/route">` son helpers globales generados a partir del árbol de rutas. No los importes ni escribas a mano los tipos de `params` / `searchParams`.
- `next dev` y `next build` reescriben los dos bloques administrados del inicio de este archivo. Dejá los marcadores intactos, no los traduzcas, y poné las notas del proyecto debajo; si no, se pierden.
- La documentación de esta versión exacta está en `node_modules/next/dist/docs/`; preferila antes que APIs de memoria.

## MCP y skills

- Playwright MCP está configurado en `opencode.json`. Toda captura y artefacto de Playwright va bajo `.playwright-mcp/`; esa carpeta está en `.gitignore`, así que no aparece en diffs ni commits.
- Usá el MCP de Context7 para documentación actualizada de frameworks y librerías.
- Los skills de especificación están en `.agents/skills/`: `spec` escribe specs y `spec-impl` las implementa. Las specs van en `specs/NN-slug.md`. Solo se puede implementar una spec cuyo estado signifique Approved; ese cambio lo hace la persona, y ningún skill commitea por su cuenta.

## Agentes y comandos

- `.opencode/agents/spec-check.md` define el agente `spec-check` (`mode: all`, modelo `opencode-go/qwen3.7-plus`): verifica los criterios de aceptación de un spec, corrige el código o el spec cuando algo no cumple, y marca cada check con su evidencia. Compara pantallas con Playwright contra los mockups y consulta Context7 para las prácticas de Next.js.
- Comando: `/spec-check <spec>`, por ejemplo `/spec-check 01-feed-home`. Acepta número (`01`), slug (`feed-home`) o archivo completo (`01-feed-home.md`). Desde otro agente: «Usá el agente spec-check para verificar `specs/01-feed-home.md`».
- Permisos: edita sin preguntar `specs/*`, `app/*`, `components/*`, `data/*`, `public/*`, `next.config.ts`, `package.json` y `AGENTS.md`; cualquier otra ruta pide confirmación. En shell solo corre sin preguntar los comandos de verificación (`npx tsc*`, `npx eslint*`, `npm run dev|build|lint|start*`, `ls`, `cat`, `git status|diff|branch`). Playwright y Context7 permitidos; subagentes denegados.
- Nunca commitea ni cambia el estado del spec: solo marca los checks y reporta hallazgos, correcciones y evidencia.

## Reglas de codigo
- Usar código limpio, nombres, funciones y variables, etc en inglés. 