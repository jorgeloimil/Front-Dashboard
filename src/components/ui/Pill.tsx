import type { ReactNode } from "react";

const TONOS = {
  neutro: "border-crema-700 text-crema-300",
  tomate: "border-tomate-500 bg-tomate-950 text-tomate-500",
  ambar: "border-ambar text-ambar",
  verde: "border-verde text-verde",
} as const;

interface Props {
  tono?: keyof typeof TONOS;
  children: ReactNode;
  className?: string;
}

/** Píldora pequeña: estados y la etiqueta «Ejemplo» de lo que aún no tiene backend. */
export default function Pill({ tono = "neutro", children, className = "" }: Props) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full border-2 px-3 py-[1px] text-sm font-medium ${TONOS[tono]} ${className}`}>
      {children}
    </span>
  );
}

/** Marca fija para datos de relleno: deja claro que no son reales. */
export const Ejemplo = () => <Pill tono="ambar" className="!px-2 !py-0 !text-xs">Ejemplo</Pill>;
