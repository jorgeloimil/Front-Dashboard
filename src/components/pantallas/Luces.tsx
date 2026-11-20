import { ESCENAS_EJEMPLO } from "../../data/ejemplos";
import type { LucesDemo } from "../../hooks/useLucesDemo";
import { colorDeTono } from "../../utils/luces";
import Interruptor from "../ui/Interruptor";
import { Ejemplo } from "../ui/Pill";
import Panel from "../ui/Panel";

/** Pantalla de luces. TODO DE EJEMPLO: aún no hay bombillas conectadas (llegarán con Home Assistant). */
export default function Luces({ luces, alElegirEscena }: { luces: LucesDemo; alElegirEscena: (id: string) => void }) {
  return (
    <div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto p-3 sm:p-4 md:grid-cols-2 md:grid-rows-[1fr_auto] lg:overflow-hidden">
      {luces.bombillas.map((b) => {
        const color = colorDeTono(b.tono);
        return (
          <Panel key={b.id} titulo={b.nombre} detalle={<Ejemplo />} cuerpo="flex flex-col justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div
                aria-hidden="true"
                className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-crema-700 text-3xl transition-[background,box-shadow]"
                style={b.encendida ? { background: color, boxShadow: `0 0 ${10 + b.brillo * 0.4}px ${color}` } : undefined}
              >
                {!b.encendida && "💡"}
              </div>
              <div className="flex-1 text-[22px] font-bold leading-tight">
                Despacho
                <small className="block text-sm font-normal text-crema-400">{b.encendida ? "Encendida" : "Apagada"}</small>
              </div>
              <Interruptor encendido={b.encendida} etiqueta={b.nombre} alCambiar={() => luces.cambiar(b.id, { encendida: !b.encendida })} />
            </div>
            <div>
              <label className="flex justify-between text-[15px] text-crema-300">
                <span>Brillo</span>
                <span>{b.brillo} %</span>
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={b.brillo}
                disabled={!b.encendida}
                aria-label={`Brillo ${b.nombre}`}
                onChange={(e) => luces.cambiar(b.id, { brillo: Number(e.target.value) })}
                className="h-11 w-full accent-tomate-500 disabled:opacity-40"
              />
            </div>
            <div>
              <label className="flex justify-between text-[15px] text-crema-300">
                <span>Tono</span>
                <span>{b.tono} K</span>
              </label>
              <div className="h-3.5 rounded-lg border-2 border-crema-700" style={{ background: "linear-gradient(90deg,#FFB46B,#FFF1DA 55%,#CFE3FF)" }} />
              <input
                type="range"
                min={2700}
                max={6500}
                step={100}
                value={b.tono}
                disabled={!b.encendida}
                aria-label={`Tono ${b.nombre}`}
                onChange={(e) => luces.cambiar(b.id, { tono: Number(e.target.value) })}
                className="h-11 w-full accent-tomate-500 disabled:opacity-40"
              />
            </div>
          </Panel>
        );
      })}
      <Panel titulo="Escenas" detalle="Despacho · ejemplo" className="md:col-span-2">
        <div className="flex flex-wrap gap-2">
          {ESCENAS_EJEMPLO.map((e) => (
            <button
              key={e.id}
              type="button"
              aria-pressed={luces.escenaActiva === e.id}
              onClick={() => alElegirEscena(e.id)}
              className={`min-h-11 rounded-[10px] border-2 px-5 py-3.5 text-lg font-bold ${
                luces.escenaActiva === e.id ? "border-tomate-500 bg-tomate-500 text-tinta" : "border-crema-700"
              }`}
            >
              {e.icono} {e.nombre}
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
