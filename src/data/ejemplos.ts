// Datos de EJEMPLO para lo que todavía no tiene backend (luces, menú, tareas, gasto, ticket).
// Se pintan siempre con la etiqueta «Ejemplo»: nada de aquí viene del servidor ni se guarda.

export interface Bombilla {
  id: "escritorio" | "techo";
  nombre: string;
  encendida: boolean;
  /** 1–100 */
  brillo: number;
  /** Temperatura de color en kelvin: 2700 cálido – 6500 frío */
  tono: number;
}

export type AjusteEscena = readonly [encendida: boolean, brillo: number, tono: number];

export interface Escena {
  id: string;
  icono: string;
  nombre: string;
  ajustes: Record<Bombilla["id"], AjusteEscena>;
}

export const BOMBILLAS_EJEMPLO: Bombilla[] = [
  { id: "escritorio", nombre: "Lámpara del escritorio", encendida: true, brillo: 80, tono: 4000 },
  { id: "techo", nombre: "Luz del techo", encendida: false, brillo: 100, tono: 3000 },
];

export const ESCENAS_EJEMPLO: Escena[] = [
  { id: "trabajo", icono: "💻", nombre: "Trabajo", ajustes: { escritorio: [true, 100, 5000], techo: [true, 100, 5000] } },
  { id: "lectura", icono: "📖", nombre: "Lectura", ajustes: { escritorio: [true, 70, 3500], techo: [false, 0, 3000] } },
  { id: "relax", icono: "🌙", nombre: "Relax", ajustes: { escritorio: [true, 30, 2700], techo: [false, 0, 2700] } },
  { id: "cine", icono: "🎬", nombre: "Cine", ajustes: { escritorio: [true, 10, 2700], techo: [false, 0, 2700] } },
  { id: "off", icono: "⏻", nombre: "Apagar todo", ajustes: { escritorio: [false, 0, 3000], techo: [false, 0, 3000] } },
];

export const MENU_EJEMPLO = {
  comida: "Lentejas con verduras",
  cena: "Tortilla de calabacín y ensalada",
  manana: "Mañana: arroz al horno · pizza casera",
};

export const TAREAS_EJEMPLO = [
  { id: 1, nombre: "Sacar la basura", hecha: true },
  { id: 2, nombre: "Regar las plantas", hecha: true },
  { id: 3, nombre: "Poner lavadora (tarifa valle)", hecha: false },
  { id: 4, nombre: "Pagar comunidad", hecha: false },
  { id: 5, nombre: "Llamar al fontanero", hecha: true },
];

export const GASTO_EJEMPLO = {
  mes: "noviembre",
  gastado: 212.4,
  previsto: 280,
  /** Gasto de las últimas semanas del mes (la última es la actual). */
  semanasMes: [66, 52, 80, 58, 40],
  semanaActual: 37.1,
  topeSemanal: 70,
  ultimasSemanas: [
    { etiqueta: "S44", importe: 62 },
    { etiqueta: "S45", importe: 48 },
    { etiqueta: "S46", importe: 75 },
    { etiqueta: "S47", importe: 54 },
    { etiqueta: "S48", importe: 81 },
    { etiqueta: "S49", importe: 37 },
  ],
};

export const TICKET_EJEMPLO = {
  lineas: [
    { concepto: "LECHE ENTERA 1L", importe: 1.09 },
    { concepto: "AGUACATE 2U", importe: 2.98 },
    { concepto: "PAN BARRA", importe: 0.65 },
    { concepto: "YOGUR NAT. x4", importe: 1.35 },
    { concepto: "DETERGENTE", importe: 4.5 },
  ],
  total: 10.57,
};
