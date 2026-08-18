import {useEffect, useState} from "react";
import {getNoticeByNoticeIdApi} from "../../api/common/NoticeApi.js";
import {Link, useNavigate, useParams} from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {LuCalendarDays, LuPin} from "react-icons/lu";
import {formatingDate} from "../../utils/dateUtils.js";
import {IoEyeOutline} from "react-icons/io5";

export default function NoticeDetail() {
    const {noticeId} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [notice, setNotice] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getNoticeByNoticeIdApi(noticeId);
                setNotice(res || null)
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

    if (!notice) {
        navigate(`/notice`, {
            state: {
                notExistNotice: true,
            }
        })
    }

    return (
        <>
            <main className="min-h-screen px-5 pb-16 pt-24 text-white sm:px-8 lg:px-12">
                <section className="mx-auto max-w-5xl">

                    {/* 제목 */}
                    <header className="border-b border-border pb-7 sm:pb-8">
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            {notice.pinned && (
                                <span
                                    className="
                                    inline-flex items-center gap-1.5
                                    rounded-full bg-red-500/10
                                    px-3 py-1.5
                                    text-xs font-semibold text-red-400
                                "
                                >
                                <LuPin />
                                중요 공지
                            </span>
                            )}

                            <span
                                className="
                                inline-flex items-center
                                rounded-full bg-primary/10
                                px-3 py-1.5
                                text-xs font-semibold text-primary
                            "
                            >
                            공지사항
                        </span>
                        </div>

                        <h1
                            className="
                            break-words text-2xl font-bold
                            leading-snug tracking-tight text-white
                            sm:text-3xl lg:text-4xl
                        "
                        >
                            {notice.title}
                        </h1>

                        {/* 작성 시간 / 조회 수 */}
                        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
                            <div className="flex items-center gap-2">
                            <span
                                className="
                                    flex h-8 w-8 items-center justify-center
                                    rounded-lg bg-white/5
                                "
                            >
                                <LuCalendarDays />
                            </span>

                                <time dateTime={notice.createdAt}>
                                    {formatingDate(notice.createdAt)}
                                </time>
                            </div>

                            <div className="flex items-center gap-2">
                            <span
                                className="
                                    flex h-8 w-8 items-center justify-center
                                    rounded-lg bg-white/5
                                "
                            >
                                <IoEyeOutline className="text-lg" />
                            </span>

                                <span>
                                조회수{" "}
                                    <strong className="font-medium text-foreground">
                                    {(notice.viewCnt ?? 0).toLocaleString()}
                                </strong>
                            </span>
                            </div>
                        </div>
                    </header>

                    {/* 내용 */}
                    <section className="min-h-[420px] py-10 sm:py-12">
                        <div
                            className="
                            whitespace-pre-wrap break-words
                            text-base leading-8 text-foreground
                            sm:text-lg sm:leading-9
                        "
                        >
                            {notice.content}
                        </div>
                    </section>

                    {/* 하단 구분선 */}
                    <div className="border-t border-border pt-7">
                        <div className="flex justify-center sm:justify-end">
                            <Link
                                to="/notice"
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