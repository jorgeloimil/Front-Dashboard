import type { useCompra } from "../../hooks/useCompra";
import Aviso from "../ui/Aviso";
import Casilla from "../ui/Casilla";
import Panel from "../ui/Panel";

/** Tarjeta de la pantalla de inicio: lo que falta por comprar (datos reales). Tocarla abre la compra. */
export default function CompraResumen({ compra, alAbrir }: { compra: ReturnType<typeof useCompra>; alAbrir: () => void }) {
  const { articulos, loading, error } = compra;
  const pendientes = articulos.filter((a) => !a.comprado).length;
  const visibles = [...articulos].sort((a, b) => Number(a.comprado) - Number(b.comprado)).slice(0, 7);

  return (
    <Panel
      titulo="La compra"
      detalle={pendientes > 0 ? `${pendientes} por comprar` : undefined}
      abrir={{ etiqueta: "Abrir la compra", alTocar: alAbrir }}
      cuerpo="overflow-hidden"
    >
      {error && <Aviso>{error}</Aviso>}
      {loading && articulos.length === 0 && !error && <p className="text-crema-300">Cargando…</p>}
      {!loading && articulos.length === 0 && !error && <p className="text-crema-400">Lista vacía</p>}
      <ul>
        {visibles.map((a) => (
          <li key={a.id} className={`flex items-center gap-2.5 py-1.5 text-[17px] ${a.comprado ? "text-crema-400 line-through" : ""}`}>
            <Casilla hecha={a.comprado} />
            <span className="min-w-0 flex-1 truncate">{a.nombre}</span>
            {a.cantidad && <em className="shrink-0 text-sm not-italic text-crema-400">{a.cantidad}</em>}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
