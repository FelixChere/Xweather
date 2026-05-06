# UW XWeather — Vigilant Lens Dashboard

A React + Vite + Tailwind implementation of the redesigned campus weather command center.

## Quick start

From the `xweather-dashboard` folder:

```bash
npm install
npm run dev
```

Then open the URL Vite prints (defaults to http://localhost:5173).

## Open in VS Code + run dev server (one-liner)

From your `FC project` folder, paste this into Terminal:

```bash
cd "xweather-dashboard" && code . && npm install && npm run dev
```

> If the `code` command isn't found, open VS Code, then run **Shell Command: Install 'code' command in PATH** from the Command Palette (⇧⌘P) and try again.

## Structure

```
xweather-dashboard/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    └── components/
        ├── AlertBanner.jsx
        ├── Icons.jsx
        ├── MapView.jsx
        ├── MiniCards.jsx
        ├── SideRail.jsx
        ├── Sidebar.jsx
        └── TopBar.jsx
```

## Design tokens

Custom Tailwind colors live in `tailwind.config.js` (`bg`, `ink`, `accent`, `warn`, `critical`, `ok`, `info`). Keyframes and bespoke gradients (map canvas, sparkline, brand mark) are in `src/index.css`.

## Notes

- The map is a stylized SVG-free placeholder using CSS gradients for "streets." Swap `MapView.jsx` for a real map (Mapbox / MapLibre / Leaflet) when wiring real data.
- Sensor coordinates and KPI values are hard-coded in `MapView.jsx` and `SideRail.jsx`. Replace with API data when ready.
