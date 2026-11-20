import type { EstadoRutinaHoy, RutinaHoy } from "../types";

export const ETIQUETA_ESTADO: Record<EstadoRutinaHoy, string> = {
  PENDIENTE: "Pendiente",
  EN_CURSO: "En curso",
  HECHA: "Hecha",
};

/** Clases de la píldora de estado: tomate pendiente, ámbar en curso, verde hecha (colores del diseño). */
export const CLASES_ESTADO: Record<EstadoRutinaHoy, string> = {
  PENDIENTE: "border-tomate-500 bg-tomate-950 text-tomate-300",
  EN_CURSO: "border-[#F2B63C] text-[#F2B63C]",
  HECHA: "border-[#7FC66B] text-[#7FC66B]",
};

const INTENSIDAD: Record<string, string> = { BAJA: "baja", MEDIA: "media", ALTA: "alta" };

/** "5 ejercicios · intensidad alta" */
export function detalleRutina(rutina: RutinaHoy): string {
  const ejercicios = `${rutina.ejercicios} ${rutina.ejercicios === 1 ? "ejercicio" : "ejercicios"}`;
  const intensidad = rutina.intensidad ? INTENSIDAD[rutina.intensidad] : undefined;
  return intensidad ? `${ejercicios} · intensidad ${intensidad}` : ejercicios;
}

/** "Racha de 3 días · 2 sesiones esta semana"; vacío si el servidor no la dio. */
export function textoRacha(racha: number | null, sesionesSemana: number | null): string {
  const partes: string[] = [];
  if (racha) partes.push(`Racha de ${racha} ${racha === 1 ? "día" : "días"}`);
  if (sesionesSemana !== null) partes.push(`${sesionesSemana} ${sesionesSemana === 1 ? "sesión" : "sesiones"} esta semana`);
  return partes.join(" · ");
}
