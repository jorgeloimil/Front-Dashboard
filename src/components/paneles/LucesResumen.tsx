import { ESCENAS_EJEMPLO } from "../../data/ejemplos";
import type { LucesDemo } from "../../hooks/useLucesDemo";
import Interruptor from "../ui/Interruptor";
import { Ejemplo } from "../ui/Pill";
import Panel from "../ui/Panel";

/** Tarjeta de inicio con las bombillas del despacho. DATOS DE EJEMPLO (aún sin Home Assistant). */
export default function LucesResumen({ luces, alAbrir, alElegirEscena }: { luces: LucesDemo; alAbrir: () => void; alElegirEscena: (id: string) => void }) {
  const encendidas = luces.bombillas.filter((b) => b.encendida).length;
  return (
    <Panel
      titulo="Luces"
      detalle={
        <span className="flex items-center gap-2">
          Despacho · {encendidas} de {luces.bombillas.length} <Ejemplo />
        </span>
      }
      cuerpo="flex flex-col"
    >
      {/* Tocar el hueco de la tarjeta abre la pantalla de luces; los interruptores y las escenas actúan sin cambiar de pantalla */}
      <button type="button" aria-label="Abrir las luces" onClick={alAbrir} className="absolute inset-0 rounded-xl" />
      {luces.bombillas.map((b) => (
        <div key={b.id} className="relative z-10 flex items-center gap-2.5 py-2">
          <div className="min-w-0 flex-1 text-[17px] leading-tight">
            {b.nombre}
            <small className="block text-[13px] text-crema-400">{b.encendida ? `${b.brillo} % · ${b.tono} K` : "Apagada"}</small>
          </div>
          <Interruptor encendido={b.encendida} etiqueta={b.nombre} alCambiar={() => luces.cambiar(b.id, { encendida: !b.encendida })} />
        </div>
      ))}
      <div className="relative z-10 mt-auto flex flex-wrap gap-2">
        {ESCENAS_EJEMPLO.slice(0, 3).map((e) => (
          <button
            key={e.id}
            type="button"
            aria-pressed={luces.escenaActiva === e.id}
            onClick={() => alElegirEscena(e.id)}
            className={`min-h-11 rounded-[10px] border-2 px-3.5 text-[15px] font-bold ${
              luces.escenaActiva === e.id ? "border-tomate-500 bg-tomate-500 text-tinta" : "border-crema-700"
            }`}
          >
            {e.icono} {e.nombre}
          </button>
        ))}
      </div>
    </Panel>
  );
}
