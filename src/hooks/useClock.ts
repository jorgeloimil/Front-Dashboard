import { useEffect, useState } from "react";

/** La hora actual, refrescada cada `ms` (15 s: basta para un reloj sin segundos). */
export function useClock(ms = 15_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return now;
}
