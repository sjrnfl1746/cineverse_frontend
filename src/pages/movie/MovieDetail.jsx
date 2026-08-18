import {useEffect, useState} from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {addUserWishlist, getContentByContentIdApi, removeUserWishlist} from "../../api/common/ContentApi.js";
import {useParams} from "react-router-dom";
import {useAuthStore} from "../../store/authStore.js";
import {toast} from "sonner";
import {getVideoPathByContentIdApi} from "../../api/common/VideoApi.js";

export default function MovieDetail() {
    const {contentId} = useParams();
    const {subscribe, isLogin} = useAuthStore();

    const [loading, setLoading] = useState(true);
    const [playLoading, setPlayLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const [content, setContent] = useState(null);
    const [video, setVideo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getContentByContentIdApi(contentId);
                setContent(res);
                setIsWishlisted(res.wishlisted);
            } catch (error) {
                console.error('에러 발생', error);
                setContent(null);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [isLogin])

    // 영상 재생
    const handlePlay = async () => {
        setPlayLoading(true);

        if (!subscribe) { // 구독 여부 확인
            toast.error('구독시 영상 시청이 가능합니다.');
            return;
        }
        try {
            const res = await getVideoPathByContentIdApi(contentId);
            setVideo(res);
        } catch (error) {
            toast.error(error.response?.data?.message ?? '오류가 발생했습니다.');
            console.error('에러 발생', error);
        }

        setTimeout(() => {
            setIsPlaying(true);
            setPlayLoading(false);
        }, 700)
    }

    // 찜 목록 등록
    const handleWishlist = async () => {
        setWishlistLoading(true);
        try {
            if (!isWishlisted) {
                await addUserWishlist(contentId);
            } else {
                await removeUserWishlist(contentId);
            }
            setIsWishlisted((prev) => !prev);
        } catch (error) {
            console.error('에러 발생', error);
        } finally {
            setWishlistLoading(false);
        }
    }

    if (loading) {
        return <LoadingSpinner/>
    }

    return (
        <>
            <main className="min-h-screen px-5 py-10 text-white sm:px-8 lg:px-12">
                <section className="mx-auto max-w-[1600px] mt-16">
                    {/* 영상 */}
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl">
                        {isPlaying ? (
                            <div className="flex h-full w-full items-center justify-center bg-black">
                                {video?.path ? (
                                    <video src={`${import.meta.env.VITE_API_SERVER}/uploads/${video.path}`} controls/>
                                ) : (
                                    <span className="text-muted">영상을 불러오는데 실패했습니다...</span>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="h-full w-full object-cover"/>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button type='button' onClick={handlePlay} disabled={playLoading}
                                            className='flex h-20 w-20 items-center justify-center rounded-full
                                            bg-white text-3xl text-black shadow-xl transition cursor-pointer
                                            hover:scale-110 disabled:cursor-wait disabled:opacity-60'>
                                        {playLoading ? (
                                            <span className="animate-pulse text-base">
                                                ···
                                            </span>
                                        ) : (
                                            <span className="ml-1">▶</span>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* 영화 정보 */}
                    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
                        <div>
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                        {content.title}
                                    </h2>

                                    <p className="mt-2 text-sm text-white/45">
                                        {content.ogTitle}
                                    </p>
                                </div>

                                {isLogin && (
                                    <button type='button' onClick={handleWishlist}
                                            className={`rounded-lg border px-4 py-3 font-semibold transition
                                            ${isWishlisted ? 'border-red-500 bg-red-500 text-white'
                                                : 'border-white/20 bg-white/5 hover:bg-white/10'}`}>
                                        {wishlistLoading ? '...' : (isWishlisted ? "♥" : "♡")}
                                    </button>
                                )}
                            </div>

                            {/* 기본 정보 */}
                            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                                <span className="text-white/60">
                                    {new Date(content.releaseAt).getFullYear()}
                                </span>
                                <span className="rounded border border-white/30 px-1.5 py-0.5 text-xs">
                                    {content.ageRating}
                                </span>
                                <span className="text-white/60">
                                    {content.runningTime}분
                                </span>
                                <span className="rounded border border-white/30 px-1.5 py-0.5 text-xs">
                                    {content.productionCountry}
                                </span>
                            </div>

                            {/* 장르 */}
                            <div className="mt-5 flex flex-wrap gap-2">
                                {content.genres.map((genre) => (
                                    <span key={genre.genreId}
                                          className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/80">
                                        {genre.genreName}
                                    </span>
                                ))}
                            </div>

                            <p className="mt-6 max-w-4xl text-base leading-8 text-white/70">
                                {content.description}
                            </p>
                        </div>

                        {/* 제작 정보 */}
                        <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                            <img src={`${import.meta.env.VITE_API_SERVER}/uploads/${content.posterUrl}`}
                                 alt={content.title} className="rounded-lg"/>
                        </aside>
                    </div>
                </section>
            </main>
        </>
    )
}