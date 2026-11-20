import { API_ROUTES } from "../constants/routes";
import type { Agenda } from "../types";
import { http } from "./api.client";

export const agendaService = {
  obtener: (dias = 7) => http.get<Agenda>(API_ROUTES.AGENDA, { dias }),
};
