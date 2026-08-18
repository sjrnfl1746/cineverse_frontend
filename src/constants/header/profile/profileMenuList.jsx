import {FiCreditCard, FiSettings, FiUser} from "react-icons/fi";

export const profileMenuList = [
    {
        id: 1,
        icon: <FiUser className="text-base"/>,
        title: '내 정보',
        to: '/mypage',
    },
    {
        id: 2,
        icon: <FiCreditCard className="text-base"/>,
        title: '구독 관리',
        to: '/subscription',
    },
]