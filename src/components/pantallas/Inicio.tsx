import type { LucesDemo } from "../../hooks/useLucesDemo";
import type { useCompra } from "../../hooks/useCompra";
import type { Agenda, FitcinaHoy, Recurso, Tiempo } from "../../types";
import AgendaPanel from "../paneles/AgendaPanel";
import CompraResumen from "../paneles/CompraResumen";
import { GastoMesPanel, MenuPanel, TareasPanel } from "../paneles/EjemplosInicio";
import FitcinaPanel from "../paneles/FitcinaPanel";
import LucesResumen from "../paneles/LucesResumen";
import WeatherPanel from "../paneles/WeatherPanel";
import type { Pantalla } from "../BarraNavegacion";

interface Props {
  ahora: Date;
  diasAgenda: number;
  agenda: Recurso<Agenda>;
  compra: ReturnType<typeof useCompra>;
  tiempo: Recurso<Tiempo>;
  fitcina: Recurso<FitcinaHoy>;
  luces: LucesDemo;
  ir: (pantalla: Pantalla) => void;
  alElegirEscena: (id: string) => void;
}

/** Inicio: ocho tarjetas, 4×2, que caben en 1280×800 sin scroll de página. */
export default function Inicio({ ahora, diasAgenda, agenda, compra, tiempo, fitcina, luces, ir, alElegirEscena }: Props) {
  return (
    <div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto p-3 sm:p-4 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[1.3fr_1fr] lg:overflow-hidden">
      <AgendaPanel agenda={agenda} ahora={ahora} dias={diasAgenda} />
      <CompraResumen compra={compra} alAbrir={() => ir("compra")} />
      <WeatherPanel tiempo={tiempo} />
      <LucesResumen luces={luces} alAbrir={() => ir("luces")} alElegirEscena={alElegirEscena} />
      <FitcinaPanel fitcina={fitcina} />
      <MenuPanel />
      <TareasPanel />
      <GastoMesPanel alAbrir={() => ir("compra")} />
    </div>
  );
}
