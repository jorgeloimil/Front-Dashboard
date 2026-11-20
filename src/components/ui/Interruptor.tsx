interface Props {
  encendido: boolean;
  etiqueta: string;
  alCambiar: () => void;
}

/** Interruptor táctil grande (62×36). */
export default function Interruptor({ encendido, etiqueta, alCambiar }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={encendido}
      aria-label={etiqueta}
      onClick={alCambiar}
      className={`relative h-9 w-[62px] shrink-0 rounded-full border-2 ${encendido ? "border-tomate-500 bg-tomate-500" : "border-crema-300 bg-transparent"}`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-[3px] top-[3px] h-[26px] w-[26px] rounded-full transition-transform ${
          encendido ? "translate-x-[26px] bg-tinta" : "bg-crema-300"
        }`}
      />
    </button>
  );
}
