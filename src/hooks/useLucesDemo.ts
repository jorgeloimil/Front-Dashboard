import { useCallback, useState } from "react";
import { BOMBILLAS_EJEMPLO, ESCENAS_EJEMPLO, type Bombilla } from "../data/ejemplos";

/**
 * Luces de EJEMPLO: solo estado en memoria para ver cómo quedará la pantalla. Cuando llegue
 * Home Assistant se sustituye por un hook que hable con el backend.
 */
export function useLucesDemo() {
  const [bombillas, setBombillas] = useState<Bombilla[]>(BOMBILLAS_EJEMPLO);
  const [escenaActiva, setEscenaActiva] = useState<string | null>(null);

  const cambiar = useCallback((id: Bombilla["id"], cambios: Partial<Bombilla>) => {
    setBombillas((actuales) => actuales.map((b) => (b.id === id ? { ...b, ...cambios } : b)));
    setEscenaActiva(null);
  }, []);

  const aplicarEscena = useCallback((id: string) => {
    const escena = ESCENAS_EJEMPLO.find((e) => e.id === id);
    if (!escena) return undefined;
    setBombillas((actuales) =>
      actuales.map((b) => {
        const [encendida, brillo, tono] = escena.ajustes[b.id];
        return { ...b, encendida, brillo: encendida ? brillo : b.brillo, tono };
      }),
    );
    setEscenaActiva(id);
    return escena;
  }, []);

  return { bombillas, escenaActiva, cambiar, aplicarEscena };
}

export type LucesDemo = ReturnType<typeof useLucesDemo>;
