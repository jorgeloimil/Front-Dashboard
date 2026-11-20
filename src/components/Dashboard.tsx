import AgendaPanel from "./AgendaPanel";
import FitcinaPanel from "./FitcinaPanel";
import Reloj from "./Reloj";
import ShoppingPanel from "./ShoppingPanel";
import WeatherPanel from "./WeatherPanel";

/**
 * El panel de casa. Pensado para una tablet horizontal colgada: en pantallas grandes ocupa
 * justo el alto de la pantalla y cada tarjeta hace scroll por dentro; en una pantalla estrecha
 * (el móvil) se apilan.
 */
export default function Dashboard() {
  return (
    <main className="flex flex-col gap-4 p-4 lg:h-screen lg:overflow-hidden">
      <h1 className="sr-only">Panel de casa</h1>
      <Reloj />
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-12 lg:grid-rows-1">
        <ShoppingPanel className="lg:col-span-5" />
        <div className="grid min-h-0 gap-4 lg:col-span-7 lg:grid-rows-[auto_auto_minmax(0,1fr)]">
          <WeatherPanel />
          <FitcinaPanel />
          <AgendaPanel />
        </div>
      </div>
    </main>
  );
}
