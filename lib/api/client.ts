const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000").replace(/\/$/, "");
const tokenKey = "sumifitness.access-token";
const userKey = "sumifitness.auth-user";
export const authExpiredEvent = "sumifitness:auth-expired";
export const authSessionChangedEvent = "sumifitness:auth-session-changed";

export type AuthRole = "ADMIN" | "TRAINER" | "CLIENT";

export interface AuthUser {
  id: string;
  email: string;
  role: AuthRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UploadedImage {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
}

interface ApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
    details?: Array<{ field?: string; message?: string }>;
  };
}

interface ApiRequestOptions extends RequestInit {
  authenticated?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code = "REQUEST_ERROR",
    public readonly details?: Array<{ field?: string; message?: string }>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "The request could not be completed.";
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { authenticated = true, headers: providedHeaders, ...requestOptions } = options;
  const headers = new Headers(providedHeaders);

  if (requestOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (authenticated) {
    const token = getAccessToken();
    if (!token) {
      expireSession();
      throw new ApiError("Authentication is required.", 401, "UNAUTHORIZED");
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...requestOptions,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("The API is unavailable. Confirm that the backend is running.", 0, "NETWORK_ERROR");
  }

  if (response.status === 204) return undefined as T;

  const payload = await response.json().catch(() => null) as (T & ApiErrorPayload) | null;

  if (!response.ok) {
    if (authenticated && response.status === 401) expireSession();
    throw new ApiError(
      payload?.error?.message ?? "The request could not be completed.",
      response.status,
      payload?.error?.code,
      payload?.error?.details,
    );
  }

  return payload as T;
}

export function uploadImageFile(file: File, onProgress?: (percentage: number) => void): Promise<UploadedImage> {
  const token = getAccessToken();
  if (!token) {
    expireSession();
    return Promise.reject(new ApiError("Authentication is required.", 401, "UNAUTHORIZED"));
  }

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const body = new FormData();
    body.append("image", file);

    request.open("POST", `${apiBaseUrl}/api/uploads/image`);
    request.setRequestHeader("Authorization", `Bearer ${token}`);
    request.setRequestHeader("Accept", "application/json");
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener("error", () => reject(new ApiError("The API is unavailable. Confirm that the backend is running.", 0, "NETWORK_ERROR")));
    request.addEventListener("abort", () => reject(new ApiError("The upload was cancelled.", 0, "UPLOAD_CANCELLED")));
    request.addEventListener("load", () => {
      const payload = parseJsonResponse<{ image?: UploadedImage } & ApiErrorPayload>(request.responseText);
      if (request.status < 200 || request.status >= 300 || !payload?.image) {
        if (request.status === 401) expireSession();
        reject(new ApiError(
          payload?.error?.message ?? "The image could not be uploaded.",
          request.status,
          payload?.error?.code,
          payload?.error?.details,
        ));
        return;
      }
      onProgress?.(100);
      resolve(payload.image);
    });
    request.send(body);
  });
}

export function setAuthSession(accessToken: string, user: AuthUser) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(tokenKey, accessToken);
  window.sessionStorage.setItem(userKey, JSON.stringify(user));
  window.dispatchEvent(new Event(authSessionChangedEvent));
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(tokenKey);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const value = window.sessionStorage.getItem(userKey);
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(tokenKey);
  window.sessionStorage.removeItem(userKey);
}

function expireSession() {
  clearAuthSession();
  if (typeof window !== "undefined") window.dispatchEvent(new Event(authExpiredEvent));
}

function parseJsonResponse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}
