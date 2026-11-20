import type { ReactNode } from "react";

interface Props {
  titulo: string;
  /** Texto a la derecha del título (contadores, ubicación…). */
  detalle?: ReactNode;
  acciones?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Tarjeta del panel: borde crema y sombra dura, el sello de Fitcina. */
export default function Panel({ titulo, detalle, acciones, children, className = "" }: Props) {
  return (
    <section
      aria-label={titulo}
      className={`flex min-h-0 flex-col rounded-2xl border-2 border-crema-50 bg-crema-800 shadow-[4px_4px_0_#FF5A36] ${className}`}
    >
      <header className="flex items-center gap-3 border-b-2 border-crema-50/20 px-5 py-3">
        <h2 className="text-xl text-crema-50">{titulo}</h2>
        {detalle && <span className="text-sm text-crema-300">{detalle}</span>}
        <div className="ml-auto flex items-center gap-2">{acciones}</div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar p-4">{children}</div>
    </section>
  );
}
