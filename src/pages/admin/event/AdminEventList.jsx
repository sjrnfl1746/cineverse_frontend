import TitleLabel from "../../../components/admin/TitleLabel.jsx";
import {Link, useLocation} from "react-router-dom";
import {LuPlus} from "react-icons/lu";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import {eventSummaryApi, getEventListApi} from "../../../api/admin/AdminEventApi.js";
import EventStatusCard from "../../../components/admin/event/EventStatusCard.jsx";
import Select from "../../../components/common/Select.jsx";
import InputLabel from "../../../components/common/InputLabel.jsx";
import Button from "../../../components/common/Button.jsx";
import {eventStatusList} from "../../../constants/admin/eventStatusList.js";
import {formatingDate} from "../../../utils/dateUtils.js";
import Pagination from "../../../components/common/Pagination.jsx";
import EventStatusBadge from "../../../components/admin/event/EventStatusBadge.jsx";

export default function AdminEventList() {
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    const [eventSummary, setEventSummary] = useState(null);
    const [eventPage, setEventPage] = useState(null);

    // 검색
    const [eventStatus, setEventStatus] = useState('');
    const [keyword, setKeyword] = useState('');

    const fetchEventList = async (page = 0) => {
        const search = {
            eventStatus: eventStatus?.trim() || null,
            keyword: keyword || null,
            page,
            size: 10,
        }

        setLoading(true);

        try {
            const res = await getEventListApi(search);
            setEventPage(res);
        } catch (error) {
            console.error('에러 발생', error);
            setEventPage(null);
            toast.error('이벤트를 불러오는데 실패했습니다.')
        } finally {
            setLoading(false);
        }
    }

    // 이벤트 검색
    const handleSearch = async () => {
        if (eventStatus.trim() === '') {
            toast.error('이벤트 상태를 선택해주세요.');
            return;
        }
        if (keyword.trim() === '') {
            toast.error('검색어를 입력해주세요.');
            return;
        }
        fetchEventList(0); // 첫 페이지 부터 조회
    }

    // 페이지 변경
    const handlePageChange = (page) => {
        if (page < 0 || page >= eventPage.totalPages) {
            return;
        }
        fetchEventList(page)
    }

    useEffect(() => {
        const fetchInitData = async () => {
            try {
                const summary = await eventSummaryApi();
                setEventSummary(summary);

                const res = await getEventListApi({
                    eventStatus: null,
                    keyword: null,
                    page: 0,
                    size: 10,
                });
                setEventPage(res);
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchInitData();
    }, [])

    useEffect(() => {
        if (location.state?.addEventSuccess) {
            toast.success('이벤트를 등록했습니다.');
        }
        if (location.state?.notExistingEvent) {
            toast.error('잘못된 접근입니다.');
        }
        if (location.state?.deleteEventSuccess) {
            toast.success('이벤트를 삭제했습니다.');
        }

    }, [])

    if (loading) {
        return <LoadingSpinner/>
    }

    const eventList = eventPage.content ?? [];

    return (
        <>
            <TitleLabel title={'이벤트 관리'} desc={'이벤트 및 당첨자 발표를 관리합니다.'}>
                <Link to={'add'} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5
                    text-sm font-semibold text-white transition hover:bg-primary-hover">
                    <LuPlus className='text-base'/>
                    이벤트 등록
                </Link>
            </TitleLabel>

            {/* 이벤트 요약 카드 */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {eventSummary.map((event) => (
                    <EventStatusCard key={event.title} status={event}/>
                ))}
            </section>

            {/* 이벤트 검색 */}
            <section className="mt-8 rounded-2xl border border-border p-5">
                <div className="flex items-end gap-4">
                    <div className="w-32">
                        <Select name="eventStatus" value={eventStatus} onChange={(e) => setEventStatus(e.target.value)}
                                options={eventStatusList}/>
                    </div>
                    <div className="flex-1">
                        <InputLabel type='text' name='keyword' value={keyword} placeholder='이벤트명을 검색해주세요'
                                    onChange={(e) => setKeyword(e.target.value)}/>
                    </div>
                    <div className="w-32">
                        <Button type="button" label='검색' onClick={handleSearch}/>
                    </div>
                </div>
            </section>

            {/* 이벤트 목록 */}
            <section className="mt-6 overflow-hidden rounded-2xl border border-border">
                {!eventPage ? (
                    <div className="py-16 text-center text-muted">
                        이벤트를 불러오지 못했습니다...
                    </div>
                ) : (
                    eventList.length === 0 ? (
                        <div className="py-16 text-center text-muted">
                            검색 조건에 해당하는 이벤트가 존재하지 않습니다...
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px]">
                                    <thead className="bg-background/50">
                                    <tr className="border-b border-border text-left text-sm text-muted">
                                        <th className="px-6 py-4">제목</th>
                                        <th className="px-6 py-4">상태</th>
                                        <th className="px-6 py-4">기간</th>
                                        <th className="px-6 py-4">생성일</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {eventList.map((event) => (
                                        <tr key={event.eventId}
                                            className="border-b border-border last:border-b-0 hover:bg-background/40">
                                            <td className="px-6 py-4">
                                                {event.title}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-foreground">
                                                <EventStatusBadge status={event.eventStatus}/>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-foreground">
                                                {formatingDate(event.startAt)} ~ {formatingDate(event.endAt)}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-foreground">
                                                {formatingDate(event.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link to={`${event.eventId}`} className="border border-border rounded-lg p-3 py-2 text-sm text-foreground
                                                    transition hover:border-primary hover:text-primary cursor-pointer">
                                                    상세 보기
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination currentPage={eventPage.number} totalPages={eventPage.totalPages}
                                        first={eventPage.first}
                                        last={eventPage.last}
                                        onPageChange={handlePageChange}/>
                        </>
                    )
                )}
            </section>
        </>
    )
}