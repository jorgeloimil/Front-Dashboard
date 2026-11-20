import type { FitcinaHoy, Recurso } from "../../types";
import { formatHora } from "../../utils/format";
import { CLASES_ESTADO, detalleRutina, ETIQUETA_ESTADO, textoRacha } from "../../utils/fitcina";
import Aviso from "../ui/Aviso";
import Panel from "../ui/Panel";

/**
 * "Hoy toca…": la rutina del día de Fitcina (datos reales). Si Fitcina no responde o no está
 * configurada la tarjeta lo dice con un aviso, pero nunca rompe el resto del panel.
 */
export default function FitcinaPanel({ fitcina: { data, loading, error } }: { fitcina: Recurso<FitcinaHoy> }) {
  const sinDatos = data?.estado === "NO_DISPONIBLE" || data?.estado === "SIN_CONFIGURAR";
  const racha = data && !sinDatos ? textoRacha(data.rachaDias, data.sesionesSemana) : "";

  return (
    <Panel titulo="Hoy toca…" detalle="Fitcina" cuerpo="overflow-y-auto no-scrollbar" className="max-lg:max-h-[26rem]">
      {error && <Aviso>{error}</Aviso>}
      {loading && !data && !error && <p className="text-crema-300">Cargando…</p>}

      {data?.estado === "SIN_CONFIGURAR" && (
        <Aviso tono="info">Fitcina no está conectada. Configura FITCINA_EMAIL y FITCINA_PASSWORD en el backend (mira el README).</Aviso>
      )}
      {data?.estado === "NO_DISPONIBLE" && <Aviso>{`Fitcina no responde${data.motivo ? `: ${data.motivo}` : ""}`}</Aviso>}
      {data?.estado === "DESACTUALIZADO" && (
        <Aviso tono="info">{`Fitcina no responde; datos de las ${data.actualizadoEn ? formatHora(data.actualizadoEn) : "—"}`}</Aviso>
      )}

      {data && !sinDatos && (
        <>
          {racha && <p className="mb-1.5 text-sm text-crema-300">{racha}</p>}
          {data.rutinas.length === 0 ? (
            <p className="text-lg text-crema-300" data-testid="fitcina-descanso">
              <span aria-hidden="true">😴 </span>Hoy toca descansar
            </p>
          ) : (
            <ul aria-label="Rutinas de hoy">
              {data.rutinas.map((rutina) => (
                <li key={rutina.id} className="flex items-center gap-2.5 border-b border-crema-700 py-1.5 last:border-b-0">
                  <span className="text-2xl" aria-hidden="true">
                    {rutina.emoji ?? "🏋️"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[17px] font-semibold leading-tight">{rutina.nombre}</span>
                    <span className="block truncate text-[13px] text-crema-400">{detalleRutina(rutina)}</span>
                  </span>
                  <span className={`shrink-0 rounded-full border-2 px-2.5 text-xs font-medium leading-5 ${CLASES_ESTADO[rutina.estado]}`}>
                    {ETIQUETA_ESTADO[rutina.estado]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Panel>
  );
}
