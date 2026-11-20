import { fitcinaService } from "../services/fitcina.service";
import { useFetch } from "./useFetch";
import { usePolling } from "./usePolling";

/** El backend guarda la lectura de Fitcina 2 min: preguntar cada 5 no la agobia y se ve el cambio pronto. */
const REFRESCO_MS = 5 * 60_000;

/** Lo que toca entrenar hoy según Fitcina. */
export function useFitcina() {
  const resultado = useFetch(() => fitcinaService.hoy(), []);
  usePolling(resultado.reload, REFRESCO_MS);
  return resultado;
}
