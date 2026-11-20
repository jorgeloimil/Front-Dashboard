import type { Page, Route } from '@playwright/test';

/** Viernes 20 de noviembre de 2026, 13:00 en Madrid. */
export const AHORA = new Date('2026-11-20T12:00:00Z');

type Articulo = {
  id: number;
  nombre: string;
  cantidad: string | null;
  categoria: string;
  comprado: boolean;
  creadoEn: string;
  compradoEn: string | null;
};

export interface Estado {
  articulos: Articulo[];
  /** Si es true, la API de la compra responde 500. */
  compraCaida: boolean;
  /** Si es true, la agenda sale vacía y sin calendarios. */
  sinCalendarios: boolean;
  /** Lo que devuelve /api/fitcina/hoy; null = el backend responde 500. */
  fitcina: Record<string, unknown> | null;
  peticiones: string[];
}

const envoltorio = (data: unknown) => ({ success: true, message: 'Operación exitosa', data });
const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });

export const tiempo = {
  ubicacion: 'Madrid',
  actualizadoEn: '2026-11-20T12:00:00Z',
  actual: { temperatura: 11.4, sensacion: 9.8, humedad: 63, viento: 14.2, codigo: 2, descripcion: 'Parcialmente nublado', esDeDia: true },
  horas: [0, 1, 2, 3, 4, 5].map((i) => ({
    hora: `2026-11-20T${String(12 + i).padStart(2, '0')}:00:00Z`,
    temperatura: 11 + i,
    codigo: i === 4 ? 61 : 2,
    probPrecipitacion: i === 4 ? 40 : 0,
  })),
  dias: [
    { fecha: '2026-11-20', maxima: 12.5, minima: 4.2, codigo: 2, descripcion: 'Parcialmente nublado', probPrecipitacion: 40, amanecer: null, atardecer: null },
    { fecha: '2026-11-21', maxima: 10.1, minima: 5.5, codigo: 61, descripcion: 'Lluvia débil', probPrecipitacion: 80, amanecer: null, atardecer: null },
  ],
};

/** Viernes: toca Empuje (ya hecha) y Core (pendiente). */
export const fitcinaHoy = {
  estado: 'OK',
  motivo: null,
  fecha: '2026-11-20',
  actualizadoEn: '2026-11-20T12:00:00Z',
  rutinas: [
    { id: 1, nombre: 'Empuje', emoji: '💪', intensidad: 'ALTA', ejercicios: 5, estado: 'HECHA' },
    { id: 3, nombre: 'Core', emoji: null, intensidad: null, ejercicios: 1, estado: 'PENDIENTE' },
  ],
  rachaDias: 3,
  sesionesSemana: 2,
};

const agenda = (sinCalendarios: boolean) => ({
  desde: '2026-11-20',
  hasta: '2026-11-26',
  eventos: sinCalendarios
    ? []
    : [
        { titulo: 'Viaje de trabajo', inicio: '2026-11-19T09:00:00Z', fin: '2026-11-21T09:00:00Z', todoElDia: false, ubicacion: null, calendario: 'Familia', color: '#FF5A36' },
        { titulo: 'Dentista', inicio: '2026-11-23T16:15:00Z', fin: '2026-11-23T17:00:00Z', todoElDia: false, ubicacion: 'Clínica Sonrisas', calendario: 'Familia', color: '#FF5A36' },
        { titulo: 'Cumple de la abuela', inicio: '2026-11-24T23:00:00Z', fin: '2026-11-25T23:00:00Z', todoElDia: true, ubicacion: null, calendario: 'Familia', color: '#FF5A36' },
      ],
  calendarios: sinCalendarios ? [] : [{ nombre: 'Familia', color: '#FF5A36', ok: true, error: null }],
});

/**
 * Simula el backend (lista de la compra con estado, tiempo y agenda fijos) y fija el reloj
 * del navegador en AHORA. Devuelve el estado para que cada test lo inspeccione o lo rompa.
 */
export async function mockApi(page: Page, inicial: Partial<Estado> = {}): Promise<Estado> {
  const estado: Estado = { articulos: [], compraCaida: false, sinCalendarios: false, fitcina: fitcinaHoy, peticiones: [], ...inicial };
  let siguienteId = estado.articulos.reduce((max, a) => Math.max(max, a.id), 0) + 1;

  await page.clock.install({ time: AHORA });

  await page.route('**/api/tiempo', (route) => json(route, envoltorio(tiempo)));
  await page.route('**/api/fitcina/hoy', (route) =>
    estado.fitcina ? json(route, envoltorio(estado.fitcina)) : json(route, { title: 'Error interno', status: 500, detail: 'Ha ocurrido un error inesperado' }, 500),
  );
  await page.route('**/api/agenda*', (route) => json(route, envoltorio(agenda(estado.sinCalendarios))));

  await page.route('**/api/compra/articulos**', async (route) => {
    const peticion = route.request();
    const ruta = new URL(peticion.url()).pathname.replace('/api/compra/articulos', '');
    estado.peticiones.push(`${peticion.method()} ${ruta || '/'}`);

    if (estado.compraCaida) {
      return json(route, { title: 'Error interno', status: 500, detail: 'Ha ocurrido un error inesperado' }, 500);
    }
    const id = Number(ruta.replace('/', ''));
    const cuerpo = peticion.postDataJSON?.() ?? {};

    switch (peticion.method()) {
      case 'GET':
        return json(route, envoltorio(estado.articulos));
      case 'POST': {
        const nuevo: Articulo = {
          id: siguienteId++,
          nombre: cuerpo.nombre,
          cantidad: cuerpo.cantidad ?? null,
          categoria: /leche/i.test(cuerpo.nombre) ? 'LACTEOS_HUEVOS' : 'OTROS',
          comprado: false,
          creadoEn: AHORA.toISOString(),
          compradoEn: null,
        };
        estado.articulos.push(nuevo);
        return json(route, envoltorio(nuevo));
      }
      case 'PATCH': {
        const articulo = estado.articulos.find((a) => a.id === id);
        if (!articulo) return json(route, { status: 404, detail: 'No existe' }, 404);
        articulo.comprado = cuerpo.comprado;
        return json(route, envoltorio(articulo));
      }
      case 'DELETE':
        estado.articulos =
          ruta === '/comprados' ? estado.articulos.filter((a) => !a.comprado) : estado.articulos.filter((a) => a.id !== id);
        return route.fulfill({ status: 204 });
      default:
        return route.fallback();
    }
  });

  return estado;
}

export const articulo = (id: number, nombre: string, extra: Partial<Articulo> = {}): Articulo => ({
  id,
  nombre,
  cantidad: null,
  categoria: 'OTROS',
  comprado: false,
  creadoEn: AHORA.toISOString(),
  compradoEn: null,
  ...extra,
});
