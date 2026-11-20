// Contrato con el backend (home-dashboard-1.0.0.yml). Las fechas con hora llegan en UTC (ISO-8601).

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type CategoriaCompra =
  | 'FRUTA_VERDURA'
  | 'CARNE_PESCADO'
  | 'LACTEOS_HUEVOS'
  | 'PANADERIA'
  | 'DESPENSA'
  | 'CONGELADOS'
  | 'BEBIDAS'
  | 'LIMPIEZA'
  | 'HIGIENE'
  | 'OTROS';

export interface ArticuloCompra {
  id: number;
  nombre: string;
  cantidad: string | null;
  categoria: CategoriaCompra;
  comprado: boolean;
  creadoEn: string;
  compradoEn: string | null;
}

export interface ArticuloCompraRequest {
  nombre: string;
  cantidad?: string;
  categoria?: CategoriaCompra;
}

export interface TiempoActual {
  temperatura: number;
  sensacion: number;
  humedad: number;
  viento: number;
  codigo: number;
  descripcion: string;
  esDeDia: boolean;
}

export interface TiempoHora {
  hora: string;
  temperatura: number;
  codigo: number;
  probPrecipitacion: number;
}

export interface TiempoDia {
  fecha: string; // YYYY-MM-DD
  maxima: number;
  minima: number;
  codigo: number;
  descripcion: string;
  probPrecipitacion: number;
  amanecer: string | null;
  atardecer: string | null;
}

export interface Tiempo {
  ubicacion: string;
  actualizadoEn: string;
  actual: TiempoActual;
  horas: TiempoHora[];
  dias: TiempoDia[];
}

export interface EventoAgenda {
  titulo: string;
  inicio: string;
  fin: string; // exclusivo
  todoElDia: boolean;
  ubicacion: string | null;
  calendario: string;
  color: string;
}

export interface CalendarioAgenda {
  nombre: string;
  color: string;
  ok: boolean;
  error: string | null;
}

export interface Agenda {
  desde: string; // YYYY-MM-DD
  hasta: string; // último día incluido
  eventos: EventoAgenda[];
  calendarios: CalendarioAgenda[];
}

export type EstadoFitcina = 'OK' | 'DESACTUALIZADO' | 'NO_DISPONIBLE' | 'SIN_CONFIGURAR';
export type EstadoRutinaHoy = 'PENDIENTE' | 'EN_CURSO' | 'HECHA';

export interface RutinaHoy {
  id: number;
  nombre: string;
  emoji: string | null;
  intensidad: string | null; // BAJA | MEDIA | ALTA
  ejercicios: number;
  estado: EstadoRutinaHoy;
}

export interface FitcinaHoy {
  estado: EstadoFitcina;
  motivo: string | null; // por qué no hay datos frescos; nulo si estado es OK
  fecha: string; // YYYY-MM-DD, el "hoy" de casa
  actualizadoEn: string | null;
  rutinas: RutinaHoy[];
  rachaDias: number | null;
  sesionesSemana: number | null;
}

/** Estado de lo que se pide al servidor, tal como lo devuelven los hooks de datos. */
export interface Recurso<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
