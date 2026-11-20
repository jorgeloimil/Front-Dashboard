import { useAgenda } from "../hooks/useAgenda";
import { useClock } from "../hooks/useClock";
import { agruparPorDia, textoHorario } from "../utils/agenda";
import Aviso from "./ui/Aviso";
import Panel from "./ui/Panel";

const DIAS = 7;

export default function AgendaPanel() {
  const { data: agenda, loading, error } = useAgenda(DIAS);
  const ahora = useClock(60_000);
  const dias = agenda ? agruparPorDia(agenda, ahora) : [];
  const caidos = agenda?.calendarios.filter((c) => !c.ok) ?? [];

  return (
    <Panel titulo="Agenda" detalle={`próximos ${DIAS} días`}>
      {error && <Aviso>{error}</Aviso>}
      {caidos.map((c) => (
        <Aviso key={c.nombre}>{`El calendario "${c.nombre}" no se ha podido actualizar${c.error ? `: ${c.error}` : ""}`}</Aviso>
      ))}
      {loading && !agenda && <p className="text-crema-300">Cargando…</p>}
      {agenda && agenda.calendarios.length === 0 && (
        <Aviso tono="info">
          No hay ningún calendario conectado. Configura AGENDA_CALENDARIOS_0_URL en el backend (mira el README).
        </Aviso>
      )}
      <div className="flex flex-col gap-4">
        {dias.map((dia) => (
          <section key={dia.fecha} aria-label={dia.titulo}>
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-tomate-400">{dia.titulo}</h3>
            {dia.eventos.length === 0 ? (
              <p className="text-crema-400">Nada apuntado</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {dia.eventos.map((evento) => (
                  <li
                    key={`${evento.calendario}-${evento.inicio}-${evento.titulo}`}
                    className="flex items-center gap-3 rounded-lg bg-crema-900 px-3 py-2"
                    style={{ borderLeft: `6px solid ${evento.color}` }}
                  >
                    <span className="w-32 shrink-0 text-sm tabular-nums text-crema-300">{textoHorario(evento, dia.fecha)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{evento.titulo}</span>
                      {evento.ubicacion && <span className="block truncate text-xs text-crema-400">📍 {evento.ubicacion}</span>}
                    </span>
                    <span className="shrink-0 text-xs text-crema-500">{evento.calendario}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </Panel>
  );
}
