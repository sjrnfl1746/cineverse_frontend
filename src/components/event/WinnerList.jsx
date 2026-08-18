import {useEffect, useState} from "react";
import LoadingSpinner from "../common/LoadingSpinner.jsx";
import {Link} from "react-router-dom";
import {getAllEventAnnounceApi} from "../../api/common/EventAnnouncementApi.js";
import {toast} from "sonner";
import Pagination from "../common/Pagination.jsx";
import {formatingDate} from "../../utils/dateUtils.js";

export default function WinnerList() {
    const [loading, setLoading] = useState(false);

    // 결과 발표 저장
    const [announcePage, setAnnouncePage] = useState(null);

    const fetchAnnounceList = async (page = 0) => {
        setLoading(true);

        try {
            const res = await getAllEventAnnounceApi({
                page: page,
            });
            setAnnouncePage(res);
        } catch (error) {
            console.error('에러 발생', error);
            setAnnouncePage(null);
            toast.error('결과 발표를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 페이지 변경
    const handlePageChange = (page) => {
        if (page < 0 || page >= announcePage.totalPage) {
            return;
        }
        fetchAnnounceList(page);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllEventAnnounceApi({
                    page: 0,
                    size: 10,
                });
                setAnnouncePage(res);
            } catch (error) {
                console.error('에러 발생', error);
                setAnnouncePage(null);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    if (loading) {
        return <LoadingSpinner/>
    }

    const announceList = announcePage?.content ?? [];

    if (announceList.length === 0) {
        return (
            <div className="flex min-h-80 items-center justify-center">
                <p className="text-sm text-muted">
                    현재 발표된 결과가 존재하지 않습니다...
                </p>
            </div>
        )
    }

    return (
        <>
            <div className="mt-6">

                {/* 데스크톱 용 */}
                <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface md:block">
                    <table className="w-full table-fixed border-collapse text-left">
                        <caption className="sr-only">
                            이벤트 당첨자 발표 목록
                        </caption>

                        <thead className="border-b border-border bg-white/[0.04]">
                        <tr className="text-xs font-semibold uppercase tracking-wide text-muted">
                            <th scope='col' className="w-24 px-6 py-4 text-center">
                                번호
                            </th>
                            <th scope='col' className="px-6 py-4">
                                제목
                            </th>
                            <th scope='col' className="w-64 px-6 py-4">
                                이벤트
                            </th>
                            <th scope='col' className="px-6 py-4 text-center">
                                발표일
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                        {announceList.map((announce, index) => (
                            <tr key={index} className="group transition-colors duration-200 hover:bg-white/[0.04]">
                                <td className="px-6 py-5 text-center text-sm text-muted">
                                    {index + 1}
                                </td>

                                <td className="px-6 py-5">
                                    <Link to={`/event/${announce.eventId}/winner`} className="block truncate text-sm font-semibold text-white
                                        transition-colors group-hover:text-primary">
                                        {announce.title}
                                    </Link>
                                </td>

                                <td className="px-6 py-5">
                                    <span className="inline-flex max-w-full rounded-full border border-border bg-white/[0.04]
                                        px-3 py-1.5 text-xs text-muted">
                                        <span className="truncate">
                                            {announce.eventTitle}
                                        </span>
                                    </span>
                                </td>

                                <td className="px-6 py-5 text-center text-sm text-muted">
                                    {formatingDate(announce.createdAt)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* 모바일 용 */}
                <div className="space-y-3 md:hidden">
                    {announceList.map((announce, index) => (
                        <Link key={index} to={`/event/${announce.eventId}/winner`} className="group block rounded-2xl border border-border
                            bg-surface p-5 transition duration-200 hover:border-primary/40 hover:bg-white/[0.05]">
                            <div className="flex items-center justify-between gap-4">
                                <span className="inline-flex max-w-[70%] rounded-full border border-border bg-white/[0.04]
                                    px-3 py-1 text-xs text-muted">
                                    <span className="truncate">
                                        {announce.eventTitle}
                                    </span>
                                </span>

                                <span className="shrink-0 text-xs text-muted">
                                    {formatingDate(announce.createdAt)}
                                </span>
                            </div>

                            <h3 className="mt-4 line-clamp-2 text-sm font-semibold leading-6 text-white
                                transition-colors group-hover:text-primary">
                                {announce.title}
                            </h3>

                            <div className="mt-4 flex items-center justify-end">

                                <span className="text-xs font-semibold text-primary">
                                    결과 확인
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* 페이지네이션 */}
                <Pagination currentPage={announcePage.number} totalPages={announcePage.totalPages}
                            first={announcePage.first} last={announcePage.last} onPageChange={handlePageChange}/>
            </div>
        </>
    )
}