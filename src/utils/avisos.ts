import type { Agenda, FitcinaHoy } from "../types";
import { formatHora } from "./format";

interface Recurso<T> {
  data: T | null;
  error: string | null;
}

/** Lo que va mal ahora mismo, para la píldora «N avisos» de la barra superior. */
export function calcularAvisos(
  compra: { error: string | null },
  tiempo: Recurso<unknown>,
  agenda: Recurso<Agenda>,
  fitcina: Recurso<FitcinaHoy>,
): string[] {
  const avisos: string[] = [];
  if (compra.error) avisos.push(`La compra: ${compra.error}`);
  if (tiempo.error) avisos.push(`El tiempo: ${tiempo.error}`);
  if (agenda.error) avisos.push(`Agenda: ${agenda.error}`);
  for (const c of agenda.data?.calendarios ?? []) {
    if (!c.ok) avisos.push(`El calendario «${c.nombre}» no se ha podido actualizar`);
  }
  if (fitcina.error) avisos.push(`Fitcina: ${fitcina.error}`);
  if (fitcina.data?.estado === "NO_DISPONIBLE") avisos.push("Fitcina no responde");
  if (fitcina.data?.estado === "DESACTUALIZADO") {
    avisos.push(`Fitcina no responde; datos de las ${fitcina.data.actualizadoEn ? formatHora(fitcina.data.actualizadoEn) : "—"}`);
  }
  return avisos;
}
