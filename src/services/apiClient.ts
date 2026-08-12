import { auth } from "@/lib/firebase";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "https://ai-resume-backend-pknw.onrender.com").replace(/\/$/, "");

async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getIdToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Add timeout for AI operations (they can take longer)
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60 second timeout

  try {
    const res = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `HTTP ${res.status}`);
    }

    return res.json();
  } catch (fetchError: unknown) {
    clearTimeout(timeout);
    if (fetchError instanceof Error && fetchError.name === 'AbortError') {
      throw new Error("Request timed out. The server may be waking up - please try again.");
    }
    if (fetchError instanceof TypeError && fetchError.message === 'Failed to fetch') {
      throw new Error("Cannot connect to server. It may be waking up from sleep - please wait a moment and try again.");
    }
    throw fetchError;
  }
}

export const api = {
  get<T>(path: string, options?: RequestInit) {
    return request<T>(path, options);
  },
  post<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  },
  put<T>(path: string, body?: unknown) {
    return request<T>(path, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body)
    });
  },
  delete<T>(path: string) {
    return request<T>(path, { method: "DELETE" });
  }
};
