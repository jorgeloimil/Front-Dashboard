import { useEffect, useRef } from "react";

/**
 * Repite `callback` cada `ms` y también al volver a ver la pestaña (la tablet se apaga y se
 * enciende: al despertar debe mostrar datos frescos, no esperar al siguiente intervalo).
 */
export function usePolling(callback: () => void, ms: number) {
  const guardado = useRef(callback);
  guardado.current = callback;

  useEffect(() => {
    const id = window.setInterval(() => guardado.current(), ms);
    const alVolver = () => {
      if (document.visibilityState === "visible") guardado.current();
    };
    document.addEventListener("visibilitychange", alVolver);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [ms]);
}
