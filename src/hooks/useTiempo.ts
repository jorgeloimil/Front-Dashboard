import { tiempoService } from "../services/tiempo.service";
import { useFetch } from "./useFetch";
import { usePolling } from "./usePolling";

/** El servidor ya guarda el tiempo 10 min: preguntar cada 10 min no gasta nada. */
const REFRESCO_MS = 10 * 60_000;

export function useTiempo() {
  const resultado = useFetch(() => tiempoService.obtener(), []);
  usePolling(resultado.reload, REFRESCO_MS);
  return resultado;
}
