import { API_ROUTES } from "../constants/routes";
import type { Tiempo } from "../types";
import { http } from "./api.client";

export const tiempoService = {
  obtener: () => http.get<Tiempo>(API_ROUTES.TIEMPO),
};
