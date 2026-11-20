import { useClock } from "../hooks/useClock";
import { formatFechaLarga, formatHora } from "../utils/format";

export default function Reloj() {
  const ahora = useClock();
  return (
    <div className="flex items-baseline gap-4">
      <time dateTime={ahora.toISOString()} className="font-display text-6xl tabular-nums text-crema-50" data-testid="hora">
        {formatHora(ahora)}
      </time>
      <span className="text-xl text-crema-300" data-testid="fecha">
        {formatFechaLarga(ahora)}
      </span>
    </div>
  );
}
