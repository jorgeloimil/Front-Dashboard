import { useCallback, useEffect, useRef, useState } from "react";

/** Mensaje breve que se apaga solo. */
export function useToast(ms = 2400) {
  const [mensaje, setMensaje] = useState<string | null>(null);
  const temporizador = useRef<number | undefined>(undefined);

  const avisar = useCallback(
    (texto: string) => {
      setMensaje(texto);
      window.clearTimeout(temporizador.current);
      temporizador.current = window.setTimeout(() => setMensaje(null), ms);
    },
    [ms],
  );

  useEffect(() => () => window.clearTimeout(temporizador.current), []);
  return { mensaje, avisar };
}
