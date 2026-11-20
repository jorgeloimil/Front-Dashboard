import type { CategoriaCompra } from "../types";

/** Pasillos en el orden en que se recorre el súper (el mismo que ordena el backend). */
export const CATEGORIAS: { codigo: CategoriaCompra; nombre: string; icono: string }[] = [
  { codigo: "FRUTA_VERDURA", nombre: "Fruta y verdura", icono: "🥬" },
  { codigo: "CARNE_PESCADO", nombre: "Carne y pescado", icono: "🥩" },
  { codigo: "LACTEOS_HUEVOS", nombre: "Lácteos y huevos", icono: "🥛" },
  { codigo: "PANADERIA", nombre: "Panadería", icono: "🥖" },
  { codigo: "DESPENSA", nombre: "Despensa", icono: "🥫" },
  { codigo: "CONGELADOS", nombre: "Congelados", icono: "🧊" },
  { codigo: "BEBIDAS", nombre: "Bebidas", icono: "🥤" },
  { codigo: "LIMPIEZA", nombre: "Limpieza", icono: "🧽" },
  { codigo: "HIGIENE", nombre: "Higiene", icono: "🧴" },
  { codigo: "OTROS", nombre: "Otros", icono: "🛒" },
];
