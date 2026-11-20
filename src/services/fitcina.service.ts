import { API_ROUTES } from "../constants/routes";
import type { FitcinaHoy } from "../types";
import { http } from "./api.client";

export const fitcinaService = {
  hoy: () => http.get<FitcinaHoy>(API_ROUTES.FITCINA_HOY),
};
