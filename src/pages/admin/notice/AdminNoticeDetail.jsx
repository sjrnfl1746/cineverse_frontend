import {useEffect, useState} from "react";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import {deleteNoticeApi, getNoticeApi} from "../../../api/admin/AdminNoticeApi.js";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import ConfirmModal from "../../../components/common/ConfirmModal.jsx";
import TitleLabel from "../../../components/admin/TitleLabel.jsx";
import {LuCalendarDays, LuEye, LuFileText, LuPin} from "react-icons/lu";
import {formatingDate} from "../../../utils/dateUtils.js";
import {toast} from "sonner";

export default function AdminNoticeDetail() {
    const {noticeId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    const [notice, setNotice] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDeleteContent = async () => {
        try {
            setDeleting(true);

            await deleteNoticeApi(noticeId);

            // 삭제 후 목록 페이지 이동
            navigate(`/admin/notice`, {
                state: {
                    deleteNoticeSuccess: true,
                }
            })
        } catch (error) {
            console.error('에러 발생', error)
        } finally {
            setDeleting(false);
            setConfirmOpen(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getNoticeApi(noticeId);
                setNotice(res || null)
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        if (location.state?.modifyNoticeSuccess) {
            toast.success('공지를 수정했습니다.');
        }
    }, [])

    if (loading) {
        return <LoadingSpinner/>
    }

    if (!notice) {
        navigate(`/admin/notice`, {
            state: {
                notExistNotice: true,
            }
        })
    }

    return (
        <>
            <TitleLabel title="공지 상세" desc="공지의 상세 정보를 확인합니다.">
                <Link to={`/admin/notice/modify/${noticeId}`} className="rounded-xl bg-primary px-4 py-2.5 text-sm
                    font-semibold text-white transition hover:bg-primary-hover">
                    수정
                </Link>

                <button type="button" onClick={() => setConfirmOpen(true)}
                        className="cursor-pointer rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600">
                    삭제
                </button>

                <ConfirmModal open={confirmOpen} title="공지 삭제" message="공지를 삭제하시겠습니까?" confirmText="삭제"
                              confirmVariant="danger"
                              loading={deleting} onConfirm={handleDeleteContent}
                              onCancel={() => setConfirmOpen(false)}/>

                <Link to="/admin/notice" className="rounded-xl border border-border px-4 py-2.5
                    text-sm font-semibold text-muted transition hover:border-gray-400 hover:text-gray-300">
                    목록
                </Link>
            </TitleLabel>

            {/* 공지 상세 */}
            <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
                {/* 공지 상단 */}
                <div className="border-b border-border px-6 py-7 sm:px-8 sm:py-8">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        {notice.pinned ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10
                                px-3 py-1.5 text-xs font-semibold text-red-400">
                                <LuPin/>
                                상단 고정
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded-full bg-background
                                px-3 py-1.5 text-xs font-medium text-muted">
                                일반 공지
                            </span>
                        )}

                        <span
                            className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                            공지사항
                        </span>
                    </div>

                    <h2 className="break-words text-2xl font-bold leading-snug text-white sm:text-3xl">
                        {notice.title}
                    </h2>

                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
                        <div className="flex items-center gap-2">
                            <LuCalendarDays className="text-base"/>

                            <time dateTime={notice.createdAt}>
                                {formatingDate(notice.createdAt)}
                            </time>
                        </div>

                        <div className="flex items-center gap-2">
                            <LuEye className="text-base"/>

                            <span>
                            조회수{" "}
                                <strong className="font-medium text-foreground">
                                {(notice.viewCnt ?? 0).toLocaleString()}
                            </strong>
                        </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-muted/60">공지 번호</span>
                            <span className="font-medium text-foreground">
                            #{notice.noticeId}
                        </span>
                        </div>
                    </div>
                </div>

                {/* 공지 내용 */}
                <div className="px-6 py-7 sm:px-8 sm:py-10">
                    <div className="mb-5 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <LuFileText/>
                        </div>

                        <h3 className="font-semibold text-foreground">
                            공지 내용
                        </h3>
                    </div>

                    <div
                        className=" min-h-72 rounded-2xl border border-border bg-background/40 px-5 py-6 sm:min-h-80 sm:px-7 sm:py-7">
                        <p className="whitespace-pre-wrap break-words text-[15px] leading-8 text-foreground sm:text-base">
                            {notice.content}
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}