import { type SyntheticEvent, useState } from "react";
import { CATEGORIAS } from "../../constants/categorias";
import type { useCompra } from "../../hooks/useCompra";
import type { ArticuloCompra } from "../../types";
import Aviso from "../ui/Aviso";
import Casilla from "../ui/Casilla";
import Panel from "../ui/Panel";

/** La lista de la compra compartida (datos reales), agrupada por pasillo. */
export default function ListaCompra({ compra }: { compra: ReturnType<typeof useCompra> }) {
  const { articulos, loading, error, guardando, anadir, marcar, quitar, quitarComprados } = compra;
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");

  const pendientes = articulos.filter((a) => !a.comprado);
  const comprados = articulos.filter((a) => a.comprado);

  async function enviar(evento: SyntheticEvent) {
    evento.preventDefault();
    const limpio = nombre.trim();
    if (!limpio) return;
    // El texto solo se borra si se guardó: si falla, no se pierde lo escrito
    if (await anadir(limpio, cantidad.trim() || undefined)) {
      setNombre("");
      setCantidad("");
    }
  }

  const campo =
    "h-[52px] rounded-[10px] border-2 border-crema-700 bg-tinta px-3.5 text-lg placeholder:text-crema-500 focus:border-tomate-500 focus:outline-none";

  return (
    <Panel
      titulo="La compra"
      detalle={pendientes.length > 0 ? `${pendientes.length} por comprar` : undefined}
      cuerpo="flex flex-col"
    >
      <form onSubmit={enviar} className="mb-2.5 flex flex-wrap gap-2.5 sm:flex-nowrap">
        <input
          aria-label="Artículo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Añadir: leche, aguacates…"
          maxLength={80}
          autoComplete="off"
          className={`${campo} min-w-0 flex-1 max-sm:basis-full`}
        />
        <input
          aria-label="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          placeholder="Cant."
          maxLength={30}
          autoComplete="off"
          className={`${campo} w-24 max-sm:flex-1`}
        />
        <button
          type="submit"
          disabled={guardando || !nombre.trim()}
          className="h-[52px] rounded-[10px] border-2 border-tomate-500 bg-tomate-500 px-[18px] text-[17px] font-bold text-tinta shadow-duro active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-40"
        >
          Añadir
        </button>
        <button
          type="button"
          onClick={quitarComprados}
          disabled={comprados.length === 0}
          className="h-[52px] rounded-[10px] border-2 border-crema-300 px-[18px] text-[17px] font-bold active:bg-crema-700 disabled:opacity-40"
        >
          Limpiar
        </button>
      </form>

      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">
        {error && <Aviso>{error}</Aviso>}
        {loading && articulos.length === 0 && <p className="text-crema-300">Cargando…</p>}
        {!loading && articulos.length === 0 && !error && (
          <p className="py-8 text-center text-crema-400">La lista está vacía. ¡Apunta lo que falte!</p>
        )}

        {CATEGORIAS.map(({ codigo, nombre: titulo, icono }) => {
          const delPasillo = pendientes.filter((a) => a.categoria === codigo);
          if (delPasillo.length === 0) return null;
          return (
            <section key={codigo} aria-label={titulo}>
              <h3 className="mb-0.5 mt-2.5 text-xs uppercase tracking-[.12em] text-crema-400 first:mt-0">
                <span aria-hidden="true">{icono}</span> {titulo}
              </h3>
              <ul>
                {delPasillo.map((articulo) => (
                  <Articulo key={articulo.id} articulo={articulo} onMarcar={marcar} onQuitar={quitar} />
                ))}
              </ul>
            </section>
          );
        })}

        {comprados.length > 0 && (
          <section aria-label="Comprados">
            <h3 className="mb-0.5 mt-2.5 text-xs uppercase tracking-[.12em] text-crema-400">Comprados ({comprados.length})</h3>
            <ul>
              {comprados.map((articulo) => (
                <Articulo key={articulo.id} articulo={articulo} onMarcar={marcar} onQuitar={quitar} />
              ))}
            </ul>
          </section>
        )}
      </div>
    </Panel>
  );
}

interface ArticuloProps {
  articulo: ArticuloCompra;
  onMarcar: (articulo: ArticuloCompra) => void;
  onQuitar: (articulo: ArticuloCompra) => void;
}

/** Fila táctil grande: tocar la fila marca/desmarca; la ✕ lo quita de la lista. */
function Articulo({ articulo, onMarcar, onQuitar }: ArticuloProps) {
  const hecho = articulo.comprado;
  return (
    <li className="flex items-stretch gap-1 border-b border-crema-700">
      <button
        type="button"
        role="checkbox"
        aria-checked={hecho}
        aria-label={articulo.nombre}
        onClick={() => onMarcar(articulo)}
        className={`flex min-h-12 min-w-0 flex-1 items-center gap-3 text-left text-[19px] ${hecho ? "text-crema-400 line-through" : ""}`}
      >
        <Casilla hecha={hecho} grande />
        <span className="min-w-0 flex-1 truncate">{articulo.nombre}</span>
        {articulo.cantidad && <em className="shrink-0 text-base not-italic text-crema-400">{articulo.cantidad}</em>}
      </button>
      <button
        type="button"
        aria-label={`Quitar ${articulo.nombre}`}
        onClick={() => onQuitar(articulo)}
        className="w-12 shrink-0 text-xl text-crema-400 active:text-tomate-500"
      >
        ✕
      </button>
    </li>
  );
}
