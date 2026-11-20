import { agendaService } from "../services/agenda.service";
import { useFetch } from "./useFetch";
import { usePolling } from "./usePolling";

const REFRESCO_MS = 5 * 60_000;

/** Eventos de hoy y de los próximos `dias` días. */
export function useAgenda(dias = 7) {
  const resultado = useFetch(() => agendaService.obtener(dias), [dias]);
  usePolling(resultado.reload, REFRESCO_MS);
  return resultado;
}
