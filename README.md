# Front-Dashboard

Panel de casa para la tablet colgada junto al escritorio: **lista de la compra compartida**, **tiempo**, **agenda familiar** y **qué toca entrenar hoy en Fitcina** en una sola pantalla. El backend vive en [Backend-Dashboard](https://github.com/jorgeloimil/Backend-Dashboard).

Mismo stack que Fitcina: Astro + React (islas) + TypeScript + Tailwind, con su paleta tinta/crema/tomate y sombras duras. Aquí en modo oscuro fijo (una pantalla encendida todo el día no debe deslumbrar).

## Inicio rápido

```bash
npm install
npm run dev          # http://localhost:4321
```

**Requisitos:** Node.js 22 y el backend en `http://localhost:8080` (o cualquier otro con `API_PROXY_TARGET=http://192.168.1.50:8080 npm run dev`).

## Scripts

```bash
npm run dev          # Servidor de desarrollo (puerto 4321), con /api redirigido al backend
npm run build        # Build estático en dist/
npm run preview      # Preview del build
npm run check        # Comprobación de tipos (TypeScript y .astro)
npm run test:e2e     # Tests E2E con Playwright y la API simulada (sin backend)
```

GitHub Actions (`.github/workflows/ci.yml`) pasa `check`, los tests E2E y el build en cada push y pull request.

> **Chromium ya instalado:** si no puedes descargar el de Playwright, apunta a otro con `PW_CHROMIUM_PATH=/ruta/a/chrome npm run test:e2e`.

## Qué hace

- **La compra**: añadir con cantidad, tocar para marcar comprado, ✕ para quitar, «Limpiar» para vaciar los comprados. Se agrupa por pasillo y se refresca cada 30 s con lo que apunten otros desde el móvil.
- **El tiempo**: ahora, próximas 6 horas y 5 días (Open-Meteo, vía el backend).
- **Agenda**: próximos 7 días agrupados por día, con eventos de todo el día, de varios días y ubicación. Si un calendario falla, avisa y sigue mostrando los demás.
- **Hoy toca… (Fitcina)**: las rutinas de hoy según sus días de la semana, con su estado (pendiente, en curso, hecha), la racha y las sesiones de la semana. Si Fitcina no responde, la tarjeta muestra los últimos datos con un aviso o el motivo, y el resto del panel sigue igual. Las credenciales de Fitcina van en el backend (ver su README), no aquí.
- Al despertar la tablet (la pestaña vuelve a ser visible) todo se refresca al instante.

## Arquitectura

```
Astro (index.astro)  →  Dashboard (isla React)  →  Hooks  →  Services (fetch)  →  /api
```

- **Una sola página, una sola isla** (`client:only="react"`): la hora y "hoy" son los de la tablet, no los del build.
- **Hooks** (`useCompra`, `useTiempo`, `useAgenda`, `useFetch`, `usePolling`): estado y refrescos; los componentes solo pintan. Los cambios de la compra se ven al instante y se confirman después con el servidor; si falla, se avisa y se vuelve a pedir la lista.
- **Services**: llamadas a la API con `http` (`api.client.ts`, sobre `fetch`, desenvuelve el `ApiResponse` y los errores `ProblemDetail`).
- **Rutas de la API** en `constants/routes.ts`; tipos del contrato en `types/`.
- **Salida estática**: no hace falta servidor de Node. En el NUC lo servirá nginx, que además redirige `/api` al backend (igual que el proxy de desarrollo de `astro.config.mjs`).

```
src/
├── pages/index.astro       # La única página
├── layouts/BaseLayout.astro
├── components/             # Dashboard, ShoppingPanel, WeatherPanel, AgendaPanel, FitcinaPanel, Reloj y ui/
├── hooks/                  # useCompra, useTiempo, useAgenda, useFitcina, useFetch, usePolling, useClock
├── services/               # api.client y un servicio por recurso
├── constants/              # Rutas de la API y pasillos
├── types/                  # Contrato con el backend
└── utils/                  # Formato de fechas, iconos del tiempo, agrupar la agenda
```

## Seguridad

Sin login en el MVP: el panel y su API son solo para la red de casa y Tailscale. No lo expongas a internet.

## Convención de commits

`<tipo>: <descripción en español>` — `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
