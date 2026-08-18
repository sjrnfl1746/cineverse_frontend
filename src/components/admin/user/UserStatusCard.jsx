import {FaUserCheck, FaUserPlus, FaUsers, FaUserXmark} from "react-icons/fa6";

export default function UserStatusCard({status}) {
    const statusIconMap = {
        "전체 회원": <FaUsers />,
        "오늘 가입": <FaUserPlus />,
        "활성 회원": <FaUserCheck />,
        "이용 정지": <FaUserXmark />,
    }

    return (
        <>
            <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {status.title}
                        </p>

                        <p className="mt-3 text-2xl font-bold text-foreground">
                            {status.value} 명
                        </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {statusIconMap[status.title]}
                    </div>
                </div>
            </div>
        </>
    )
}