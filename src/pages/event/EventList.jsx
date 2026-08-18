import TitleDesc from "../../components/common/TitleDesc.jsx";
import {useEffect, useState} from "react";
import PublishedEventList from "../../components/event/PublishedEventList.jsx";
import WinnerList from "../../components/event/WinnerList.jsx";
import {LuCalendarDays, LuSparkles, LuTrophy} from "react-icons/lu";
import {useLocation} from "react-router-dom";
import {toast} from "sonner";

export default function EventList() {
    const location = useLocation();
    const [selectedPage, setSelectedPage] = useState(0);

    const tabs = [
        {
            id: 0,
            label: '진행 중인 이벤트',
            shortLabel: '진행 중',
            icon: LuCalendarDays,
        },
        {
            id: 1,
            label: '당첨자 발표',
            shortLabel: '당첨자 발표',
            icon: LuTrophy,
        },
    ]

    useEffect(() => {
        if (location.state?.notExistingEvent) {
            toast.error('잘못된 접근입니다.');
        }
        if (location.state?.notExistWinner) {
            toast.error('잘못된 접근입니다.');
        }
    }, [])

    return (
        <>
            <main className="min-h-screen px-5 py-10 text-white sm:px-8 lg:px-12">
                <section className="relative mx-auto max-w-[1600px]">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                        <TitleDesc label={'EVENTS'} title={'이벤트'} description={selectedPage === 0 ?
                            '지금 참여할 수 있는 특별한 이벤트를 만나보세요' : '이벤트 행운의 주인공을 확인해 보세요'}/>

                        {/* 탭 */}
                        <div className="relative grid w-full grid-cols-2 rounded-2xl border border-border bg-white/[0.04]
                            p-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:w-[370px]">

                            {/* 선택 탭 배경 */}
                            <span className={`absolute bottom-1.5 top-1.5 w-[calc(50%)] rounded-xl border border-border
                                bg-white/[0.10] shadow-lg transition-transform duration-300 ease-out
                                ${selectedPage === 0 ? 'translate-x-0' : 'translate-x-full'}`}/>
                            {tabs.map(({id, label, shortLabel, icon: Icon}) => {
                                const selected = selectedPage === id;

                                return (
                                    <button key={id} type="button" onClick={() => setSelectedPage(id)}
                                            className={`relative z-10 flex cursor-pointer items-center justify-center gap-2
                                                rounded-xl px-3 py-3 text-sm font-semibold transition-colors duration-300
                                                ${selected ? "text-white" : "text-muted hover:text-white"}`}>
                                        <Icon
                                            className={`text-lg transition ${selected ? "text-primary" : "text-muted"}`}/>

                                        <span className="hidden sm:inline">
                                            {label}
                                        </span>
                                        <span className="sm:hidden">
                                            {shortLabel}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 선택된 메뉴 정보 */}
                    <div className="mt-10 flex items-center gap-3 border-b border-border pb-5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full
                            bg-primary/10 text-primary">
                            <LuSparkles/>
                        </span>

                        <div>
                            <p className="text-sm font-semibold text-white">
                                {selectedPage === 0 ? '현재 참여 가능한 이벤트' : '최근 당첨자 발표'}
                            </p>
                            <p className="mt-0.5 text-xs text-muted">
                                {selectedPage === 0 ? '이벤트 카드를 선택하면 자세한 내용을 확인할 수 있습니다.' :
                                    '발표 내용을 선택하면 당첨자와 안내사항을 확인할 수 있습니다.'}
                            </p>
                        </div>
                    </div>

                    {/* 콘텐츠 */}
                    <div>
                        {selectedPage === 0 ? (<PublishedEventList/>) : (<WinnerList/>)}
                    </div>
                </section>
            </main>
        </>
    )
}