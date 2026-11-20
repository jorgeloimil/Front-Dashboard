import { useEffect } from "react";
import { TICKET_EJEMPLO } from "../data/ejemplos";
import { formatEuros } from "../utils/format";
import { Ejemplo } from "./ui/Pill";

/**
 * Flujo de registrar un ticket. EJEMPLO: enseña cómo quedará (foto o captura → líneas leídas →
 * corregir → guardar), pero todavía no hay lectura del ticket ni dónde guardarlo.
 */
export default function TicketModal({ alCerrar }: { alCerrar: () => void }) {
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => e.key === "Escape" && alCerrar();
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [alCerrar]);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-crema-950/80" onClick={alCerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Registrar ticket"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[96%] w-[640px] max-w-[94%] overflow-y-auto rounded-2xl border-2 border-crema-300 bg-crema-800 p-4 shadow-duro-lg sm:p-[22px]"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl">Registrar ticket</h2>
          <Ejemplo />
        </div>
        <p className="text-sm text-crema-400">Próximamente. Así quedará: se lee el ticket y corriges lo que falle antes de guardar.</p>
        <div className="my-3.5 grid grid-cols-2 gap-3">
          <button type="button" disabled className="h-16 rounded-[10px] border-2 border-crema-300 text-[17px] font-bold opacity-50">
            📷 Hacer foto
          </button>
          <button type="button" disabled className="h-16 rounded-[10px] border-2 border-crema-300 text-[17px] font-bold opacity-50">
            🖼️ Subir captura
          </button>
        </div>
        <div className="rounded-md bg-crema-50 px-[18px] py-3.5 font-mono text-[15px] text-tinta" aria-label="Ticket de ejemplo">
          {TICKET_EJEMPLO.lineas.map((l) => (
            <div key={l.concepto} className="flex justify-between py-0.5">
              <span>{l.concepto}</span>
              <span>{l.importe.toFixed(2).replace(".", ",")}</span>
            </div>
          ))}
          <div className="mt-1.5 flex justify-between border-t-2 border-dashed border-tinta pt-1.5 font-bold">
            <span>TOTAL</span>
            <span>{formatEuros(TICKET_EJEMPLO.total)}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap justify-end gap-2.5">
          <button type="button" onClick={alCerrar} className="h-[52px] rounded-[10px] border-2 border-crema-300 px-[18px] text-[17px] font-bold active:bg-crema-700">
            Cerrar
          </button>
          <button type="button" disabled className="h-[52px] rounded-[10px] border-2 border-tomate-500 bg-tomate-500 px-[18px] text-[17px] font-bold text-tinta opacity-40">
            Guardar y tachar de la lista
          </button>
        </div>
      </div>
    </div>
  );
}
