# Addis Ababa Transit Map

Interactive web map of the Addis Ababa public transit network, covering both **Bus** and **Minibus** routes. Built with React, TypeScript, and Leaflet.

![Preview](public/preview.png)

## Features

- 🚌 **198 Bus routes** — color-coded by line family (AB, SH, A, B, C, D)
- 🚐 **263 Minibus routes** — color-coded by geographic zone (Central, East, South, West, North)
- Click a route to highlight it and see full details
- Click the map background to clear the selection
- Filter by mode (All / Bus / Minibus) and search by name or code
- Popup on route click with headway, service hours, and direction info

## Data

GTFS data sourced from [AddisMap + DT4A](https://addismaptransit.com/), published by Addis Ababa Transport (AA).

Data files are stored in `public/data/` as pre-processed JSON derived from the original GTFS feeds:
- `bus.json` — Bus route shapes with zone and frequency metadata
- `minibus.json` — Minibus route shapes with zone and frequency metadata

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Header/          # App header with stats
│   ├── Map/             # Leaflet map, polylines, popups
│   └── Sidebar/         # Tabs, search, legend, route list, info panel
├── context/             # AppContext — shared selection + filter state
├── hooks/               # useTransitData, useRouteSelection
├── types/               # TypeScript interfaces
├── constants/           # Zone definitions, colors, map config
└── utils/               # Headway formatters, zone classifier
```

## Deploying to GitHub Pages

1. Set `base` in `vite.config.ts` to your repo name: `base: '/your-repo-name/'`
2. Run `npm run build`
3. Push the `dist/` folder to the `gh-pages` branch, or use the [gh-pages](https://www.npmjs.com/package/gh-pages) package:

```bash
npm install --save-dev gh-pages
npx gh-pages -d dist
```

## License

Data: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/) — AddisMap + DT4A  
Code: MIT
