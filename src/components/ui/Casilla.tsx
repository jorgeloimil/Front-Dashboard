/** Casilla de marcar (solo dibujo; el botón que la contiene lleva el rol y el nombre). */
export default function Casilla({ hecha, grande = false }: { hecha: boolean; grande?: boolean }) {
  const medida = grande ? "h-[26px] w-[26px] text-base" : "h-[22px] w-[22px] text-sm";
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-md border-2 leading-none ${medida} ${
        hecha ? "border-tomate-500 bg-tomate-500 text-tinta" : "border-crema-300"
      }`}
    >
      {hecha && "✓"}
    </span>
  );
}
