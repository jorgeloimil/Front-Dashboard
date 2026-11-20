/** Icono (emoji) de un código WMO de Open-Meteo. */
export function iconoTiempo(codigo: number, esDeDia = true): string {
  if (codigo === 0) return esDeDia ? "☀️" : "🌙";
  if (codigo === 1) return esDeDia ? "🌤️" : "🌙";
  if (codigo === 2) return esDeDia ? "⛅" : "☁️";
  if (codigo === 3) return "☁️";
  if (codigo === 45 || codigo === 48) return "🌫️";
  if (codigo >= 51 && codigo <= 57) return "🌦️";
  if ((codigo >= 61 && codigo <= 67) || (codigo >= 80 && codigo <= 82)) return "🌧️";
  if ((codigo >= 71 && codigo <= 77) || codigo === 85 || codigo === 86) return "❄️";
  if (codigo >= 95) return "⛈️";
  return "🌡️";
}
