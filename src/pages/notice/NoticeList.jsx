import {useEffect, useState} from "react";
import TitleDesc from "../../components/common/TitleDesc.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {getAllNoticeListApi} from "../../api/common/NoticeApi.js";
import {Link, useLocation} from "react-router-dom";
import {formatingDate} from "../../utils/dateUtils.js";
import {toast} from "sonner";
import Pagination from "../../components/common/Pagination.jsx";
import {LuCalendarDays, LuChevronRight, LuEye, LuPin} from "react-icons/lu";

export default function NoticeList() {
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const [noticePage, setNoticePage] = useState(null);

    const fetchNoticeList = async (page = 0) => {
        setLoading(true);

        try {
            const res = await getAllNoticeListApi({keyword: null, page: page});
            setNoticePage(res);
        } catch (error) {
            console.error('에러 발생', error);
            setNoticePage(null);
            toast.error('공지사항을 불러오는데 실패했습니다.')
        } finally {
            setLoading(false);
        }
    };

    // 페이지 변경
    const handlePageChange = (page) => {
        if (page < 0 || page >= noticePage.totalPage) {
            return;
        }
        fetchNoticeList(page);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllNoticeListApi({keyword: null});
                setNoticePage(res);
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        if (location.state?.notExistNotice) {
            toast.error('잘못된 접근입니다.');
        }
    })

    if (loading) {
        return <LoadingSpinner/>
    }

    const noticeList = noticePage?.content ?? [];

    if (noticeList.length === 0) {
        return (
            <>
                <main className="relative min-h-screen overflow-hidden px-5 py-10 text-white sm:px-8 lg:px-12">

                    <section className="relative mx-auto max-w-[1600px]">
                        <TitleDesc label={'NOTICES'} title={'공지사항'} description={'주요 공지사항들을 확인해주세요'}/>
                    </section>
                    <div className="flex min-h-80 items-center justify-center">
                        <p className="text-sm text-muted">
                            공지사항이 존재하지 않습니다...
                        </p>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>

            <main className="relative min-h-screen overflow-hidden px-5 py-10 text-white sm:px-8 lg:px-12">

                <section className="relative mx-auto max-w-[1600px]">
                    <TitleDesc label={'NOTICES'} title={'공지사항'} description={'주요 공지사항둘을 확인해주세요'}/>
                </section>

                <div className="mt-6">

                    {/* 데스크톱 용 */}
                    <div className="hidden overflow-hidden border-b border-border md:block">
                        <table className="w-full table-fixed border-collapse text-left">
                            <caption className="sr-only">
                                공지사항
                            </caption>

                            <thead className="border-b border-border bg-white/[0.04]">
                            <tr className="text-sm font-semibold uppercase tracking-wide text-muted">
                                <th scope="col" className="w-24 px-6 py-4 text-center">
                                </th>
                                <th scope="col" className="px-6 py-4">
                                    제목
                                </th>
                                <th scope="col" className="px-6 py-4 text-center">
                                    등록일
                                </th>
                                <th scope="col" className="px-6 py-4 text-center">
                                    조회수
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                            {noticeList.map((notice, index) => {
                                const noticeNumber = noticePage.number * noticePage.size + noticeList.slice(0, index + 1)
                                    .filter((item) => !item.pinned).length;

                                return (
                                    <tr key={index} className="group transition-colors duration-200">
                                        <td className="flex justify-center items-center px-6 py-5 text-center text-sm text-muted">
                                            {notice.pinned ? (
                                                <LuPin className="text-sm text-red-500"/>
                                            ) : (
                                                noticeNumber
                                            )}
                                        </td>

                                        <td className="px-6 py-5">
                                            <Link to={`/notice/${notice.noticeId}`} className="block truncate text-sm font-semibold text-white
                                        transition-colors group-hover:text-primary">
                                                {notice.title}
                                            </Link>
                                        </td>

                                        <td className="px-6 py-5 text-center text-sm text-muted">
                                            {formatingDate(notice.createdAt)}
                                        </td>

                                        <td className="px-6 py-5 text-center text-sm text-muted">
                                            {notice.viewCnt}
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>

                    {/* 모바일 용 */}
                    <div className="divide-y divide-border border-y border-border md:hidden">
                        {noticeList.map((notice, index) => (
                            <Link key={index} to={`/notice/${notice.noticeId}`} className="group block px-1 py-5
                                transition-colors hover:bg-white/[0.03]">

                                {/* 고정 공지 */}
                                <div className="flex items-center justify-end">
                                    {notice.pinned && (
                                        <span className="inline-flex items-center gap-11 rounded-full bg-primary/10 px-2.5
                                            text-xs font-semibold text-primary">
                                            <LuPin className="text-xs text-red-500"/>
                                        </span>
                                    )}
                                </div>

                                {/* 제목 */}
                                <div className="mt-3 flex items-center justify-between gap-4">
                                    <h2 className="line-clamp-2 flex-1 break-keep text-sm font-semibold
                                        leading-6 text-white transition-colors group-hover:text-primary">
                                        {notice.title}
                                    </h2>

                                    <LuChevronRight className="mt-1 shrink-0 text-lg' text-muted transition
                                        group-hover:translate-x-0.5 group-hover:text-primary"/>
                                </div>

                                {/* 등록일 / 조회수 */}
                                <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                                    <span className="flex items-center gap-1.5">
                                        <LuCalendarDays className="text-sm"/>
                                        {formatingDate(notice.createdAt)}
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <LuEye className="text-sm"/>
                                        {notice.viewCnt}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>


                    {/* 페이지네이션 */}
                    <Pagination currentPage={noticePage.number} totalPages={noticePage.totalPages}
                                first={noticePage.first} last={noticePage.last} onPageChange={handlePageChange}/>
                </div>
            </main>
        </>
    )
}