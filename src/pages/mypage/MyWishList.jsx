import {useEffect, useState} from "react";
import {
    LuBookmark,
    LuHeart,
    LuTrash2,
} from "react-icons/lu";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {getWishlistApi} from "../../api/common/WishlistApi.js";
import {Link} from "react-router-dom";
import {useAuthStore} from "../../store/authStore.js";
import {toast} from "sonner";
import {removeUserWishlist} from "../../api/common/ContentApi.js";
import Pagination from "../../components/common/Pagination.jsx";

export default function MyWishList() {
    const {isLogin} = useAuthStore();
    const [loading, setLoading] = useState(true);

    const [wishlistPage, setWishlistPage] = useState(null);

    const fetchWishlist = async (page = 0) => {
        setLoading(true);

        try {
            const res = await getWishlistApi({page: page});
            setWishlistPage(res)
        } catch (error) {
            console.error('에러 발생', error);
            setWishlistPage(null);
            toast.error('찜목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    }

    // 페이지 변경
    const handlePageChange = async (page) => {
        if (page < 0 || page >= wishlistPage.totalPages) {
            return;
        }
        fetchWishlist(page);
    }


    // 찜목록 삭제
    const handleRemoveWishlist = async (contentId) => {
        try {
            await removeUserWishlist(contentId);

            setWishlistPage((prev) => ({
                ...prev,
                content: prev.content.filter(
                    (wish) => wish.contentId !== contentId
                ),
                totalElements: Math.max(prev.totalElements - 1, 0),
            }))

            toast.success('해당 콘텐츠를 찜목록에서 삭제했습니다.');
        } catch (error) {
            console.error('에러 발생', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getWishlistApi({page: 0});
                setWishlistPage(res || null)
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [isLogin])

    if (loading) {
        return <LoadingSpinner/>
    }

    const wishlist = wishlistPage?.content ?? [];

    return (
        <main className="min-h-screen px-5 pb-20 pt-24 text-white sm:px-8 lg:px-12">
            <section className="mx-auto max-w-7xl mb-4">
                {/* 페이지 제목 */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-primary">
                            MY CINEVERSE
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                            찜한 콘텐츠
                        </h1>

                        <p className="mt-2 text-sm text-muted">
                            관심 있는 영화와 시리즈를 한곳에서 확인하세요.
                        </p>
                    </div>

                    <div
                        className="
                            flex w-fit items-center gap-2
                            rounded-full border border-border
                            bg-card px-4 py-2
                            text-sm text-muted
                        "
                    >
                        <LuHeart className="fill-primary text-primary" />

                        총{" "}
                        <strong className="font-semibold text-white">
                            {wishlistPage.totalElements}
                        </strong>
                        개
                    </div>
                </div>

                {/* 검색 결과 */}
                <div className="mb-5 mt-8 flex items-center justify-between">
                    <p className="text-sm text-muted">
                        총{" "}
                        <strong className="font-semibold text-foreground">
                            {wishlistPage.totalElements}
                        </strong>
                        개의 콘텐츠
                    </p>
                </div>

                {wishlist.length === 0 ? (
                    /* 빈 목록 */
                    <section
                        className="
                            flex min-h-96 flex-col items-center
                            justify-center rounded-2xl
                            border border-dashed border-border
                            px-6 text-center
                        "
                    >
                        <span
                            className="
                                flex h-16 w-16 items-center
                                justify-center rounded-2xl
                                bg-primary/10 text-2xl text-primary
                            "
                        >
                            <LuBookmark />
                        </span>

                        <h2 className="mt-5 text-lg font-bold">
                            찜한 콘텐츠가 없습니다.
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-muted">
                            관심 있는 콘텐츠를 찜하면
                            <br />
                            이곳에서 편하게 확인할 수 있습니다.
                        </p>
                    </section>
                ) : (
                    /* 콘텐츠 목록 */
                    <div
                        className="
                            grid grid-cols-2 gap-x-4 gap-y-7
                            sm:grid-cols-3 lg:grid-cols-4
                            xl:grid-cols-5
                        "
                    >
                        {wishlist.map((wish, index) => (
                            <article
                                key={index}
                                className="group min-w-0"
                            >
                                {/* 포스터 */}
                                <Link to={`/movie/${wish.contentId}`}
                                    className={`
                                        relative aspect-[2/3]
                                        overflow-hidden rounded-2xl
                                        bg-gradient-to-br
                                    `}
                                >
                                    <img src={`${import.meta.env.VITE_API_SERVER}/uploads/${wish.posterUrl}`}
                                        alt={`${wish.contentTitle} 포스터`} className="rounded-2xl hover:scale-105
                                        transition duration-300"/>

                                    {/* 호버 상세 */}
                                    <div
                                        className="
                                            absolute inset-x-0 bottom-0
                                            translate-y-2 p-4 opacity-0
                                            transition duration-300
                                            group-hover:translate-y-0
                                            group-hover:opacity-100
                                        "
                                    >
                                    </div>
                                </Link>

                                {/* 콘텐츠 정보 */}
                                <div className="mt-3">
                                    <h2
                                        className="
                                            truncate font-semibold
                                            text-foreground
                                            transition-colors
                                            group-hover:text-primary
                                        "
                                    >
                                        {wish.contentTitle}
                                    </h2>

                                    <p className="mt-1 truncate text-xs text-muted">
                                        {new Date(wish.releaseAt).getFullYear()}
                                    </p>

                                    <div className="mt-2 flex items-center justify-between">

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveWishlist(wish.contentId)}
                                            className="
                                                flex items-center gap-1
                                                text-xs text-muted
                                                transition hover:text-red-400
                                            "
                                        >
                                            <LuTrash2 />
                                            삭제
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {/* 페이지네이션 */}
            <Pagination currentPage={wishlistPage.number} totalPages={wishlistPage.totalPages}
                        first={wishlistPage.first} last={wishlistPage.last} onPageChange={handlePageChange}/>
        </main>
    );
}