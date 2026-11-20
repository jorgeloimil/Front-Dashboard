import { useClock } from "../hooks/useClock";
import { formatFechaLarga, formatHora } from "../utils/format";

export default function Reloj() {
  const ahora = useClock();
  return (
    <div className="flex min-w-0 items-baseline">
      <time dateTime={ahora.toISOString()} className="font-display shrink-0 text-[34px] leading-none tabular-nums" data-testid="hora">
        {formatHora(ahora)}
      </time>
      <span className="ml-3.5 truncate text-[17px] text-crema-300 max-sm:ml-2 max-sm:text-sm" data-testid="fecha">
        {formatFechaLarga(ahora)}
      </span>
    </div>
  );
}
