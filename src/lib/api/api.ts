import axios from "axios";
import { refreshAccessToken } from "./auth";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

// Fallback
api.interceptors.request.use(
    (config)=>{
        if(typeof window!=="undefined"){
            const token=localStorage.getItem("access_token")

            if(token){
                config.headers.Authorization=`Bearer ${token}`;
            }
        }
        return config;
    },
    (error)=>Promise.reject(error)
)

const forceLogout = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
    }
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isAuthRoute = originalRequest?.url?.includes("/auth/login") ||
            originalRequest?.url?.includes("/auth/refreshAccessToken");

        if (error.response?.status !== 401 || isAuthRoute) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            forceLogout();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve) => {
                refreshSubscribers.push((token: string) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(api(originalRequest));
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { accessToken } = await refreshAccessToken();
            localStorage.setItem("access_token", accessToken);
            onRefreshed(accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            refreshSubscribers = [];
            forceLogout();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);