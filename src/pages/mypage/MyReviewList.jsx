import {useEffect, useMemo, useState} from "react";
import {
    LuChevronDown,
    LuClapperboard,
    LuMessageSquare,
    LuPencil,
    LuSearch,
    LuStar,
    LuTrash2,
    LuX,
} from "react-icons/lu";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {useAuthStore} from "../../store/authStore.js";
import {getUserReviewListApi} from "../../api/common/ReviewApi.js";
import {toast} from "sonner";
import {MdStarRate} from "react-icons/md";
import {formatTimeAgo} from "../../utils/dateUtils.js";
import {Link} from "react-router-dom";
import Pagination from "../../components/common/Pagination.jsx";

export default function MyReviewList() {
    const {isLogin} = useAuthStore();
    const [loading, setLoading] = useState(true);

    const [reviewPage, setReviewPage] = useState(null);

    const fetchReviewList= async (page = 0) => {
        setLoading(true);

        try {
            const res = await getUserReviewListApi(page);
            setReviewPage(res);
        } catch (error) {
            console.error('에러 발생', error);
            setReviewPage(null);
            toast.error('리뷰 목록을 불러오는데 실패했습니다.')
        } finally {
            setLoading(false);
        }
    }

    // 페이지 변경
    const handlePageChange = async (page) => {
        if (page < 0 || page >= reviewPage.totalPages) {
            return;
        }
        fetchReviewList(page);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getUserReviewListApi({page: 0});
                setReviewPage(res || null)
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [isLogin]);

    if (loading) {
        return <LoadingSpinner />;
    }

    const reviewList = reviewPage?.content ?? [];

    return (
        <main className="min-h-screen px-5 pb-20 pt-24 text-white sm:px-8 lg:px-12">
            <section className="mx-auto max-w-6xl mb-4">
                {/* 페이지 제목 */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-primary">
                            MY CINEVERSE
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                            작성한 리뷰
                        </h1>

                        <p className="mt-2 text-sm text-muted">
                            내가 작성한 콘텐츠 리뷰를 확인하고 관리할 수 있습니다.
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
                        <LuMessageSquare className="text-primary" />

                        총{" "}
                        <strong className="font-semibold text-white">
                            {reviewPage.totalElements}
                        </strong>
                        개
                    </div>
                </div>

                {/* 결과 정보 */}
                <div className="mb-5 mt-8 flex items-center justify-between">
                    <p className="text-sm text-muted">
                        총{" "}
                        <strong className="font-semibold text-foreground">
                            {reviewPage.totalElements}
                        </strong>
                        개의 리뷰
                    </p>
                </div>

                {reviewList.length === 0 ? (
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
                            <LuMessageSquare />
                        </span>

                        <h2 className="mt-5 text-lg font-bold">
                            작성한 리뷰가 없습니다.
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-muted">
                            감상한 콘텐츠에 리뷰를 남기면
                            <br />
                            이곳에서 확인할 수 있습니다.
                        </p>
                    </section>
                ) : (
                    <div className="space-y-4">
                        {reviewList.map((review, index) => (
                            <Link to={`/review/${review.contentReviewId}`} key={index}
                                  className="group flex rounded-xl border border-border hover:border-gray-600
                                  hover:-translate-y-1 transition duration-300 cursor-pointer">
                                {/* 영화 포스터 */}
                                <div className="relative w-[155px] hidden shrink-0 aspect-[2/3] overflow-hidden bg-surface
                                    rounded-l-xl sm:block lg:w-[175px]">
                                    <img src={`${import.meta.env.VITE_API_SERVER}/uploads/${review.posterUrl}`}
                                         alt={review.contentTitle}
                                         className="h-full w-full object-cover"/>
                                </div>

                                {/* 리뷰 정보 */}
                                <div className="w-full flex flex-col gap-4 px-4 py-6 rounded-r-xl">
                                    {/* 영화 제목 / 개봉년도 */}
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-gray-200">
                                            {review.contentTitle}
                                        </p>
                                        <p className="text-xs text-muted">
                                            {new Date(review.releaseAt).getFullYear()}
                                        </p>
                                    </div>

                                    {/* 평점 */}
                                    <div className="mt-3 flex items-center gap-2">
                                        <div className="flex items-center">
                                            {Array.from({length: 5}).map((_, index) => (
                                                <MdStarRate key={index} size={17} className={index < review.score
                                                    ? "text-yellow-400" : "text-gray-700"}/>
                                            ))}
                                        </div>

                                        <span className="text-xs font-semibold text-gray-300">
                                            {Number(review.score).toFixed(1)}
                                        </span>
                                    </div>

                                    {/* 리뷰 제목 / 내용 */}
                                    {review.spoiler ? (
                                        <div className="flex min-h-20 items-center justify-center rounded-lg border border-border
                                            bg-surface/60 px-4 py-5">
                                            <p className="text-sm text-muted">
                                                ⚠️ 스포일러가 포함된 리뷰입니다.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2 font-light">
                                            <h3 className="text-xl">
                                                {review.reviewTitle}
                                            </h3>
                                            <p className="text-muted text-sm line-clamp-2 leading-6">
                                                {review.reviewText}
                                            </p>
                                        </div>
                                    )}

                                    <hr className="text-border mt-2"/>

                                    {/* 작성자 / 작성년도 */}
                                    <div className="flex gap-2">
                                        <div
                                            className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary"/>
                                        <div className="flex flex-col justify-between items-center text-xs py-0.5">
                                            <p>{review.nickname != null ? review.nickname : review.email}</p>
                                            <p className="text-muted">{formatTimeAgo(review.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* 페이지네이션 */}
            <Pagination currentPage={reviewPage.number} totalPages={reviewPage.totalPages}
                        first={reviewPage.first} last={reviewPage.last} onPageChange={handlePageChange}/>
        </main>
    );
}