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
