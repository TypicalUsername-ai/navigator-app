# Navigator App

Clean, responsive React frontend for city navigation: trains search, route visualization on map, parking, and transport planning. The app uses React Router, Vite, TailwindCSS, and Leaflet.

Important: Docker is the one and only always-working option to run this project. Local `node/npm` setups may vary; use Docker for a consistent, reliable environment.

**Stack Overview**
- **Frontend:** React + Vite + TypeScript
- **Routing:** React Router
- **Styling:** TailwindCSS
- **UI:** Custom components under `src/components/ui`
- **Maps:** Leaflet (OpenStreetMap tiles)

**Project Structure**
- `src/pages/trains/trains.tsx`: Trains page with search and map
- `src/components/train/TrainSearch.tsx`: Query form (from/to/time)
- `src/components/train/TrainMap.tsx`: Map + route rendering
- `src/lib/mock.ts`: Mock data for tickets and passengers (async fetch wrappers)
- `src/routes/*.tsx`: Route entry components
- `compose.yaml`: Docker Compose for dev
- `Dockerfile`: Node + Vite dev server container

## Run with Docker (Recommended)

Docker ensures consistent dependencies, working HMR, and zero local configuration drift. Use these commands from the project root.

### Prerequisites
- Install Docker Desktop (includes Compose)

### Start the App
```bash
docker compose up --build
```
- Opens the Vite dev server at `http://localhost:5173`
- Live-reloads on file changes (host files are mounted into the container)

### Stop and Clean
```bash
docker compose down
```

### Full Reset (including anonymous volumes)
```bash
docker compose down -v
```

Optional deep cleanup (removes unused images/containers; use with care):
```bash
docker system prune -a
```

### What Compose Does
- Builds the image using `Dockerfile`
- Maps port `5173:5173` for the dev server
- Mounts the project directory into the container for HMR
- Keeps `node_modules` inside a named volume for speed and stability

## Alternative Local Run (Not Guaranteed)

If you still want to run locally without Docker (not guaranteed to work across environments):
```bash
npm install
npm run dev
```
Open `http://localhost:5173`. Use Docker if you hit type/dependency mismatches.

## Development Notes

- **Train Search + Map:** Enter `stacja z`, `stacja do`, and `godzina`; the map displays straight-line route with markers.
- **Mock Data:** Tickets and passengers are shown in cards on the right; replace `src/lib/mock.ts` with real API calls when backend is ready.
- **Barrel Imports:** Components and pages expose barrels (e.g., `@/components/train`, `@/pages/trains`, `@/routes`).

## Troubleshooting
- Port already in use: change the host port in `compose.yaml` (e.g., `8080:5173`).
- Stale dependencies: run `docker compose down -v` to reset the `node_modules` volume, then `docker compose up --build`.
- Map tiles blocked: ensure internet access to `https://{s}.tile.openstreetmap.org/`.
