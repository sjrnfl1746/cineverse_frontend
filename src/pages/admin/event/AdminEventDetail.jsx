import TitleLabel from "../../../components/admin/TitleLabel.jsx";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import EventStatusBadge from "../../../components/admin/event/EventStatusBadge.jsx";
import {LuCalendarDays, LuClock3} from "react-icons/lu";
import {useEffect, useState} from "react";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import {deleteEventApi, getEventApi} from "../../../api/admin/AdminEventApi.js";
import {formatingDate} from "../../../utils/dateUtils.js";
import {toast} from "sonner";
import ConfirmModal from "../../../components/common/ConfirmModal.jsx";

export default function AdminEventDetail() {
    const {eventId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    const [event, setEvent] = useState(null);

    // 삭제 확인
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // 이벤트 삭제 메서드
    const handleDeleteEvent = async () => {
        try {
            setDeleting(true);

            await deleteEventApi(eventId);

            // 삭제 후 목록 페이지로 이동
            navigate('/admin/event', {
                state: {
                    deleteEventSuccess: true,
                }
            });
        } catch (error) {
            console.error('에러 발생', error);
            toast.error('이벤트 삭제 실패');
        } finally {
            setDeleting(false);
            setConfirmOpen(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getEventApi(eventId);
                setEvent(res || null)
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        if (location.state?.modifyEventSuccess) {
            toast.success('이벤트를 수정했습니다.');
        }
        if (location.state?.addEventAnnouncementSuccess) {
            toast.success('이벤트 결과 발표를 등록했습니다.');
        }
        if (location.state?.deleteAnnounceSuccess) {
            toast.success('이벤트 결과 발표를 삭제했습니다.');
        }

    }, [])

    if (loading) {
        return <LoadingSpinner/>
    }

    if (!event) {
        navigate('/admin/event', {
            state: {
                notExistingEvent: true,
            }
        })
    }

    return (
        <>
            <TitleLabel title={'이벤트 상세'} desc={'이벤트 상세 정보를 확인합니다.'}>

                {/* 이벤트 상태가 published인 경우 */}
                {event.eventStatus === 'PUBLISHED' && (
                    <Link to={`/admin/event/${event.eventId}/modify`} className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white
                    transition hover:bg-primary-hover">
                        수정
                    </Link>
                )}

                {/* 이벤트가 published / READY인 경우 */}
                {(event.eventStatus === 'PUBLISHED' || event.eventStatus === 'READY') && (
                    <button type="button" onClick={() => setConfirmOpen(true)}
                            className="rounded-2xl bg-red-400 px-4  py-2.5 text-sm font-semibold text-white
                        transition hover:bg-red-500 cursor-pointer">
                        삭제
                    </button>
                )}

                <ConfirmModal open={confirmOpen} title={'이벤트 삭제'} message={'이벤트를 삭제하시겠습니까?'} confirmText={'삭제'}
                              confirmVariant={'danger'} loading={deleting} onConfirm={handleDeleteEvent}
                              onCancel={() => setConfirmOpen(false)}/>

                <Link to='/admin/event' className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold
                        text-muted transition hover:border-gray-400 hover:text-gray-400">
                    목록
                </Link>
            </TitleLabel>

            <article className="mt-6 overflow-hidden rounded-2xl border border-border">

                {/* 제목 / 작성일 */}
                <header className="flex justify-between items-center border-b border-border px-6 py-6 sm:px-10">

                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-muted sm:text-3xl">
                            {event.title}
                        </h1>
                        <EventStatusBadge status={event.eventStatus}/>
                    </div>

                    <span className="flex items-center gap-1.5 text-sm text-muted">
                        <LuClock3/>
                        작성일 {formatingDate(event.createdAt)}
                    </span>
                </header>

                {/* 이벤트 기간 */}
                <div className="flex items-center justify-between gap-3 border-b border-border px-6 py-5 sm:px-10">
                    <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-muted">
                        <LuCalendarDays/>
                    </span>

                        <div>
                            <p className="text-xs font-semibold text-muted">
                                이벤트 기간
                            </p>
                            <p className="mt-1 text-sm font-semibold text-muted">
                                {formatingDate(event.startAt)} ~ {formatingDate(event.endAt)}
                            </p>
                        </div>
                    </div>

                    {/* eventStatus가 RESULT_PENDING인 경우 */}
                    {event.eventStatus === 'RESULT_PENDING' && (
                        <Link to={`/admin/event/${event.eventId}/winner/add`} className="bg-secondary px-3 py-2 rounded-xl
                        hover:bg-secondary-hover transition duration-300 cursor-pointer">
                            당첨자 등록
                        </Link>
                    )}

                    {/* eventStatus가 END인 경우 - 당첨자 결과 페이지 이동 */}
                    {event.eventStatus === 'END' && (
                        <Link to={`/admin/event/${eventId}/winner`} className="bg-secondary px-3 py-2 rounded-xl
                        hover:bg-secondary-hover transition duration-300 cursor-pointer">
                            당첨자 확인
                        </Link>
                    )}
                </div>

                {/* 포스터 이미지 */}
                <div className="px-6 pt-8 sm:px-10">
                    <img
                        src={`${import.meta.env.VITE_API_SERVER}/uploads/${event.posterUrl}`}
                        alt={`${event.title} 포스터`} className="w-full rounded-xl"/>
                </div>

                {/* 내용 */}
                <section className="px-6 pt-4 pb-10 sm:px-10">
                    <div className="whitespace-pre-line text-sm leading-5 text-muted">
                        {event.description}
                    </div>
                </section>
            </article>
        </>
    )
}