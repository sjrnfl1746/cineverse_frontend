import {useEffect, useState} from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {getEventById} from "../../api/common/EventApi.js";
import {Link, useNavigate, useParams} from "react-router-dom";
import {LuCalendarDays, LuClock3} from "react-icons/lu";
import {formatingDate} from "../../utils/dateUtils.js";

export default function EventDetail() {
    const {eventId} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getEventById(eventId);
                setEvent(res);
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

    if (!event) {
        navigate('/event', {
            state: {
                notExistingEvent: true,
            }
        })
    }

    return (
        <>
            <main className="min-h-screen px-5 pb-16 pt-24 text-white sm:px-8 lg:px-12">
                <section className="mx-auto max-w-5xl">

                    {/* 제목 */}
                    <header className="border-b border-border pb-7 sm:pb-8">
                        <div className="mb-4">
                        <span
                            className="
                                inline-flex items-center
                                rounded-full bg-primary/10
                                px-3 py-1.5
                                text-xs font-semibold text-primary
                            "
                        >
                            EVENT
                        </span>
                        </div>

                        <h1
                            className="
                            break-words text-2xl font-bold
                            leading-snug tracking-tight text-white
                            sm:text-3xl lg:text-4xl
                        "
                        >
                            {event.title}
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

                            <time dateTime={event.createdAt}>
                                작성일 {formatingDate(event.createdAt)}
                            </time>
                        </div>
                    </header>

                    {/* 이벤트 기간 */}
                    <section className="border-b border-border py-6">
                        <div className="flex items-center gap-4">
                        <span
                            className="
                                flex h-11 w-11 shrink-0
                                items-center justify-center
                                rounded-xl bg-primary/10
                                text-lg text-primary
                            "
                        >
                            <LuCalendarDays />
                        </span>

                            <div>
                                <p className="text-xs font-medium text-muted">
                                    이벤트 기간
                                </p>

                                <p className="mt-1 text-sm font-semibold text-foreground sm:text-base">
                                    {formatingDate(event.startAt)}

                                    <span className="mx-2 text-muted/50">
                                    ~
                                </span>

                                    {formatingDate(event.endAt)}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 포스터 이미지 */}
                    <section className="py-10 sm:py-12">
                        <div className="mx-auto overflow-hidden rounded-2xl bg-background">
                            <img
                                src={`${import.meta.env.VITE_API_SERVER}/uploads/${event.posterUrl}`}
                                alt={`${event.title} 포스터`}
                                className="
                                block max-h-[760px] w-full
                                object-contain
                            "
                            />
                        </div>
                    </section>

                    {/* 내용 */}
                    <section className="pb-10">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-5 w-1 rounded-full bg-primary" />

                            <h2 className="font-semibold text-foreground">
                                이벤트 안내
                            </h2>
                        </div>

                        <div
                            className="
                            min-h-52 whitespace-pre-wrap
                            break-words text-base
                            leading-8 text-foreground
                            sm:text-lg sm:leading-9
                        "
                        >
                            {event.description}
                        </div>
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