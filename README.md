# +4 Creative Studio — Hero (Escena 01 DIFUSO → Escena 02 CONEXIÓN)

Next.js (App Router) · TypeScript · CSS Modules · GSAP + ScrollTrigger.
Sin Three.js, WebGL, Framer Motion, video ni imágenes. Solo CSS + GSAP.

## Correr en local

```bash
npm install
npm run dev
# http://localhost:3000
```

Requiere Node 18.18+ (recomendado 20+) y acceso a internet en el primer build:
`next/font/google` descarga y auto-hostea Archivo e IBM Plex Mono en tiempo de build.

## Logo

Colocar los SVG en:

```
public/brand/plus4-mark-white.svg     ← símbolo +4 (hero)
public/brand/plus4-lockup-white.svg   ← lockup horizontal (header)
```

Mientras no existan, `BrandMark` detecta el error de carga y muestra un
placeholder tipográfico. No hay nada más que tocar al agregarlos.

## WhatsApp

`src/lib/site.ts` → `WHATSAPP_NUMBER`. Un solo lugar.

## Estructura

```
src/
  app/            layout, page, globals.css
  lib/            site.ts (constantes), fonts.ts, useIsomorphicLayoutEffect.ts
  components/
    hero/         Hero, GradientField, BrandMark, ConnectionNode, ConnectionLines
    navigation/   Header
```
