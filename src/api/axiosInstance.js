import axios from "axios";
import {useAuthStore} from "../store/authStore.js";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_SERVER,
    withCredentials: true
})

// 토큰 재발급 전용 Axios 인스턴스
const refreshClient = axios.create({
    baseURL: import.meta.env.VITE_API_SERVER,
    withCredentials: true
})

// 토큰 재발급 요청
const refreshApi = async () => {
    const res = await refreshClient.post(
        "/api/auth/refresh",
        null
    )
    return res.data;
}

// 요청 인터셉터 -> 모든 요청 직전에 실행
api.interceptors.request.use((config) => {
    const accessToken = useAuthStore.getState().accessToken;

    // 토큰 존재 시 자동으로 추가
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
})

// 응답 인터셉터 - error code 401 시 토큰 재발급
api.interceptors.response.use(
    res => res,
    async error => {
        const originRequest = error.config;

        if (!originRequest) {
            return Promise.reject(error);
        }

        const authExcludeUrls = [
            "/api/auth/login",
            "/api/auth/signup",
            "/api/auth/refresh",
            "/api/auth/email/send",
        ];

        const isAuthRequest = authExcludeUrls.some((url) =>
            originRequest.url?.includes(url)
        );

        if (error.response?.status === 401 &&
            !originRequest._retry &&
            !isAuthRequest) {
            originRequest._retry = true;

            try {
                const token = await refreshApi();

                useAuthStore.getState().setToken(token.accessToken);

                originRequest.headers = originRequest.headers ?? {};
                originRequest.headers.Authorization =
                    `Bearer ${token.accessToken}`;

                return api(originRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();

                window.location.replace("/auth/login");

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;