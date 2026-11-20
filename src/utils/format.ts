const HORA = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false });
const FECHA_LARGA = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" });
const DIA_SEMANA = new Intl.DateTimeFormat("es-ES", { weekday: "short" });
const DIA_Y_NUMERO = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric" });

/** "17:15" */
export const formatHora = (fecha: Date | string) => HORA.format(new Date(fecha));

/** "viernes, 20 de noviembre" */
export const formatFechaLarga = (fecha: Date) => capitalizar(FECHA_LARGA.format(fecha));

/** Día de la semana abreviado para la previsión: "sáb". */
export const formatDiaCorto = (fecha: Date) => DIA_SEMANA.format(fecha).replace(".", "");

/** "lunes 23" */
export const formatDiaYNumero = (fecha: Date) => capitalizar(DIA_Y_NUMERO.format(fecha));

export const capitalizar = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

/** Grados sin decimales ("11°"); evita "-0". */
export const formatGrados = (grados: number) => `${Math.round(grados) || 0}°`;

/** "YYYY-MM-DD" en la zona de la tablet (no en UTC: a las 00:30 de casa ya es otro día). */
export function claveDia(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/** Un "YYYY-MM-DD" como fecha local a medianoche (new Date("2026-11-20") lo daría en UTC). */
export function fechaLocal(clave: string): Date {
  const [anio, mes, dia] = clave.split("-").map(Number);
  return new Date(anio, mes - 1, dia);
}
