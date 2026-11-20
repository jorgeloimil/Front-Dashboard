import { useTiempo } from "../hooks/useTiempo";
import { fechaLocal, formatDiaCorto, formatGrados, formatHora } from "../utils/format";
import { iconoTiempo } from "../utils/tiempo";
import Aviso from "./ui/Aviso";
import Panel from "./ui/Panel";

/** Horas y días que caben bien en la tablet. */
const HORAS_VISIBLES = 6;
const DIAS_VISIBLES = 5;

export default function WeatherPanel() {
  const { data: tiempo, loading, error } = useTiempo();

  return (
    <Panel titulo="El tiempo" detalle={tiempo?.ubicacion}>
      {error && <Aviso>{error}</Aviso>}
      {loading && !tiempo && <p className="text-crema-300">Cargando…</p>}
      {tiempo && (
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-8">
          <div className="flex items-center gap-4" data-testid="tiempo-actual">
            <span className="text-6xl" aria-hidden="true">
              {iconoTiempo(tiempo.actual.codigo, tiempo.actual.esDeDia)}
            </span>
            <div>
              <p className="font-display text-5xl tabular-nums">{formatGrados(tiempo.actual.temperatura)}</p>
              <p className="text-crema-200">{tiempo.actual.descripcion}</p>
              <p className="text-sm text-crema-400">
                Sensación {formatGrados(tiempo.actual.sensacion)} · {tiempo.actual.humedad} % · {Math.round(tiempo.actual.viento)} km/h
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <ul className="flex gap-2 overflow-x-auto no-scrollbar" aria-label="Próximas horas">
              {tiempo.horas.slice(0, HORAS_VISIBLES).map((hora) => (
                <li key={hora.hora} className="flex min-w-12 flex-1 flex-col items-center rounded-lg bg-crema-900 py-2">
                  <span className="text-xs text-crema-400">{formatHora(hora.hora)}</span>
                  <span aria-hidden="true">{iconoTiempo(hora.codigo, tiempo.actual.esDeDia)}</span>
                  <span className="font-semibold tabular-nums">{formatGrados(hora.temperatura)}</span>
                  <span className="text-xs text-crema-400">{hora.probPrecipitacion > 0 ? `💧${hora.probPrecipitacion}%` : " "}</span>
                </li>
              ))}
            </ul>
            <ul className="flex gap-2 overflow-x-auto no-scrollbar" aria-label="Próximos días">
              {tiempo.dias.slice(0, DIAS_VISIBLES).map((dia, i) => (
                <li key={dia.fecha} className="flex min-w-12 flex-1 flex-col items-center rounded-lg border border-crema-50/20 py-2">
                  <span className="text-xs uppercase text-crema-400">{i === 0 ? "Hoy" : formatDiaCorto(fechaLocal(dia.fecha))}</span>
                  <span aria-hidden="true" title={dia.descripcion}>
                    {iconoTiempo(dia.codigo)}
                  </span>
                  <span className="text-sm tabular-nums">
                    <span className="font-semibold">{formatGrados(dia.maxima)}</span>{" "}
                    <span className="text-crema-400">{formatGrados(dia.minima)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Panel>
  );
}
