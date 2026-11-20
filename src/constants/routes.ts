// Rutas de la API. Ninguna ruta se escribe a mano fuera de aquí.
export const API_ROUTES = {
  COMPRA: {
    ARTICULOS: '/compra/articulos',
    ARTICULO: (id: number) => `/compra/articulos/${id}`,
    COMPRADOS: '/compra/articulos/comprados',
  },
  TIEMPO: '/tiempo',
  AGENDA: '/agenda',
  FITCINA_HOY: '/fitcina/hoy',
} as const;
