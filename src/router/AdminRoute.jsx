import {useAuthStore} from "../store/authStore.js";
import {Navigate, Outlet, useLocation} from "react-router-dom";

export default function AdminRoute({children}) { // 관리자 접근 확인 부분
    const {user, isLogin} = useAuthStore();
    const location = useLocation();

    // 로그인 확인
    if (!isLogin) {
        return (
            <Navigate to="/auth/login"
                      replace
                      state={{from: location.pathname}}/>
        );
    }

    // 관리자 권한 확인
    if (user?.role !== 'ROLE_ADMIN') {
        return <Navigate to="/403" replace/>;
    }

    return <Outlet/>;
}