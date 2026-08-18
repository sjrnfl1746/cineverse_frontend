import {useAuthStore} from "../../store/authStore.js";
import ProfileMenu from "./ProfileMenu.jsx";

export default function ProfileButton({ref, isOpen, setIsOpen}) {
    const {user} = useAuthStore();

    return (
        <>
            <div ref={ref} className="relative flex items-center">

                {/* 프로필 버튼 */}
                <button type="button" onClick={() => setIsOpen((prev) => !prev)}
                        className="h-6 w-6 bg-white rounded-full cursor-pointer
                        bg-gradient-to-r from-primary to-secondary transition duration-200">
                </button>

                {/* 드롭다운 */}
                {isOpen && (
                    <div className="absolute right-0 top-full z-50 mt-4 w-64 overflow-hidden rounded-2xl
                        border border-white/10 bg-black/95 shadow-2xl shadow-black/40 backdrop-blur-xl">

                        {/* 사용자 정보 */}
                        <div className="flex items-center gap-3 px-4 py-4">
                            <div
                                className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-r from-primary to-secondary"/>
                            {/* 이름 / 이메일 */}
                            <div className="min-w-0">
                                <p className="truncate font-semibold text-white">
                                    {user.nickname}
                                </p>
                                <p className="truncate text-xs text-muted">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="h-px bg-white/10"/>

                        {/* 메뉴 리스트 */}
                        <ProfileMenu/>
                    </div>
                )}
            </div>
        </>
    )
}