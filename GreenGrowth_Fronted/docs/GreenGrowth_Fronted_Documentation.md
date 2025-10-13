# GreenGrowth Frontend Documentation

Modern web app built with Vite, React, and TypeScript for interactive mapping, environmental layers, and community reports.

---

## Table of Contents

1. Quick Start (install, run, build)
2. Scripts and Tooling
3. Project Structure
4. Key Features and Components
5. Routing and Pages
6. Backend Integration (API endpoints)
7. Environment Configuration
8. Assets (Logo and App Icon)
9. Troubleshooting

---

## 1) Quick Start

Prerequisites: Node.js LTS (18+ recommended) and npm.

1. Clone and install
     ```bash
     git clone <your-fork-or-repo-url>
     cd GreenGrowth_Front
     npm install
     ```

2. Run the dev server
     ```bash
     npm run dev
     ```
     - Vite serves the app at http://localhost:5173 by default.

3. Build for production
     ```bash
     npm run build
     ```

4. Preview the production build
     ```bash
     npm run preview
     ```

---

## 2) Scripts and Tooling

Defined in `package.json`:

- `npm run dev` – Start Vite dev server
- `npm run build` – Type-check (`tsc -b`) and build with Vite
- `npm run preview` – Preview the production build
- `npm run lint` – Run ESLint

Libraries in use (partial):
- React + TypeScript, Vite
- Leaflet (+ react-leaflet, leaflet-draw) for maps and drawing
- axios for HTTP requests
- tailwindcss (utility styling), MUI (selected components), lucide-react (icons)

---

## 3) Project Structure

Common top-level files:
- `index.html` – App HTML shell and link tags (icon)
- `vite.config.ts` – Vite configuration
- `tsconfig*.json` – TypeScript configs
- `src/main.tsx` – App bootstrap
- `src/index.css` – Global styles

Selected source folders and files (not exhaustive):
- `src/components/`
    - `PolygonDrawer.tsx` – Draw polygons on the map (Leaflet Draw)
    - `PolygonCoordinateExporter.tsx` – Export drawn polygon coordinates
    - `environmentalLayers.tsx` – Toggle/overlay environmental layers
    - `ListaDenuncias.tsx` – Reports list (filtering, search)
    - `LoginUser.tsx` – Sign-in form (username/password)
    - `RegisterUser.tsx` – Registration form
- `src/pages/` – Page-level components (if present)
- `src/routes/` – Route declarations (if present)
- `public/` – Static assets (e.g., icons, images)

---

## 4) Key Features and Components

### Mapping and Geometry
- Leaflet-based map rendering.
- `PolygonDrawer.tsx` – Create and edit polygons; useful for zoning or planning areas.
- `PolygonCoordinateExporter.tsx` – Extract polygon coordinates as arrays/GeoJSON for downstream processing.

### Environmental Layers
- `environmentalLayers.tsx` – Toggle environmental overlays (e.g., vegetation, risk, or other thematic layers). Implementation typically adds/removes TileLayers/Overlays.

### Reports (Denuncias)
- `ListaDenuncias.tsx` – Fetches and displays reports with filters (tags, location) and search. Includes city/country derivation via reverse geocoding.

### Authentication UI (Forms)
- `LoginUser.tsx` – Username + password login form. On success, it currently redirects to `/report`.
- `RegisterUser.tsx` – Basic registration form. Includes a link to the login page.

> Note: Token-based storage/interceptors are not enforced by default in this branch. Update forms as needed for your backend.

---

## 5) Routing and Pages

Make sure your router maps these routes (file names may vary by your setup):
- `/login` → `LoginUser.tsx`
- `/register` → `RegisterUser.tsx`
- `/reportList` → `ListaDenuncias.tsx`
- Other map-related pages as defined in your `src/pages` or `src/routes`.

If you use React Router v6+:
```tsx
// Example
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginUser from '@/components/LoginUser';
import RegisterUser from '@/components/RegisterUser';
import ListaDenuncias from '@/components/ListaDenuncias';

const router = createBrowserRouter([
    { path: '/login', element: <LoginUser /> },
    { path: '/register', element: <RegisterUser /> },
    { path: '/reportList', element: <ListaDenuncias /> },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
```

---

## 6) Backend Integration (API endpoints)

Some components call a local backend by default (e.g., `http://127.0.0.1:5001`). For instance:
- Login (POST): `http://127.0.0.1:5001/users/login`
- Reports (GET): `http://localhost:5001/messages/` (usage inside `ListaDenuncias.tsx` may vary)

Update these URLs to match your backend environment. Prefer using environment variables (see next section) instead of hardcoding URLs.

---

## 7) Environment Configuration

Use Vite environment variables for configurable values like API base URL.

1. Create a `.env` file in the project root:
     ```env
     VITE_API_BASE_URL=http://127.0.0.1:5001
     ```

2. Read it in code:
     ```ts
     const API = import.meta.env.VITE_API_BASE_URL;
     // Example: axios.get(`${API}/messages/`)
     ```

> Vite exposes variables prefixed with `VITE_` via `import.meta.env`.

---

## 8) Assets (Logo and App Icon)

### App Logo (in UI)
- Commonly referenced in header or components via an `img` tag pointing to an image under `public/` (e.g., `public/logo.png`).
- To change:
    1. Replace the file in `public/` with your asset (ideally optimized PNG/SVG).
    2. Update the `src` in your component if the filename changes.

### App Icon (favicon)
- Defined in `index.html` with a `<link rel="icon" ...>` tag.
- To use a transparent icon (no background), provide a PNG or ICO with transparency:
    ```html
    <link rel="icon" type="image/png" href="/favicon.png" />
    ```
- If you see a background you don’t want, your source file likely includes it. Re-export the icon with a transparent background.
- Optional multiple sizes:
    ```html
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    ```

---

## 9) Troubleshooting

**Dev server doesn’t start**
- Ensure Node 18+ is installed.
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install` (Windows PowerShell: `rm -r -fo node_modules`)

**Icon shows with an unwanted background**
- Replace the favicon with a PNG/ICO that has transparency.
- Clear browser cache or do a hard refresh.

**CORS or network errors**
- Verify the backend is running and CORS allows your dev origin (e.g., `http://localhost:5173`).

**Map tiles don’t render**
- Check internet connectivity and tile provider URLs.
- Ensure Leaflet CSS is included (react-leaflet setup) and container has a fixed height.

---

For more, see the repository `README.md` or the source files in `src/components`.
