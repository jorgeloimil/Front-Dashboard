import type { ApiResponse } from "../types";

// En producción nginx redirige /api al backend; en local lo hace el proxy de Vite (astro.config.mjs)
const baseURL = import.meta.env.PUBLIC_API_URL || "/api";

/** Error de una llamada a la API: `status` 0 si no hay conexión; `detail` es el del ProblemDetail. */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type Params = Record<string, string | number | undefined>;

function buildUrl(url: string, params?: Params): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) query.append(key, String(value));
  }
  const qs = query.toString();
  return `${baseURL}${url}${qs ? `?${qs}` : ""}`;
}

async function send<T>(method: string, url: string, params?: Params, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(buildUrl(url, params), {
      method,
      headers: {
        Accept: "application/json, application/problem+json",
        ...(body !== undefined && { "Content-Type": "application/json" }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "No se puede conectar con el servidor");
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* cuerpo que no es JSON */
  }

  if (!res.ok) {
    const problema = data as { detail?: string; errors?: string[] } | null;
    throw new ApiError(res.status, problema?.errors?.[0] ?? problema?.detail ?? `Error ${res.status} del servidor`);
  }
  return data as T;
}

/** Desenvuelve el `data` del ApiResponse. */
async function sendData<T>(method: string, url: string, params?: Params, body?: unknown): Promise<T> {
  return (await send<ApiResponse<T>>(method, url, params, body)).data;
}

export const http = {
  get: <T>(url: string, params?: Params) => sendData<T>("GET", url, params),
  post: <T>(url: string, body: unknown) => sendData<T>("POST", url, undefined, body),
  patch: <T>(url: string, body: unknown) => sendData<T>("PATCH", url, undefined, body),
  delete: (url: string) => send<null>("DELETE", url),
};
