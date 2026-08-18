import {useEffect, useState} from "react";
import LoadingSpinner from "../common/LoadingSpinner.jsx";
import {getEventList} from "../../api/common/EventApi.js";
import {Link} from "react-router-dom";
import {LuCalendarDays} from "react-icons/lu";
import {formatingDate} from "../../utils/dateUtils.js";

export default function PublishedEventList() {
    const [loading, setLoading] = useState(true);

    const [eventList, setEventList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getEventList();
                setEventList(res);
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

    if (eventList.length === 0) {
        return (
            <div className="flex min-h-80 items-center justify-center">
                <p className="text-sm text-muted">
                    현재 진행 중인 이벤트가 없습니다...
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {eventList.map((event) => (
                    <Link key={event.eventId} to={`/event/${event.eventId}`} className="group block">

                        {/* 포스터 */}
                        <div className="relative aspect-[5/3] overflow-hidden rounded-2xl bg-primary">
                            <img src={`${import.meta.env.VITE_API_SERVER}/uploads/${event.posterUrl}`}
                                 className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
                            {/* hover시 효과 */}
                            <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20"/>
                        </div>

                        {/* 이벤트 정보 */}
                        <div className="px-1 pt-4">
                            <h2 className="truncate text-lg font-semibold text-white
                                transition group-hover:text-primary">
                                {event.title}
                            </h2>

                            <p className="mt-2 line-clamp-1 text-sm leading-6 text-muted">
                                {event.description}
                            </p>

                            <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                                <LuCalendarDays className="shrink-0 text-base"/>
                                <span>
                                    {formatingDate(event.startAt)} ~ {formatingDate(event.endAt)}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}