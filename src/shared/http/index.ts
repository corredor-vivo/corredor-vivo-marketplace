import axios, { type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner"

type Message = string | string[];

function showMessage(message?: Message) {
  if (!message) return;

  if (Array.isArray(message)) {
    message.forEach((item) => {
      toast.success(item);
    });
    return;
  }

  toast.success(message);
}

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let refreshing: Promise<unknown> | null = null;

http.interceptors.response.use(
  (response) => {
    showMessage(response.data?.message);

    return response;
  },

  async (error) => {
    const config = error.config as (InternalAxiosRequestConfig & { retried?: boolean }) | undefined;
    if (error.response?.status === 401 && config && !config.retried &&
      !["/account/refresh", "/account/sign-in", "/account/sign-up", "/account/logout"].includes(config.url ?? "")) {
      config.retried = true;
      try {
        refreshing ??= http.post("/account/refresh").finally(() => { refreshing = null; });
        await refreshing;
        return http.request(config);
      } catch { return Promise.reject(error); }
    }
    if (config?.url === "/account/refresh") return Promise.reject(error);
    if (error.config?.url === "/account/me" && error.response?.status === 401) {
      return Promise.reject(error);
    }

    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      message.forEach((item) => {
        toast.error(item);
      });
    } else if (message) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);
