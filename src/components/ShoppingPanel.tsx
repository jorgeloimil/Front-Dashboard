import { type SyntheticEvent, useState } from "react";
import { CATEGORIAS } from "../constants/categorias";
import { useCompra } from "../hooks/useCompra";
import type { ArticuloCompra } from "../types";
import Aviso from "./ui/Aviso";
import Panel from "./ui/Panel";

interface Props {
  className?: string;
}

export default function ShoppingPanel({ className }: Props) {
  const { articulos, loading, error, guardando, anadir, marcar, quitar, quitarComprados } = useCompra();
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

  return (
    <Panel
      titulo="La compra"
      detalle={pendientes.length > 0 ? `${pendientes.length} por comprar` : undefined}
      className={className}
    >
      <form onSubmit={enviar} className="mb-4 flex gap-2">
        <input
          aria-label="Artículo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Añadir a la lista…"
          maxLength={80}
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl border-2 border-crema-50 bg-crema-900 px-4 py-3 text-lg placeholder:text-crema-500 focus:border-tomate-500 focus:outline-none"
        />
        <input
          aria-label="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          placeholder="Cant."
          maxLength={30}
          autoComplete="off"
          className="w-24 rounded-xl border-2 border-crema-50 bg-crema-900 px-3 py-3 text-lg placeholder:text-crema-500 focus:border-tomate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={guardando || !nombre.trim()}
          className="rounded-xl border-2 border-crema-50 bg-tomate-500 px-5 text-lg font-bold text-tinta shadow-[3px_3px_0_#FFF6E5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-40"
        >
          Añadir
        </button>
      </form>

      {error && <Aviso>{error}</Aviso>}
      {loading && articulos.length === 0 && <p className="text-crema-300">Cargando…</p>}
      {!loading && articulos.length === 0 && !error && (
        <p className="py-8 text-center text-crema-400">La lista está vacía. ¡Apunta lo que falte!</p>
      )}

      <div className="flex flex-col gap-4">
        {CATEGORIAS.map(({ codigo, nombre: titulo, icono }) => {
          const delPasillo = pendientes.filter((a) => a.categoria === codigo);
          if (delPasillo.length === 0) return null;
          return (
            <section key={codigo} aria-label={titulo}>
              <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-crema-300">
                <span aria-hidden="true">{icono}</span> {titulo}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {delPasillo.map((articulo) => (
                  <Articulo key={articulo.id} articulo={articulo} onMarcar={marcar} onQuitar={quitar} />
                ))}
              </ul>
            </section>
          );
        })}

        {comprados.length > 0 && (
          <section aria-label="Comprados">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-crema-500">Comprados ({comprados.length})</h3>
              <button
                type="button"
                onClick={quitarComprados}
                className="rounded-lg border-2 border-crema-400 px-3 py-1 text-sm text-crema-200 active:bg-crema-700"
              >
                Limpiar
              </button>
            </div>
            <ul className="flex flex-col gap-1.5">
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
    <li className="flex items-stretch gap-1.5">
      <button
        type="button"
        role="checkbox"
        aria-checked={hecho}
        aria-label={articulo.nombre}
        onClick={() => onMarcar(articulo)}
        className={`flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-xl border-2 px-3 text-left active:translate-y-0.5 ${
          hecho ? "border-crema-50/20 bg-transparent text-crema-500" : "border-crema-50/60 bg-crema-900"
        }`}
      >
        <span
          aria-hidden="true"
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 ${
            hecho ? "border-tomate-500 bg-tomate-500 text-tinta" : "border-crema-50"
          }`}
        >
          {hecho && "✓"}
        </span>
        <span className={`min-w-0 flex-1 truncate text-lg ${hecho ? "line-through" : ""}`}>{articulo.nombre}</span>
        {articulo.cantidad && <span className="shrink-0 text-crema-300">{articulo.cantidad}</span>}
      </button>
      <button
        type="button"
        aria-label={`Quitar ${articulo.nombre}`}
        onClick={() => onQuitar(articulo)}
        className="w-12 shrink-0 rounded-xl border-2 border-crema-50/20 text-xl text-crema-400 active:bg-tomate-900"
      >
        ✕
      </button>
    </li>
  );
}
