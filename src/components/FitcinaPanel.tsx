import { useFitcina } from "../hooks/useFitcina";
import { formatHora } from "../utils/format";
import { CLASES_ESTADO, detalleRutina, ETIQUETA_ESTADO, textoRacha } from "../utils/fitcina";
import Aviso from "./ui/Aviso";
import Panel from "./ui/Panel";

/**
 * "Hoy toca…": la rutina del día de Fitcina. Si Fitcina no responde o no está configurada la
 * tarjeta lo dice con un aviso, pero nunca rompe el resto del panel.
 */
export default function FitcinaPanel({ className = "" }: { className?: string }) {
  const { data, loading, error } = useFitcina();
  const sinDatos = data?.estado === "NO_DISPONIBLE" || data?.estado === "SIN_CONFIGURAR";
  const racha = data && !sinDatos ? textoRacha(data.rachaDias, data.sesionesSemana) : "";

  return (
    <Panel titulo="Hoy toca…" detalle={racha ? `Fitcina · ${racha}` : "Fitcina"} className={className}>
      {error && <Aviso>{error}</Aviso>}
      {loading && !data && !error && <p className="text-crema-300">Cargando…</p>}

      {data?.estado === "SIN_CONFIGURAR" && (
        <Aviso tono="info">Fitcina no está conectada. Configura FITCINA_EMAIL y FITCINA_PASSWORD en el backend (mira el README).</Aviso>
      )}
      {data?.estado === "NO_DISPONIBLE" && (
        <Aviso>{`Fitcina no responde${data.motivo ? `: ${data.motivo}` : ""}`}</Aviso>
      )}
      {data?.estado === "DESACTUALIZADO" && (
        <Aviso tono="info">
          {`Fitcina no responde; datos de las ${data.actualizadoEn ? formatHora(data.actualizadoEn) : "—"}`}
        </Aviso>
      )}

      {data && !sinDatos && (
        <div className="flex flex-col gap-3">
          {data.rutinas.length === 0 ? (
            <p className="text-lg text-crema-200" data-testid="fitcina-descanso">
              <span aria-hidden="true">😴 </span>Hoy toca descansar
            </p>
          ) : (
            <ul className="grid gap-2 md:grid-cols-2" aria-label="Rutinas de hoy">
              {data.rutinas.map((rutina) => (
                <li key={rutina.id} className="flex items-center gap-3 rounded-lg bg-crema-900 px-3 py-1.5">
                  <span className="text-2xl" aria-hidden="true">
                    {rutina.emoji ?? "🏋️"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{rutina.nombre}</span>
                    <span className="block truncate text-xs text-crema-400">{detalleRutina(rutina)}</span>
                  </span>
                  <span className={`shrink-0 rounded-full border-2 px-2.5 text-xs font-medium leading-5 ${CLASES_ESTADO[rutina.estado]}`}>
                    {ETIQUETA_ESTADO[rutina.estado]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Panel>
  );
}
