import { API_ROUTES } from "../constants/routes";
import type { ArticuloCompra, ArticuloCompraRequest } from "../types";
import { http } from "./api.client";

export const compraService = {
  listar: () => http.get<ArticuloCompra[]>(API_ROUTES.COMPRA.ARTICULOS),
  anadir: (request: ArticuloCompraRequest) => http.post<ArticuloCompra>(API_ROUTES.COMPRA.ARTICULOS, request),
  marcar: (id: number, comprado: boolean) =>
    http.patch<ArticuloCompra>(API_ROUTES.COMPRA.ARTICULO(id), { comprado }),
  quitar: (id: number) => http.delete(API_ROUTES.COMPRA.ARTICULO(id)),
  quitarComprados: () => http.delete(API_ROUTES.COMPRA.COMPRADOS),
};
