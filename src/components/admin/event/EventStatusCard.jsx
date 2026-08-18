import {LuCalendarClock, LuCalendarDays, LuCirclePlay, LuMegaphone} from "react-icons/lu";

export default function EventStatusCard({status}) {
    const statusIconMap = {
        '전체 이벤트': <LuCalendarDays/>,
        '진행 중': <LuCirclePlay/>,
        '진행 예정': <LuCalendarClock/>,
        '발표 대기': <LuMegaphone/>,
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
                            {status.value} 개
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