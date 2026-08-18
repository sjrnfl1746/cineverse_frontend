import {create} from "zustand/react";
import {createJSONStorage, persist} from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set) => ({
            accessToken: null,
            user: null,
            subscribe: false,
            isLogin: false,

            // 로그인
            login: (data) => set({
                accessToken: data.accessToken,
                user: data.user,
                subscribe: data.subscribed,
                isLogin: true,
            }),

            // user 정보 저장
            setUser: (user) => set({
                user: user,
                isLogin: true,
                subscribe: user.subscribed,
            }),

            // 로그아웃
            logout: () => set({
                accessToken: null,
                user: null,
                subscribe: false,
                isLogin: false,
            }),

            // 토큰 재설정
            setToken: (token) => set({
                accessToken: token,
            }),
        }),
        {
            name: "authStore",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);