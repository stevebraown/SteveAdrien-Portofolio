# Drift Lane

Standalone, one-button endless browser game. Open `index.html` directly—no build step.

## Controls
- Hold mouse / touch / space to drift.
- Release to straighten.

## Hosting
Works on GitHub Pages as a static site.
# Drift Lane Worlds

Futuristic, explorable portfolio built with React, Vite, and React Three Fiber. Glide through bright colour zones, explore 3D project portals, and jump into the Drift Lane mini‑game.

## Tech stack

- React + Vite
- Three.js + React Three Fiber
- Drei helpers
- gh-pages deployment

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment (GitHub Pages)

The project is configured with the correct `base` path in `vite.config.js` and `gh-pages` scripts in `package.json`.

```bash
npm run deploy
```

## Controls

- Scroll to move between zones.
- Click the 3D project panels to open links.
- Mini-game: enter the Game zone and press G or click the arcade platform.
- Overlay toggles: sound (ambient hum) + low graphics mode.

## Structure

- `src/components/world/` – Canvas, scene, lighting, camera, effects
- `src/components/zones/` – Landing, About, Projects, Game, Contact zones
- `src/components/ui/` – HUD overlay, nav dots, toggles
- `src/components/game/` – Drift Lane mini‑game wrapper + game code
- `src/config/` – zones + project metadata
