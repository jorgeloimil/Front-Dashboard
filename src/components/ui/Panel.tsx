import type { ReactNode } from "react";

interface Props {
  titulo: string;
  /** Texto a la derecha del título (contadores, ubicación, etiqueta «Ejemplo»…). */
  detalle?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Clases del cuerpo (p. ej. scroll interno). */
  cuerpo?: string;
  /** Si se indica, toda la tarjeta es un botón táctil que lleva a otra pantalla. */
  abrir?: { etiqueta: string; alTocar: () => void };
}

/** Tarjeta del panel: borde y sombra dura (negra), el sello de Fitcina en modo oscuro. */
export default function Panel({ titulo, detalle, children, className = "", cuerpo = "", abrir }: Props) {
  return (
    <section
      aria-label={titulo}
      className={`relative flex min-w-0 lg:min-h-0 flex-col rounded-[14px] border-2 border-crema-700 bg-crema-800 px-4 py-3.5 shadow-duro ${
        abrir ? "active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#000]" : ""
      } ${className}`}
    >
      {abrir && (
        <button type="button" aria-label={abrir.etiqueta} onClick={abrir.alTocar} className="absolute inset-0 z-10 rounded-xl" />
      )}
      <header className="mb-2 flex shrink-0 items-center justify-between gap-2">
        <h2 className="text-[15px] uppercase tracking-[.06em] text-tomate-500">{titulo}</h2>
        {detalle && <span className="text-[13px] font-medium text-crema-400">{detalle}</span>}
      </header>
      <div className={`min-h-0 flex-1 ${cuerpo}`}>{children}</div>
    </section>
  );
}
