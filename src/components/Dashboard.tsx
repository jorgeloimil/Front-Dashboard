import { useState } from "react";
import { useAgenda } from "../hooks/useAgenda";
import { useClock } from "../hooks/useClock";
import { useCompra } from "../hooks/useCompra";
import { useFitcina } from "../hooks/useFitcina";
import { useLucesDemo } from "../hooks/useLucesDemo";
import { useTiempo } from "../hooks/useTiempo";
import { useToast } from "../hooks/useToast";
import { calcularAvisos } from "../utils/avisos";
import BarraNavegacion, { type Pantalla } from "./BarraNavegacion";
import Compra from "./pantallas/Compra";
import Inicio from "./pantallas/Inicio";
import Luces from "./pantallas/Luces";
import Reloj from "./Reloj";
import TicketModal from "./TicketModal";
import Pill from "./ui/Pill";

const DIAS_AGENDA = 7;

/**
 * El panel de casa, pensado para una tablet horizontal (1280×800) colgada: una barra
 * superior, la pantalla activa y la navegación táctil abajo. Los datos se piden aquí arriba
 * para que sigan al día (y no vuelvan a cargar) al cambiar de pantalla. En una pantalla
 * estrecha (el móvil) las tarjetas se apilan y la pantalla hace scroll.
 */
export default function Dashboard() {
  const [pantalla, setPantalla] = useState<Pantalla>("inicio");
  const [ticketAbierto, setTicketAbierto] = useState(false);
  const ahora = useClock(60_000);
  const compra = useCompra();
  const tiempo = useTiempo();
  const agenda = useAgenda(DIAS_AGENDA);
  const fitcina = useFitcina();
  const luces = useLucesDemo();
  const { mensaje, avisar } = useToast();

  const avisos = calcularAvisos(compra, tiempo, agenda, fitcina);
  const conProblemas = avisos.length > 0;

  function elegirEscena(id: string) {
    const escena = luces.aplicarEscena(id);
    if (escena) avisar(`Escena (ejemplo): ${escena.nombre}`);
  }

  return (
    <main className="relative mx-auto flex h-dvh min-h-0 w-full max-w-[1920px] flex-col overflow-hidden bg-tinta">
      <h1 className="sr-only">Panel de casa</h1>
      <header className="flex h-16 shrink-0 items-center justify-between border-b-2 border-crema-700 gap-3 px-3 sm:px-[22px]">
        <Reloj />
        <div className="flex shrink-0 items-center gap-3 text-[15px] text-crema-300 sm:gap-[18px]">
          {conProblemas && (
            <button type="button" onClick={() => avisar(avisos.join(" · "))} className="rounded-full">
              <Pill tono="ambar">{avisos.length === 1 ? "1 aviso" : `${avisos.length} avisos`}</Pill>
            </button>
          )}
          <span>
            <i aria-hidden="true" className={`mr-1.5 inline-block h-[9px] w-[9px] rounded-full ${conProblemas ? "bg-ambar" : "bg-verde"}`} />
            <span className="max-sm:sr-only">{conProblemas ? "Con avisos" : "Todo en orden"}</span>
          </span>
        </div>
      </header>

      {pantalla === "inicio" && (
        <Inicio
          ahora={ahora}
          diasAgenda={DIAS_AGENDA}
          agenda={agenda}
          compra={compra}
          tiempo={tiempo}
          fitcina={fitcina}
          luces={luces}
          ir={setPantalla}
          alElegirEscena={elegirEscena}
        />
      )}
      {pantalla === "compra" && <Compra compra={compra} alEscanear={() => setTicketAbierto(true)} />}
      {pantalla === "luces" && <Luces luces={luces} alElegirEscena={elegirEscena} />}

      <BarraNavegacion actual={pantalla} alIr={setPantalla} />

      {ticketAbierto && <TicketModal alCerrar={() => setTicketAbierto(false)} />}
      {mensaje && (
        <div
          role="status"
          className="absolute bottom-[88px] left-1/2 z-30 max-w-[90%] -translate-x-1/2 rounded-[10px] bg-crema-50 px-[18px] py-2.5 text-center font-bold text-tinta shadow-duro"
        >
          {mensaje}
        </div>
      )}
    </main>
  );
}
