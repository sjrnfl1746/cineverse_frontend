import {useEffect, useState} from "react";
import LoadingSpinner from "../../../../components/common/LoadingSpinner.jsx";
import {
    deleteEventAnnouncementApi,
    getEventAnnouncementByEventId
} from "../../../../api/admin/AdminEventAnnouncementApi.js";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import TitleLabel from "../../../../components/admin/TitleLabel.jsx";
import {LuClock3} from "react-icons/lu";
import {formatingDate} from "../../../../utils/dateUtils.js";
import {toast} from "sonner";
import ConfirmModal from "../../../../components/common/ConfirmModal.jsx";

export default function AdminWinnerDetail() {
    const {eventId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    const [winner, setWinner] = useState(null);

    // 삭제 확인
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getEventAnnouncementByEventId(eventId);
                setWinner(res);
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    // 이벤트 결과 발표 삭제
    const handleDeleteEventAnnouncement = async () => {
        try {
            setDeleting(true);

            await deleteEventAnnouncementApi(eventId);

            // 삭제 후 이동
            navigate(`/admin/event/${eventId}`, {
                state: {
                    deleteAnnounceSuccess: true,
                }
            });
        } catch (error) {
            console.error('에러 발생', error);
            toast.error('이벤트 결과 확인 삭제 실패')
        } finally {
            setDeleting(false);
            setConfirmOpen(false);
        }
    }

    useEffect(() => {
        if (location.state?.modifyAnnounceSuccess) {
            toast.success('결과 발표 내용을 수정했습니다.');
        }
    }, [])

    if (loading) {
        return <LoadingSpinner/>
    }

    return (
        <>
            <TitleLabel
                title={'당첨자 확인'}
                desc={'이벤트 당첨자를 확인합니다.'}
            >
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        to={`/admin/event/${eventId}/winner/modify`}
                        className="
                        inline-flex items-center justify-center
                        rounded-xl bg-primary px-4 py-2.5
                        text-sm font-semibold text-white
                        transition duration-300
                        hover:bg-primary-hover
                    "
                    >
                        수정
                    </Link>

                    <button
                        type="button"
                        onClick={() => setConfirmOpen(true)}
                        className="
                        cursor-pointer rounded-xl
                        bg-red-500 px-4 py-2.5
                        text-sm font-semibold text-white
                        transition duration-300
                        hover:bg-red-600
                    "
                    >
                        삭제
                    </button>

                    <ConfirmModal
                        open={confirmOpen}
                        title={'이벤트 결과 삭제'}
                        message={'이벤트 결과 내용을 삭제하시겠습니까?'}
                        confirmText={'삭제'}
                        confirmVariant={'danger'}
                        loading={deleting}
                        onConfirm={handleDeleteEventAnnouncement}
                        onCancel={() => setConfirmOpen(false)}
                    />

                    <Link
                        to={`/admin/event/${eventId}`}
                        className="
                        inline-flex items-center justify-center
                        rounded-xl border border-border
                        px-4 py-2.5
                        text-sm font-semibold text-muted
                        transition duration-300
                        hover:border-gray-500 hover:text-white
                    "
                    >
                        이벤트 확인
                    </Link>
                </div>
            </TitleLabel>

            <article
                className="
                mt-8 overflow-hidden rounded-2xl
                border border-border bg-card
                shadow-xl shadow-black/5
            "
            >
                {/* 제목 / 작성일 */}
                <header
                    className="
                    border-b border-border
                    px-6 py-7 sm:px-8 sm:py-8
                "
                >
                    <div className="mb-4">
                    <span
                        className="
                            inline-flex items-center
                            rounded-full bg-primary/10
                            px-3 py-1.5
                            text-xs font-semibold text-primary
                        "
                    >
                        이벤트 당첨자 발표
                    </span>
                    </div>

                    <div
                        className="
                        flex flex-col gap-4
                        sm:flex-row sm:items-end sm:justify-between
                    "
                    >
                        <h1
                            className="
                            min-w-0 break-words
                            text-2xl font-bold leading-snug
                            text-foreground
                            sm:text-3xl
                        "
                        >
                            {winner.title}
                        </h1>

                        <span
                            className="
                            flex shrink-0 items-center gap-2
                            text-sm text-muted
                        "
                        >
                        <span
                            className="
                                flex h-8 w-8 items-center justify-center
                                rounded-lg bg-background
                            "
                        >
                            <LuClock3 />
                        </span>

                        작성일 {formatingDate(winner.createdAt)}
                    </span>
                    </div>
                </header>

                {/* 내용 */}
                <section className="px-6 py-8 sm:px-8 sm:py-10">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="h-5 w-1 rounded-full bg-primary" />

                        <h2 className="text-sm font-semibold text-foreground">
                            당첨자 발표 내용
                        </h2>
                    </div>

                    <div
                        className="
                        min-h-72 rounded-2xl
                        border border-border
                        bg-background/40
                        px-5 py-6
                        sm:min-h-80 sm:px-7 sm:py-7
                    "
                    >
                        <div
                            className="
                            whitespace-pre-wrap break-words
                            text-base leading-8 text-foreground
                        "
                        >
                            {winner.description}
                        </div>
                    </div>
                </section>

                {/* 하단 */}
                <footer
                    className="
                    border-t border-border
                    bg-background/30
                    px-6 py-4 text-xs text-muted
                    sm:px-8
                "
                >
                    이벤트 결과 발표
                </footer>
            </article>
        </>
    );
}