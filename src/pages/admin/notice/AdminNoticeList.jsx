import {useEffect, useState} from "react";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import TitleLabel from "../../../components/admin/TitleLabel.jsx";
import {Link, useLocation} from "react-router-dom";
import {LuBell, LuCalendarDays, LuEye, LuPin, LuPlus} from "react-icons/lu";
import {getNoticeListApi} from "../../../api/admin/AdminNoticeApi.js";
import InputLabel from "../../../components/common/InputLabel.jsx";
import Select from "../../../components/common/Select.jsx";
import {contentStatusList} from "../../../constants/admin/contentStatusList.js";
import Button from "../../../components/common/Button.jsx";
import getAgeRatingLabel from "../../../components/admin/content/getAgeRatingLabel.jsx";
import ContentStatusBadge from "../../../components/admin/content/ContentStatusBadge.jsx";
import Pagination from "../../../components/common/Pagination.jsx";
import {formatingDate} from "../../../utils/dateUtils.js";
import {toast} from "sonner";

export default function AdminNoticeList() {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    // 검색 조건
    const [keyword, setKeyword] = useState('');

    const [noticePage, setNoticePage] = useState(null);

    const fetchNoticeList = async (page = 0) => {
        const search = {
            keyword: keyword?.trim() || null,
            page,
            size: 10,
        }

        setLoading(true);

        try {
            const res = await getNoticeListApi(search);
            setNoticePage(res)
        } catch (error) {
            console.error('에러 발생', error);
            setNoticePage(null);
        } finally {
            setLoading(false);
        }
    };

    // 검색 메서드
    const handleSearch = async () => {
        fetchNoticeList(0); // 첫 페이지 부터 조회
    }

    // 페이지 변경
    const handlePageChange = (page) => {
        if (page < 0 || page >= noticePage.totalPages) {
            return;
        }
        fetchNoticeList(page);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getNoticeListApi({
                    keyword: null,
                    page: 0,
                    size: 10,
                });
                setNoticePage(res || null);
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
        if (location.state?.deleteNoticeSuccess) {
            toast.success('공지를 삭제했습니다.');
        }
        if (location.state?.addNoticeSuccess) {
            toast.success('공지를 등록했습니다.');
        }
    })

    if (loading) {
        return <LoadingSpinner/>
    }

    const noticeList = noticePage?.content ?? [];

    return (
        <>
            <TitleLabel title={'공지사항 관리'} desc={'공지사항을 등록 및 수정, 삭제합니다'}>
                <Link to={'/admin/notice/add'} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5
                    text-sm font-semibold text-white transition hover:bg-primary-hover cursor-pointer">
                    <LuPlus className="text-base"/>
                    공지사항 추가
                </Link>
            </TitleLabel>

            {/* 공지 검색 */}
            <section className="mt-8 rounded-2xl border border-border bg-card p-5">
                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <InputLabel type="text" label="제목" name="keyword" value={keyword} placeholder="제목을 입력해주세요"
                                    onChange={(e) => setKeyword(e.target.value)}/>
                    </div>
                    <div className="w-32">
                        <Button type="button" label="검색" onClick={handleSearch}/>
                    </div>
                </div>
            </section>

            {/* 공지 목록 */}
            <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
                {/* 목록 상단 */}
                <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <LuBell />
                        </div>

                        <div>
                            <h2 className="font-semibold text-white">
                                공지 목록
                            </h2>
                            <p className="mt-0.5 text-xs text-muted">
                                총 {(noticePage?.totalElements ?? 0).toLocaleString()}개의 공지
                            </p>
                        </div>
                    </div>
                </div>
                {!noticePage ? (
                    <div className="py-16 text-center text-muted">
                        공지 리스트를 불러오지 못했습니다.
                    </div>
                ) : noticeList.length === 0 ? (
                    <div className="py-16 text-center text-muted">
                        검색 조건에 해당하는 공지가 없습니다.
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] table-fixed">
                                <thead className="bg-background/50">
                                <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted">
                                    <th className="w-20 px-4 py-4 text-center">
                                        구분
                                    </th>

                                    <th className="px-6 py-4">
                                        제목
                                    </th>

                                    <th className="w-44 px-4 py-4">
                                        작성일
                                    </th>

                                    <th className="w-32 px-4 py-4 text-center">
                                        조회수
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                {noticeList.map((notice) => (
                                    <tr
                                        key={notice.noticeId}
                                        className="
                                                group border-b border-border
                                                transition-colors
                                                last:border-b-0
                                                hover:bg-background/40
                                            "
                                    >
                                        <td className="px-4 py-4 text-center">
                                            {notice.pinned ? (
                                                <span
                                                    title="상단 고정 공지"
                                                    className="
                                                            inline-flex h-8 w-8
                                                            items-center justify-center
                                                            rounded-lg bg-red-500/10
                                                            text-red-400
                                                        "
                                                >
                                                        <LuPin />
                                                    </span>
                                            ) : (
                                                <span className="text-sm text-muted/50">
                                                        일반
                                                    </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            {/* 실제 상세 경로에 맞게 변경 */}
                                            <Link
                                                to={`/admin/notice/${notice.noticeId}`}
                                                className="
                                                        block truncate font-medium
                                                        text-foreground
                                                        transition-colors
                                                        group-hover:text-primary
                                                    "
                                            >
                                                {notice.title}
                                            </Link>

                                            {notice.pinned && (
                                                <span className="mt-1 block text-xs text-red-400">
                                                        중요 공지
                                                    </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2 text-sm text-muted">
                                                <LuCalendarDays className="shrink-0" />
                                                <time dateTime={notice.createdAt}>
                                                    {formatingDate(notice.createdAt)}
                                                </time>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-2 text-sm text-muted">
                                                <LuEye />
                                                <span>
                                                        {(notice.viewCnt ?? 0).toLocaleString()}
                                                    </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination currentPage={noticePage.number} totalPages={noticePage.totalPages}
                                    first={noticePage.first}
                                    last={noticePage.last} onPageChange={handlePageChange}/>
                    </>
                )}
            </section>
        </>
    )
}