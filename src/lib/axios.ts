import { envVars } from "@/config/env";
import type { IResponse } from "@/types";
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
const axiosInstance = axios.create({
  baseURL: `${envVars.API_URL}/api/v1`,
  withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
  config: AxiosRequestConfig;
}[] = [];

// Helper to process queued requests after refresh
const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(axios(prom.config));
    }
  });

  failedQueue = [];
};

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<IResponse<null>>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If Unauthorized and not retried already
    if (
      (error.response?.status === 401 ||
        error?.response?.data?.message === "jwt expired") &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // Queue the request until refresh is done
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token API
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/refresh-token`,
          {
            withCredentials: true,
          }
        );

        processQueue(null);

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err as AxiosError);

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
