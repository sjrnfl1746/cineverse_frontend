import {RiKakaoTalkFill} from "react-icons/ri";
import {FcGoogle} from "react-icons/fc";

export default function SocialLoginButton({provider, onClick}) {
    const styles = {
        kakao: {
            label: "카카오로 로그인",
            className: "bg-[#FEE500] text-[#191919] hover:brightness-95",
            icon: <RiKakaoTalkFill className="text-xl"/>
        },
        google: {
            label: "Google로 로그인",
            className: "bg-white text-[#3C4043] border border-[#DADCE0] hover:bg-gray-100",
            icon: <FcGoogle className="text-xl"/>
        }
    }

    const current = styles[provider];

    return (
        <>
            <button type="button" onClick={onClick} className={`flex w-full items-center justify-center gap-3
                rounded-xl px-4 py-3 text-sm font-semibold transition cursor-pointer ${current.className}`}>
                {current.icon}
                {current.label}
            </button>
        </>
    )
}