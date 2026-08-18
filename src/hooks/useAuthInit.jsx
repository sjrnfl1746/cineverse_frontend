import {useAuthStore} from "../store/authStore.js";
import {useEffect} from "react";
import {meApi} from "../api/common/UserApi.js";

export default function useAuthInit() {
    const {isLogin, setUser, logout} = useAuthStore();

    useEffect(() => {

        if (!isLogin) {
            return;
        }

        const init = async () => {
            try {
                const res = await meApi();
                setUser(res);
            } catch (error) {
                // 401 -> 로그인 안된 상태: 저장 - 로그인 안되어 있으면 콘솔창에 401 에러가 뜸(정상임)
                if (error.response?.status === 401) {
                    logout();
                    return;
                }

                // 그 외의 예외 - 에러
                console.error('에러 발생', error);
            }
        }

        init();
    }, [isLogin, setUser, logout]);
}