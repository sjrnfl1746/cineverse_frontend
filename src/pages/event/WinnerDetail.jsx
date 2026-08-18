import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {formatingDate} from "../../utils/dateUtils.js";
import {LuClock3} from "react-icons/lu";
import {getEventAnnounceByEventIdApi} from "../../api/common/EventAnnouncementApi.js";

export default function WinnerDetail() {
    const {eventId} = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [winner, setWinner] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getEventAnnounceByEventIdApi(eventId);
                setWinner(res);
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    if (loading) {
        return <LoadingSpinner/>
    }

    if (!winner) {
        navigate('/evnet', {
            state: {
                notExistWinner: true,
            }
        })
    }

    return (
        <>
            <main className="min-h-screen px-5 pb-16 pt-24 text-white sm:px-8 lg:px-12">
                <section className="mx-auto max-w-5xl">

                    {/* 제목 */}
                    <header className="border-b border-border pb-7 sm:pb-8">
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span
                            className="
                                inline-flex items-center
                                rounded-full bg-primary/10
                                px-3 py-1.5
                                text-xs font-semibold text-primary
                            "
                        >
                            WINNER
                        </span>

                            <span
                                className="
                                inline-flex items-center
                                rounded-full bg-amber-400/10
                                px-3 py-1.5
                                text-xs font-semibold text-amber-300
                            "
                            >
                            당첨자 발표
                        </span>
                        </div>

                        <h1
                            className="
                            break-words text-2xl font-bold
                            leading-snug tracking-tight text-white
                            sm:text-3xl lg:text-4xl
                        "
                        >
                            {winner.title}
                        </h1>

                        {/* 작성일 */}
                        <div className="mt-6 flex items-center gap-2 text-sm text-muted">
                        <span
                            className="
                                flex h-8 w-8 items-center justify-center
                                rounded-lg bg-white/5
                            "
                        >
                            <LuClock3 />
                        </span>

                            <time dateTime={winner.createdAt}>
                                작성일 {formatingDate(winner.createdAt)}
                            </time>
                        </div>
                    </header>

                    {/* 당첨자 발표 내용 */}
                    <section className="min-h-[420px] py-10 sm:py-12">
                        <div className="mb-7 flex items-center gap-3">
                            <span className="h-5 w-1 rounded-full bg-primary" />

                            <h2 className="font-semibold text-foreground">
                                당첨자 발표 내용
                            </h2>
                        </div>

                        <div
                            className="
                            whitespace-pre-wrap break-words
                            text-base leading-8 text-foreground
                            sm:text-lg sm:leading-9
                        "
                        >
                            {winner.description}
                        </div>
                    </section>

                    {/* 안내 문구 */}
                    <section
                        className="
                        mb-10 rounded-2xl
                        bg-primary/5 px-5 py-5
                        sm:px-6
                    "
                    >
                        <p className="text-sm leading-6 text-muted">
                            당첨되신 분께는 이벤트 참여 시 등록한 정보를 통해
                            별도로 안내될 수 있습니다.
                        </p>
                    </section>

                    {/* 목록 */}
                    <div className="border-t border-border pt-7">
                        <div className="flex justify-center sm:justify-end">
                            <Link
                                to="/event"
                                className="
                                inline-flex min-w-28 items-center justify-center
                                rounded-xl border border-border
                                px-5 py-3
                                text-sm font-semibold text-muted
                                transition duration-200
                                hover:border-gray-500
                                hover:bg-white/5 hover:text-white
                            "
                            >
                                목록
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}