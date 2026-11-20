# Front-Dashboard

Panel de casa para la tablet colgada junto al escritorio (1280×800, táctil): **lista de la compra compartida**, **tiempo**, **agenda familiar** y **qué toca entrenar hoy en Fitcina**, con pantallas de inicio, compra y luces. El backend vive en [Backend-Dashboard](https://github.com/jorgeloimil/Backend-Dashboard).

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

## Pantallas

Barra superior (reloj, fecha y píldora de avisos), la pantalla activa y navegación táctil abajo.

- **Inicio**: ocho tarjetas (4×2) que caben en 1280×800 sin scroll: agenda, compra, tiempo, luces, Fitcina, menú, tareas y gasto del súper. Tocar la compra o el gasto abre la pantalla de compra; tocar luces abre las luces.
- **Compra**: la lista real con alta, pasillos y comprados, el flujo de «Escanear ticket» y el gasto semanal.
- **Luces**: bombillas del despacho con interruptor, brillo, tono y escenas.
- **Menú, Despensa y Casa 3D** salen apagados en la navegación (fases 2 y 3); en el móvil se ocultan.

**Responsive**: el diseño fijo 4×2 es para pantallas de ≥1024 px (la tablet). Por debajo, las tarjetas se apilan en 2 columnas (768 px) o en 1 (móvil), con su altura natural y scroll en la pantalla, y la navegación se reduce.

### Datos reales y datos de ejemplo

Con datos **reales** (backend): compra, tiempo, agenda y «Hoy toca…» de Fitcina; la píldora de avisos se calcula con los errores reales de esas llamadas.
Todo lo demás **aún no tiene backend** y se pinta de ejemplo con la etiqueta «Ejemplo» (viven en `src/data/ejemplos.ts` y no se guardan en ningún sitio): luces (solo estado en memoria, `useLucesDemo`), menú, tareas, gasto y el ticket de «Escanear ticket» (sin lectura ni guardado: los botones de foto/captura y guardar están desactivados).

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

- **Una sola página, una sola isla** (`client:only="react"`): la hora y "hoy" son los de la tablet, no los del build. `Dashboard` pide todos los datos y se los pasa a las pantallas, así no se recargan al cambiar de pantalla.
- **Hooks** (`useCompra`, `useTiempo`, `useAgenda`, `useFetch`, `usePolling`): estado y refrescos; los componentes solo pintan. Los cambios de la compra se ven al instante y se confirman después con el servidor; si falla, se avisa y se vuelve a pedir la lista.
- **Services**: llamadas a la API con `http` (`api.client.ts`, sobre `fetch`, desenvuelve el `ApiResponse` y los errores `ProblemDetail`).
- **Rutas de la API** en `constants/routes.ts`; tipos del contrato en `types/`.
- **Salida estática**: no hace falta servidor de Node. En el NUC lo servirá nginx, que además redirige `/api` al backend (igual que el proxy de desarrollo de `astro.config.mjs`).

```
src/
├── pages/index.astro       # La única página
├── layouts/BaseLayout.astro
├── components/             # Dashboard, BarraNavegacion, TicketModal, Reloj
│   ├── pantallas/          # Inicio, Compra, Luces
│   ├── paneles/            # Tarjetas: Agenda, Weather, Fitcina, ListaCompra, CompraResumen, LucesResumen, EjemplosInicio
│   └── ui/                 # Panel, Pill, Aviso, Interruptor, Casilla, Barras
├── data/                   # Datos de EJEMPLO (luces, menú, tareas, gasto, ticket)
├── hooks/                  # useCompra, useTiempo, useAgenda, useFitcina, useFetch, usePolling, useClock, useLucesDemo, useToast
├── services/               # api.client y un servicio por recurso
├── constants/              # Rutas de la API y pasillos
├── types/                  # Contrato con el backend
└── utils/                  # Formato de fechas, iconos del tiempo, agrupar la agenda
```

## Seguridad

Sin login en el MVP: el panel y su API son solo para la red de casa y Tailscale. No lo expongas a internet.

## Convención de commits

`<tipo>: <descripción en español>` — `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
