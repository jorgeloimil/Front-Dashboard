import { useState } from "react";
import { GASTO_EJEMPLO, MENU_EJEMPLO, TAREAS_EJEMPLO } from "../../data/ejemplos";
import { formatEuros } from "../../utils/format";
import Barras from "../ui/Barras";
import Casilla from "../ui/Casilla";
import { Ejemplo } from "../ui/Pill";
import Panel from "../ui/Panel";

/** Menú del día. EJEMPLO: aún no hay backend de menú semanal. */
export function MenuPanel() {
  return (
    <Panel titulo="Menú de hoy" detalle={<Ejemplo />}>
      <div className="flex flex-col gap-2.5">
        {[
          ["Comida", MENU_EJEMPLO.comida],
          ["Cena", MENU_EJEMPLO.cena],
        ].map(([momento, plato]) => (
          <div key={momento} className="flex items-baseline gap-3">
            <b className="min-w-14 text-xs font-medium uppercase tracking-[.1em] text-crema-400">{momento}</b>
            <span className="text-lg leading-tight">{plato}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-crema-400">{MENU_EJEMPLO.manana}</p>
    </Panel>
  );
}

/** Tareas del hogar. EJEMPLO: el estado vive solo en memoria. */
export function TareasPanel() {
  const [tareas, setTareas] = useState(TAREAS_EJEMPLO);
  const hechas = tareas.filter((t) => t.hecha).length;
  return (
    <Panel
      titulo="Tareas"
      detalle={
        <span className="flex items-center gap-2">
          {hechas} de {tareas.length} <Ejemplo />
        </span>
      }
      cuerpo="overflow-hidden"
    >
      <ul>
        {tareas.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              role="checkbox"
              aria-checked={t.hecha}
              onClick={() => setTareas((ts) => ts.map((x) => (x.id === t.id ? { ...x, hecha: !x.hecha } : x)))}
              className={`flex min-h-9 w-full items-center gap-2.5 text-left text-[17px] ${t.hecha ? "text-crema-400 line-through" : ""}`}
            >
              <Casilla hecha={t.hecha} />
              {t.nombre}
            </button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/** Gasto del súper del mes. EJEMPLO. Tocarla abre la pantalla de compra. */
export function GastoMesPanel({ alAbrir }: { alAbrir: () => void }) {
  const g = GASTO_EJEMPLO;
  return (
    <Panel
      titulo={`Súper · ${g.mes}`}
      detalle={<Ejemplo />}
      abrir={{ etiqueta: "Abrir gasto del súper", alTocar: alAbrir }}
    >
      <div className="flex h-full flex-col">
        <p className="font-display text-[40px] leading-none tabular-nums">{formatEuros(g.gastado)}</p>
        <p className="mt-1 text-sm text-crema-400">
          de {formatEuros(g.previsto).replace(",00", "")} previstos · te quedan {formatEuros(g.previsto - g.gastado)}
        </p>
        <Barras valores={g.semanasMes.map((importe) => ({ importe }))} alto={62} descripcion="Gasto por semanas de este mes (ejemplo)" />
      </div>
    </Panel>
  );
}
