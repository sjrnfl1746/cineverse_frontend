import TitleDesc from "../../components/common/TitleDesc.jsx";
import {LuPlus} from "react-icons/lu";
import InputLabel from "../../components/common/InputLabel.jsx";
import {useEffect, useRef, useState} from "react";
import Button from "../../components/common/Button.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {MdStarRate} from "react-icons/md";
import {formatTimeAgo} from "../../utils/dateUtils.js";
import {Link, useLocation} from "react-router-dom";
import {toast} from "sonner";
import {getReviewList} from "../../api/common/ReviewApi.js";

export default function ReviewList() {
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const observerTarget = useRef(null);
    const searchConditionRef = useRef({
        type: null,
        keyword: null,
    });

    // 검색 조건
    const [type, setType] = useState('');
    const [keyword, setKeyword] = useState('');

    const [reviewPage, setReviewPage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {

            const searchDTO = {
                type: type,
                keyword: null,
            }

            try {
                const res = await getReviewList(searchDTO);
                setReviewPage(res)
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        const target = observerTarget.current;

        if (!target || !reviewPage || reviewPage.last || loadingMore) {
            return;
        }

        const observer = new IntersectionObserver(async ([entry]) => {
            if (!entry.isIntersecting) {
                return;
            }
            setLoadingMore(true);

            try {
                const nextPage = reviewPage.number + 1;

                const res = await getReviewList(
                    searchConditionRef.current,
                    nextPage
                );

                setReviewPage((prev) => ({
                    ...res,
                    content: [...prev.content, ...res.content]
                }))
            } finally {
                setLoadingMore(false);
            }
        });
        observer.observe(target);

        return () => observer.disconnect();
    }, [reviewPage?.number, reviewPage?.last, loadingMore])

    useEffect(() => {
        if (location.state?.addReviewSuccess) {
            toast.success('리뷰를 등록했습니다.');
        }

        if (location.state?.reviewNotExist) {
            toast.error('잘못된 접근입니다.');
        }

        if (location.state?.removeReview) {
            toast.success('리뷰를 삭제했습니다.');
        }

        if (location.state?.reviewModifyNotExist) {
            toast.error('잘못된 접근입니다.');
        }
    })

    // 영화 검색 메서드
    const handleSearchMovie = async () => {
        if (keyword.trim() === '') {
            toast.error('검색어를 입력해주세요.');
            return;
        }

        setLoading(true);

        const searchDTO = {
            type: type,
            keyword: keyword
        }

        searchConditionRef.current = searchDTO;

        try {
            const res = await getReviewList(searchDTO, 0);
            setReviewPage(res)
        } catch (error) {
            console.log('에러 발생', error)
        } finally {
            setLoading(false);
        }
    }

    const reviewList = reviewPage?.content ?? [];

    if (loading) {
        return <LoadingSpinner/>
    }

    return (
        <>
            <main className="min-h-screen px-5 py-10 text-white sm:px-8 lg:px-12">
                <section className="mx-auto max-w-[1600px]">
                    <TitleDesc label={'REVIEWS'} title={'리뷰'} description={'콘텐츠를 보고 난 뒤의 감상을 나눠보세요'}>
                        <Link to={'/review/add'} className="flex items-center justify-center gap-2 bg-primary px-4 py-2 rounded-xl
                            transition-colors hover:bg-primary-hover cursor-pointer">
                            <LuPlus className="text-base"/>
                            리뷰 작성
                        </Link>
                    </TitleDesc>

                    {/* 영화 검색 */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-full">
                            <InputLabel type={'text'} name={'keyword'} placeholder={'영화 제목으로 검색해주세요'}
                                        value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
                        </div>
                        <div className="w-32">
                            <Button type={'button'} label={'검색'} onClick={handleSearchMovie}/>
                        </div>
                    </div>

                    {/* 영화 리뷰 리스트 */}
                    {reviewList.length <= 0 ? (
                        <div className="mt-16 text-center text-muted">
                            리뷰가 존재하지 않습니다...
                        </div>
                    ) : (
                        <div className="mt-16 flex flex-col gap-5">
                            {reviewList.map((review) => (
                                <Link to={`/review/${review.contentReviewId}`} key={review.contentReviewId}
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

                {reviewPage && !reviewPage.last && (
                    <div ref={observerTarget} className="h-10"/>
                )}

                {loadingMore && <LoadingSpinner/>}
            </main>
        </>
    )
}