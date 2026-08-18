import {LuClapperboard, LuLayoutDashboard, LuMegaphone, LuUsers} from "react-icons/lu";
import {MdOutlineCampaign} from "react-icons/md";

export const adminList = [
    {
        id: 1,
        title: '대시보드',
        icon: <LuLayoutDashboard />,
        to: '/admin/dashboard',
    },
    {
        id: 2,
        title: '콘텐츠 관리',
        icon: <LuClapperboard />,
        to: '/admin/content',
    },
    {
        id: 3,
        title: '회원 관리',
        icon: <LuUsers />,
        to: '/admin/user',
    },
    {
        id: 4,
        title: '이벤트 관리',
        icon: <MdOutlineCampaign />,
        to: '/admin/event',
    },
    {
        id: 5,
        title: '공지사항 관리',
        icon: <LuMegaphone />,
        to: '/admin/notice',
    }
]