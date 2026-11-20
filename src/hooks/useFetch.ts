import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Carga datos al montar y cada vez que cambian `deps`, con estado de carga y error. Si llegan
 * respuestas fuera de orden, solo cuenta la de la última petición. `reload` recarga sin vaciar
 * lo que ya se ve (el panel nunca parpadea a "cargando" en un refresco).
 */
export function useFetch<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastRequest = useRef(0);

  const reload = useCallback(async () => {
    const request = ++lastRequest.current;
    try {
      const result = await load();
      if (request === lastRequest.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (request === lastRequest.current) setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      if (request === lastRequest.current) setLoading(false);
    }
  }, deps); // `load` se recrea en cada render: lo que manda son las `deps` de quien llama

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, setData, loading, error, setError, reload };
}
