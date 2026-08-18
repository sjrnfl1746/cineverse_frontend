import {Link} from "react-router-dom";
import {profileMenuList} from "../../constants/header/profile/profileMenuList.jsx";
import {FiGrid, FiLogOut} from "react-icons/fi";
import {logoutApi} from "../../api/common/AuthApi.js";
import {useAuthStore} from "../../store/authStore.js";
import {toast} from "sonner";

export default function ProfileMenu() {
    const {user, logout} = useAuthStore();

    // 로그아웃
    const handleLogout = async () => {
        try {
            await logoutApi();
            logout();
            toast.success('로그아웃 되었습니다');
        } catch (error) {
            console.error('에러 발생', error);
        }
    }

    return (
        <>
            <div className="p-2">
                {profileMenuList.map((menu) => (
                    <Link key={menu.id} to={menu.to} className="flex w-full items-center gap-3 rounded-xl
                        px-3 py-2.5 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">
                        {menu.icon}
                        {menu.title}
                    </Link>
                ))}
                {/* 관리자인 경우 접근 가능 */}
                {user?.role === 'ROLE_ADMIN' && <Link to="/admin" className="flex w-full items-center gap-3 rounded-xl
                    px-3 py-2.5 text-left text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">
                    <FiGrid className="text-base"/>
                    관리자페이지
                </Link>}

                {/* 로그아웃 */}
                <button type="button" onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left
                        text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300 cursor-pointer">
                    <FiLogOut className="text-base"/>
                    로그아웃
                </button>
            </div>
        </>
    )
}