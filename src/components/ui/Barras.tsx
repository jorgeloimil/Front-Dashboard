interface Props {
  valores: { etiqueta?: string; importe: number }[];
  /** Último valor = periodo actual (en tomate). */
  tope?: number;
  alto?: number;
  etiquetaTope?: string;
  descripcion: string;
}

/** Barras sencillas de gasto; `tope` dibuja la línea discontinua del límite. */
export default function Barras({ valores, tope, alto = 110, etiquetaTope, descripcion }: Props) {
  const max = Math.max(...valores.map((v) => v.importe), tope ?? 0) * 1.1;
  const hayEtiquetas = valores.some((v) => v.etiqueta);
  const pie = hayEtiquetas ? 20 : 0;
  const util = alto - pie;
  return (
    <div role="img" aria-label={descripcion} className="relative mt-auto flex items-end gap-2.5" style={{ height: alto }}>
      {tope !== undefined && (
        <div className="absolute inset-x-0 border-t-2 border-dashed border-ambar" style={{ bottom: pie + (tope / max) * util }}>
          {etiquetaTope && <span className="absolute -top-5 right-0 text-xs text-ambar">{etiquetaTope}</span>}
        </div>
      )}
      {valores.map((v, i) => (
        <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1 text-xs text-crema-400">
          <i
            className={`block w-full rounded-t ${i === valores.length - 1 ? "bg-tomate-500" : "bg-crema-700"}`}
            style={{ height: (v.importe / max) * util }}
          />
          {hayEtiquetas && <span>{v.etiqueta}</span>}
        </div>
      ))}
    </div>
  );
}
