import type { Recurso, Tiempo } from "../../types";
import { fechaLocal, formatDiaCorto, formatGrados, formatHora } from "../../utils/format";
import { iconoTiempo } from "../../utils/tiempo";
import Aviso from "../ui/Aviso";
import Panel from "../ui/Panel";

/** Horas y días que caben bien en una tarjeta de la tablet. */
const HORAS_VISIBLES = 5;
const DIAS_VISIBLES = 5;

/** El tiempo (datos reales de Open-Meteo vía el backend). */
export default function WeatherPanel({ tiempo: { data: tiempo, loading, error } }: { tiempo: Recurso<Tiempo> }) {
  const hoy = tiempo?.dias[0];
  return (
    <Panel titulo="El tiempo" detalle={tiempo?.ubicacion}>
      {error && <Aviso>{error}</Aviso>}
      {loading && !tiempo && <p className="text-crema-300">Cargando…</p>}
      {tiempo && (
        <>
          <div className="flex items-center gap-3" data-testid="tiempo-actual">
            <span className="text-[46px] leading-none" aria-hidden="true">
              {iconoTiempo(tiempo.actual.codigo, tiempo.actual.esDeDia)}
            </span>
            <p className="font-display text-[52px] leading-none tabular-nums">{formatGrados(tiempo.actual.temperatura)}</p>
            <div className="min-w-0 text-[13px] leading-snug text-crema-400">
              <p className="text-[15px] leading-tight text-crema-300">{tiempo.actual.descripcion}</p>
              Sensación {formatGrados(tiempo.actual.sensacion)} · {tiempo.actual.humedad} % · {Math.round(tiempo.actual.viento)} km/h
              {hoy && (
                <>
                  <br />
                  Máx {formatGrados(hoy.maxima)} · Mín {formatGrados(hoy.minima)}
                </>
              )}
            </div>
          </div>

          <ul className="mt-2.5 flex justify-between border-t border-crema-700 pt-2 text-center text-sm text-crema-300" aria-label="Próximas horas">
            {tiempo.horas.slice(0, HORAS_VISIBLES).map((hora) => (
              <li key={hora.hora} className="flex flex-col items-center">
                {formatHora(hora.hora).slice(0, 2)}h
                <span className="text-xl" aria-hidden="true">
                  {iconoTiempo(hora.codigo, tiempo.actual.esDeDia)}
                </span>
                {formatGrados(hora.temperatura)}
              </li>
            ))}
          </ul>
          <ul className="mt-2 flex justify-between border-t border-crema-700 pt-2 text-center text-sm text-crema-300" aria-label="Próximos días">
            {tiempo.dias.slice(0, DIAS_VISIBLES).map((dia, i) => (
              <li key={dia.fecha} className="flex flex-col items-center">
                <b className="font-bold text-crema-50">{i === 0 ? "Hoy" : formatDiaCorto(fechaLocal(dia.fecha))}</b>
                <span className="text-xl" aria-hidden="true" title={dia.descripcion}>
                  {iconoTiempo(dia.codigo)}
                </span>
                {formatGrados(dia.maxima)}
              </li>
            ))}
          </ul>
        </>
      )}
    </Panel>
  );
}
