export type Pantalla = "inicio" | "compra" | "luces";

const PANTALLAS: { id: Pantalla; icono: string; nombre: string }[] = [
  { id: "inicio", icono: "🏠", nombre: "Inicio" },
  { id: "compra", icono: "🛒", nombre: "Compra" },
  { id: "luces", icono: "💡", nombre: "Luces" },
];

/** Secciones que aún no existen: se ven apagadas para que se sepa lo que viene. */
const PROXIMAS = [
  { icono: "🍽️", nombre: "Menú", fase: "fase 2" },
  { icono: "🧊", nombre: "Despensa", fase: "fase 2" },
  { icono: "🏡", nombre: "Casa 3D", fase: "fase 3" },
];

const base =
  "flex min-w-0 flex-1 items-center justify-center gap-2.5 whitespace-nowrap border-r-2 border-crema-700 text-[17px] font-bold last:border-r-0 max-sm:flex-col max-sm:gap-0 max-sm:text-sm";

export default function BarraNavegacion({ actual, alIr }: { actual: Pantalla; alIr: (p: Pantalla) => void }) {
  return (
    <nav aria-label="Secciones" className="flex h-[72px] shrink-0 border-t-2 border-crema-700 bg-crema-950">
      {PANTALLAS.map((p) => (
        <button
          key={p.id}
          type="button"
          aria-current={actual === p.id ? "page" : undefined}
          onClick={() => alIr(p.id)}
          className={`${base} ${actual === p.id ? "bg-tomate-500 text-tinta" : "text-crema-300 active:bg-crema-800"}`}
        >
          <span className="text-2xl max-sm:text-xl" aria-hidden="true">{p.icono}</span>
          {p.nombre}
        </button>
      ))}
      {PROXIMAS.map((p) => (
        <button key={p.nombre} type="button" disabled className={`${base} cursor-default text-crema-500 max-md:hidden`}>
          <span className="text-2xl" aria-hidden="true">{p.icono}</span>
          {p.nombre}
          <small className="ml-0.5 max-lg:hidden rounded-md border-[1.5px] border-crema-600 px-1.5 text-[11px] font-medium">{p.fase}</small>
        </button>
      ))}
    </nav>
  );
}
