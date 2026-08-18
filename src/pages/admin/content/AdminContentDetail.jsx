import {useEffect, useState} from "react";
import {deleteContentApi, getContentApi} from "../../../api/admin/AdminContentApi.js";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import TitleLabel from "../../../components/admin/TitleLabel.jsx";
import ContentStatusBadge from "../../../components/admin/content/ContentStatusBadge.jsx";
import ContentDetailItem from "../../../components/admin/content/ContentDetailItem.jsx";
import getAgeRatingLabel from "../../../components/admin/content/getAgeRatingLabel.jsx";
import {toast} from "sonner";
import ConfirmModal from "../../../components/common/ConfirmModal.jsx";

export default function AdminContentDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const {contentId} = useParams();
    const [content, setContent] = useState(null);

    // 삭제 확인
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // 일반 유튜브 링크를 embed 주소로 변환 메서드
    const getYoutubeEmbedUrl = (url) => {
        if (!url) {
            return null;
        }

        try {
            const parsedUrl = new URL(url);

            // https://youtu.be/VIDEO_ID
            if (parsedUrl.hostname === "youtu.be") {
                const videoId = parsedUrl.pathname.slice(1);
                return `https://www.youtube.com/embed/${videoId}`;
            }

            // https://www.youtube.com/watch?v=VIDEO_ID
            if (
                parsedUrl.hostname === "www.youtube.com" ||
                parsedUrl.hostname === "youtube.com"
            ) {
                const videoId = parsedUrl.searchParams.get("v");

                if (videoId) {
                    return `https://www.youtube.com/embed/${videoId}`;
                }

                // 이미 embed URL인 경우
                if (parsedUrl.pathname.startsWith("/embed/")) {
                    return url;
                }
            }
            return null;
        } catch {
            return null;
        }
    }

    // 콘텐츠 삭제 메서드
    const handleDeleteContent = async () => {
        try {
            setDeleting(true);

            await deleteContentApi(contentId);

            // 삭제 후 목록 페이지로 이동
            navigate("/admin/content", {
                state: {
                    deleteContentSuccess: true,
                }
            });
        } catch (error) {
            console.log('에러 발생', error);
            toast.error('콘텐츠 삭제 실패');
        } finally {
            setDeleting(false);
            setConfirmOpen(false);
        }
    }

    useEffect(() => {
        if (location.state?.existsVideo) {
            toast.error('이미 영상이 등록된 콘텐츠 입니다.');
        }

        if (location.state?.modifyVideoSuccess) {
            toast.success('영상을 수정했습니다.');
        }

        if (location.state?.modifyContentSuccess) {
            toast.success('콘텐츠 정보를 수정했습니다.');
        }
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getContentApi(Number(contentId));
                setContent(res);
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [])

    if (loading) {
        return <LoadingSpinner/>;
    }

    // 콘텐츠가 존재하지 않는 경우
    if (!content) {
        return (
            <>
                <TitleLabel title={'콘텐츠 상세'} desc={'콘텐츠의 상세 정보를 확인합니다.'}>
                    <Link to='/admin/content' className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold
                        text-muted transition hover:border-gray-400 hover:text-gray-400">
                        목록
                    </Link>
                </TitleLabel>
                <div className="rounded-2xl border border-border bg-card p-10 text-center">
                    <p className="text-muted">
                        콘텐츠가 존재하지 않습니다...
                    </p>
                </div>
            </>
        )
    }

    return (
        <>
            <TitleLabel title={'콘텐츠 상세'} desc={'콘텐츠의 상세 정보를 확인합니다.'}>
                <Link to={`/admin/content/${contentId}/modify`} className="rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-white
                    transition hover:bg-primary-hover">
                    수정
                </Link>

                {/* 콘텐츠 삭제 */}
                <button type="button" onClick={() => setConfirmOpen(true)}
                        className="rounded-2xl bg-red-400 px-4  py-2.5 text-sm font-semibold text-white
                        transition hover:bg-red-500 cursor-pointer">
                    삭제
                </button>

                <ConfirmModal open={confirmOpen} title={'콘텐츠 삭제'} message={'콘텐츠를 삭제하시겠습니까?'} confirmText={'삭제'}
                              confirmVariant={'danger'} loading={deleting} onConfirm={handleDeleteContent}
                              onCancel={() => setConfirmOpen(false)}/>

                <Link to='/admin/content' className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold
                        text-muted transition hover:border-gray-400 hover:text-gray-400">
                    목록
                </Link>
            </TitleLabel>

            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">

                {/* 포스터 */}
                <section className="rounded-2xl border border-border bg-card p-5">
                    <div className="overflow-hidden rounded-xl bg-background">
                        {content.posterUrl ? (
                            <img src={`${import.meta.env.VITE_API_SERVER}/uploads/${content.posterUrl}`}
                                 alt={`${content.title} 포스터`} className="aspect-[2/3] w-full object-cover"/>
                        ) : (
                            <div className="flex aspect-[2/3] items-center justify-center text-sm text-muted">
                                등록한 포스터가 없습니다...
                            </div>
                        )}
                    </div>
                </section>

                {/* 기본 정보 */}
                <section className="rounded-2xl border border-border bg-card p-6">
                    <div className="border-b border-border pb-5">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-2xl font-bold text-foreground">
                                {content.title}
                            </h2>

                            <ContentStatusBadge status={content.contentStatus}/>
                        </div>

                        <p className="mt-2 text-sm text-muted">
                            {content.ogTitle || "-"}
                        </p>
                    </div>

                    <dl className="grid gap-x-8 gap-y-5 py-6 sm:grid-cols-2">
                        <ContentDetailItem label={'관람 등급'} value={getAgeRatingLabel(content.ageRating)}/>
                        <ContentDetailItem label={'상영 시간'}
                                           value={content.runningTime ? `${content.runningTime}분` : "-"}/>
                        <ContentDetailItem label={'제작 국가'} value={content.productionCountry}/>
                        <ContentDetailItem label={'장르'} value={content.genres?.length > 0 ?
                            content.genres.map((genre) => genre.genreName ?? genre.name).join(", ") : "-"}/>
                        <ContentDetailItem label={'공개 시작일'} value={content.releaseAt}/>
                        <ContentDetailItem label={'공개 종료일'} value={content.endAt}/>
                    </dl>

                    {/* 줄거리 */}
                    <div className="border-t border-border pt-6">
                        <h3 className="mb-3 text-sm font-semibold text-foreground">
                            줄거리
                        </h3>
                        <p className="whitespace-pre-wrap text-sm leading-7 text-muted">
                            {content.description || "등록된 줄거리가 없습니다..."}
                        </p>
                    </div>
                </section>
            </div>

            {/* 영상 정보 */}
            <section className="mt-6 rounded-2xl border border-border bg-card p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">
                            영상 정보
                        </h3>
                        <p className="mt-1 text-sm text-muted">
                            콘텐츠에 등록된 본편 영상을 관리합니다.
                        </p>
                    </div>
                    {content.videoUrl && (
                        <Link to={`/admin/content/${contentId}/video/modify`} className="rounded-xl border border-border px-4 py-2.5
                        text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">
                            영상 변경
                        </Link>
                    )}
                </div>

                {/* 영상 */}
                {content.videoUrl ? (
                    <video src={`${import.meta.env.VITE_API_SERVER}/uploads/${content.videoUrl}`} controls
                           className="rounded-xl"/>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border
                        px-6 py-12 text-center">
                        <p className="font-semibold text-foreground">
                            등록된 영상이 없습니다...
                        </p>
                        <p className="mt-2 text-sm text-muted">
                            콘텐츠를 서비스하려면 본편 영상을 등록해주세요.
                        </p>
                        <Link to={`/admin/content/${contentId}/video/add`} className="mt-5 rounded-xl bg-primary px-5 py-2.5
                            text-sm font-semibold text-white transition hover:bg-primary-hover">
                            영상 등록
                        </Link>
                    </div>
                )}
            </section>

            {/* 예고편 */}
            <section className="mt-6 rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold text-foreground">
                    예고편
                </h3>

                {content.trailerUrl ? (
                    <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl">
                        <iframe width="560" height="315" src={getYoutubeEmbedUrl(content.trailerUrl)}
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen className="w-full h-full"/>
                    </div>
                ) : (
                    <p className="mt-4 text-sm text-muted">
                        등록된 예고편이 없습니다...
                    </p>
                )}
            </section>
        </>
    )
}