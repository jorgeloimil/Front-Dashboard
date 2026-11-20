interface Props {
  children: string;
  tono?: "error" | "info";
}

/** Franja de aviso: errores de red o de un calendario, sin tapar el resto del panel. */
export default function Aviso({ children, tono = "error" }: Props) {
  const colores = tono === "error" ? "border-tomate-500 bg-tomate-950 text-tomate-200" : "border-crema-400 bg-crema-900 text-crema-200";
  return (
    <p role={tono === "error" ? "alert" : "status"} className={`mb-2 rounded-lg border-2 px-3 py-1.5 text-sm ${colores}`}>
      {children}
    </p>
  );
}
