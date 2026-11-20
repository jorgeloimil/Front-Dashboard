import { agruparPorDia, textoHorario } from "../../utils/agenda";
import type { Agenda, Recurso } from "../../types";
import Aviso from "../ui/Aviso";
import Panel from "../ui/Panel";

interface Props {
  agenda: Recurso<Agenda>;
  ahora: Date;
  dias: number;
}

/** Agenda familiar (datos reales). Hoy sale siempre; el resto de días solo si tienen algo; hace scroll por dentro. */
export default function AgendaPanel({ agenda: { data, loading, error }, ahora, dias: numDias }: Props) {
  const dias = data ? agruparPorDia(data, ahora) : [];
  const caidos = data?.calendarios.filter((c) => !c.ok) ?? [];

  return (
    <Panel titulo="Agenda" detalle={`Próximos ${numDias} días`} cuerpo="overflow-y-auto no-scrollbar" className="max-lg:max-h-[26rem]">
      {error && <Aviso>{error}</Aviso>}
      {caidos.map((c) => (
        <Aviso key={c.nombre}>{`El calendario "${c.nombre}" no se ha podido actualizar${c.error ? `: ${c.error}` : ""}`}</Aviso>
      ))}
      {loading && !data && <p className="text-crema-300">Cargando…</p>}
      {data && data.calendarios.length === 0 && (
        <Aviso tono="info">
          No hay ningún calendario conectado. Configura AGENDA_CALENDARIOS_0_URL en el backend (mira el README).
        </Aviso>
      )}
      {dias.map((dia) => (
        <section key={dia.fecha} aria-label={dia.titulo} className="mb-1">
          <h3 className="mt-1.5 text-xs uppercase tracking-[.1em] text-crema-400">{dia.titulo}</h3>
          {dia.eventos.length === 0 ? (
            <p className="py-1.5 text-base text-crema-400">Nada apuntado</p>
          ) : (
            <ul>
              {dia.eventos.map((evento) => (
                <li
                  key={`${evento.calendario}-${evento.inicio}-${evento.titulo}`}
                  className="flex items-center gap-2.5 border-b border-crema-700 py-1.5 last:border-b-0"
                >
                  <i aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: evento.color }} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[17px] leading-tight">{evento.titulo}</span>
                    <span className="block truncate text-[13px] text-crema-400">
                      {textoHorario(evento, dia.fecha)}
                      {evento.ubicacion && ` · 📍 ${evento.ubicacion}`}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </Panel>
  );
}
