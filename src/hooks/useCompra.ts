import { useCallback, useState } from "react";
import { compraService } from "../services/compra.service";
import type { ArticuloCompra } from "../types";
import { useFetch } from "./useFetch";
import { usePolling } from "./usePolling";

/** Otras personas apuntan desde su móvil: la lista se refresca sola cada 30 s. */
const REFRESCO_MS = 30_000;

/** Lista de la compra compartida: cambios al instante en pantalla y confirmados después por el servidor. */
export function useCompra() {
  const { data, setData, loading, error, setError, reload } = useFetch(() => compraService.listar(), []);
  const [guardando, setGuardando] = useState(false);
  usePolling(reload, REFRESCO_MS);

  const articulos = data ?? [];

  /** Ejecuta una acción; si falla, avisa y vuelve a pedir la lista para no quedarse con un estado falso. */
  const intentar = useCallback(
    async (accion: () => Promise<unknown>) => {
      try {
        await accion();
        setError(null);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        return false;
      } finally {
        await reload();
      }
    },
    [reload, setError],
  );

  const anadir = useCallback(
    async (nombre: string, cantidad?: string) => {
      setGuardando(true);
      try {
        return await intentar(() => compraService.anadir({ nombre, ...(cantidad ? { cantidad } : {}) }));
      } finally {
        setGuardando(false);
      }
    },
    [intentar],
  );

  const marcar = useCallback(
    (articulo: ArticuloCompra) => {
      setData((actuales) => (actuales ?? []).map((a) => (a.id === articulo.id ? { ...a, comprado: !a.comprado } : a)));
      return intentar(() => compraService.marcar(articulo.id, !articulo.comprado));
    },
    [intentar, setData],
  );

  const quitar = useCallback(
    (articulo: ArticuloCompra) => {
      setData((actuales) => (actuales ?? []).filter((a) => a.id !== articulo.id));
      return intentar(() => compraService.quitar(articulo.id));
    },
    [intentar, setData],
  );

  const quitarComprados = useCallback(() => {
    setData((actuales) => (actuales ?? []).filter((a) => !a.comprado));
    return intentar(() => compraService.quitarComprados());
  }, [intentar, setData]);

  return { articulos, loading, error, guardando, anadir, marcar, quitar, quitarComprados };
}
