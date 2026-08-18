import {useEffect, useState} from "react";
import LoadingSpinner from "../../common/LoadingSpinner.jsx";
import {FaArrowRight} from "react-icons/fa";
import {CiCalendar} from "react-icons/ci";
import {Link} from "react-router-dom";
import {MdKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight} from "react-icons/md";
import {getEventList} from "../../../api/common/EventApi.js";

export default function HeroBanner() {
    const [loading, setLoading] = useState(true);

    // 이벤트 목록
    const [eventList, setEventList] = useState([]);

    // 현재 이벤트 번호
    const [currentIndex, setCurrentIndex] = useState(0);

    // 화면 전환 메서드
    const moveSlide = (direction) => {
        if (eventList.length <= 1) return;

        setCurrentIndex((prev) => {
            if (direction === 'next') {
                return (prev + 1) % eventList.length;
            }
            return (prev - 1 + eventList.length) % eventList.length;
        })
    }

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

    useEffect(() => {
        if (eventList.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % eventList.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [eventList.length]);

    if (loading) {
        return <LoadingSpinner/>
    }

    if (eventList.length === 0) {
        return null;
    }

    const currentEvent = eventList[currentIndex]; // 현재 보여줄 이벤트

    return (
        <section className="group relative min-h-[650px] overflow-hidden my-16 bg-white">
            {eventList.map((event, index) => (
                <div key={index} className={`absolute inset-0 transition-all duration-1000 ease-out
                    ${currentIndex === index ? 'visible scale-100 opacity-100' : 'invisible scale-105 opacity-0'}`}>
                    <img src={`${import.meta.env.VITE_API_SERVER}/uploads/${event.posterUrl}`} alt="이미지"
                         className="w-full h-full object-cover bg-primary"/>

                    <div
                        className="absolute inset-0 bg-gradient-to-r from-[#08090c]/80 via-[#08090c]/50 to-[#08090c]/10"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08090c]/80 via-transparent to-black/20"/>
                </div>
            ))}
            <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-6 pb-24 pt-20 lg:px-8">
                <div className="max-w-2xl animate-[fadeUp_.7s_ease-out]">

                    <h1 className="mt-6 max-w-2xl break-keep text-4xl font-bold leading-[1.15] tracking-[-0.04em]
                        text-white sm:text-5xl md:text-6xl">
                        {currentEvent.title}
                    </h1>

                    <div className="mt-5 flex items-center gap-2 text-sm text-white/40">
                        <CiCalendar/>
                        <div className="flex gap-1">
                            <span>
                                {currentEvent.startAt}
                            </span>
                            <span>~</span>
                            <span>
                                {currentEvent.endAt}
                            </span>
                        </div>
                    </div>

                    <div className="mt-9 flex flex-wrap gap-3">
                        <Link to={`/event/${currentEvent.eventId}`} className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 font-semibold
                            text-black transition hover:scale-[1.03] hover:bg-white/90">
                            자세히 보기
                            <FaArrowRight/>
                        </Link>

                        <Link to={'/event'} className="inline-flex items-center rounded-full border border-border bg-white/15 px-6 py-3.5
                            font-medium text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/15">
                            전체 이벤트
                        </Link>
                    </div>
                </div>
            </div>

            {/* 하단 캐러셀 컨트롤 */}
            {eventList.length > 1 && (
                <div className="absolute inset-x-0 bottom-0">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 pb-8 lg:px-8">
                        <div className="flex items-center gap-2">
                            {eventList.map((event, index) => (
                                <button key={index} type={'button'} onClick={() => setCurrentIndex(index)}
                                        className={`relative h-1 overflow-hidden rounded-full transition-all duration-500
                                ${currentIndex === index ? 'w-14 bg-primary' : 'w-5 bg-white/20 hover:bg-white/40'}`}>
                                    {currentIndex === index && (
                                        <span className={`absolute inset-y-0 left-0 rounded-full`}/>
                                    )}
                                </button>
                            ))}
                        </div>


                        <div className="flex gap-2">
                            <button type={'button'} onClick={() => moveSlide('prev')}
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border
                                bg-black/15 text-white backdrop-blur-md transition hover:border-white/35 hover:bg-white/15">
                                <MdKeyboardDoubleArrowLeft/>
                            </button>

                            <button type={'button'} onClick={() => moveSlide('next')}
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border
                                bg-black/15 text-white backdrop-blur-md transition hover:border-white/35 hover:bg-white/15">
                                <MdOutlineKeyboardDoubleArrowRight/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}