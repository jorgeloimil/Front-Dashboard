import type { Agenda, EventoAgenda } from "../types";
import { claveDia, fechaLocal, formatDiaYNumero, formatHora } from "./format";

export interface DiaAgenda {
  /** YYYY-MM-DD */
  fecha: string;
  /** "Hoy", "Mañana" o "Lunes 23" */
  titulo: string;
  eventos: EventoAgenda[];
}

const UN_DIA = 24 * 60 * 60 * 1000;

/** Último día (a medianoche local) que toca el evento: `fin` es exclusivo. */
function ultimoDia(inicio: Date, fin: Date): Date {
  const real = fin > inicio ? new Date(fin.getTime() - 1) : inicio;
  return new Date(real.getFullYear(), real.getMonth(), real.getDate());
}

/**
 * Reparte los eventos por días. Hoy sale siempre (aunque esté vacío); los demás días solo
 * si tienen algo. Un evento de varios días sale en cada uno.
 */
export function agruparPorDia(agenda: Agenda, ahora: Date): DiaAgenda[] {
  const hoy = claveDia(ahora);
  const manana = claveDia(new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1));
  const primero = fechaLocal(agenda.desde);
  const ultimo = fechaLocal(agenda.hasta);
  const porDia = new Map<string, EventoAgenda[]>();

  for (const evento of agenda.eventos) {
    const inicio = new Date(evento.inicio);
    const fin = new Date(evento.fin);
    const desde = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate());
    let dia = desde < primero ? primero : desde;
    const hasta = ultimoDia(inicio, fin);
    const tope = hasta > ultimo ? ultimo : hasta;
    for (; dia <= tope; dia = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate() + 1)) {
      const clave = claveDia(dia);
      porDia.set(clave, [...(porDia.get(clave) ?? []), evento]);
    }
  }

  const dias: DiaAgenda[] = [];
  const total = Math.round((ultimo.getTime() - primero.getTime()) / UN_DIA) + 1;
  for (let i = 0; i < total; i++) {
    const dia = new Date(primero.getFullYear(), primero.getMonth(), primero.getDate() + i);
    const clave = claveDia(dia);
    const eventos = porDia.get(clave) ?? [];
    if (eventos.length === 0 && clave !== hoy) continue;
    dias.push({
      fecha: clave,
      titulo: clave === hoy ? "Hoy" : clave === manana ? "Mañana" : formatDiaYNumero(dia),
      eventos,
    });
  }
  return dias;
}

/** Cuándo es el evento ese día: "Todo el día", "17:15 – 18:00", "desde 22:00" o "hasta 09:00". */
export function textoHorario(evento: EventoAgenda, dia: string): string {
  if (evento.todoElDia) return "Todo el día";
  const inicio = new Date(evento.inicio);
  const fin = new Date(evento.fin);
  const empiezaAntes = claveDia(inicio) < dia;
  const acabaDespues = claveDia(new Date(Math.max(fin.getTime() - 1, inicio.getTime()))) > dia;
  if (empiezaAntes && acabaDespues) return "Todo el día";
  if (empiezaAntes) return `hasta ${formatHora(fin)}`;
  if (acabaDespues) return `desde ${formatHora(inicio)}`;
  return fin > inicio ? `${formatHora(inicio)} – ${formatHora(fin)}` : formatHora(inicio);
}
