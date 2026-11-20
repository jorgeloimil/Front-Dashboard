import { GASTO_EJEMPLO } from "../../data/ejemplos";
import type { useCompra } from "../../hooks/useCompra";
import { formatEuros } from "../../utils/format";
import ListaCompra from "../paneles/ListaCompra";
import Barras from "../ui/Barras";
import { Ejemplo } from "../ui/Pill";
import Panel from "../ui/Panel";

interface Props {
  compra: ReturnType<typeof useCompra>;
  alEscanear: () => void;
}

/** Pantalla de compra: lista real, flujo de ticket y gasto semanal (estos dos, de ejemplo). */
export default function Compra({ compra, alEscanear }: Props) {
  const g = GASTO_EJEMPLO;
  return (
    <div className="grid min-h-0 flex-1 content-start gap-3 overflow-y-auto p-3 sm:p-4 lg:grid-cols-[1.5fr_1fr] lg:overflow-hidden">
      <ListaCompra compra={compra} />
      <div className="flex flex-col gap-3 lg:min-h-0">
        <Panel titulo="Registrar ticket" detalle={<Ejemplo />}>
          <p className="mb-2.5 text-sm text-crema-400">Haz una foto o sube la captura del ticket del móvil. Lee los productos y el total.</p>
          <button
            type="button"
            onClick={alEscanear}
            className="h-[52px] w-full rounded-[10px] border-2 border-tomate-500 bg-tomate-500 text-[17px] font-bold text-tinta shadow-duro active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            📷 Escanear ticket
          </button>
        </Panel>
        <Panel titulo="Gasto semanal" detalle={<Ejemplo />} className="flex-1">
          <div className="flex h-full flex-col">
            <p className="font-display text-[40px] leading-none tabular-nums">{formatEuros(g.semanaActual)}</p>
            <p className="mt-1 text-sm text-crema-400">esta semana · tope {formatEuros(g.topeSemanal).replace(",00", "")}</p>
            <Barras
              valores={g.ultimasSemanas}
              tope={g.topeSemanal}
              etiquetaTope={`${g.topeSemanal} €`}
              descripcion="Gasto de las últimas 6 semanas (ejemplo)"
              alto={120}
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}
