import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {MdKeyboardDoubleArrowLeft, MdStarRate} from "react-icons/md";
import {formatingDate} from "../../utils/dateUtils.js";
import {useEffect, useState} from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {getReviewByContentReviewIdApi, removeReviewApi} from "../../api/common/ReviewApi.js";
import {useAuthStore} from "../../store/authStore.js";
import {toast} from "sonner";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";

export default function ReviewDetail() {
    const {contentReviewId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {isLogin} = useAuthStore();

    const [loading, setLoading] = useState(true);

    const [review, setReview] = useState(null);

    // 삭제 확인
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getReviewByContentReviewIdApi(contentReviewId);
                setReview(res || null)
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [isLogin])

    useEffect(() => {
        if (location.state?.updateReviewSuccess) {
            toast.success('리뷰를 수정했습니다.');
        }
    })

    // 리뷰 삭제
    const handleRemoveReview = async () => {

        try {
            setDeleting(true);
            await removeReviewApi(review.contentReviewId);

            // 삭제 후 목록 페이지로 이동
            navigate('/review', {
                state: {
                    removeReview: true,
                }
            })
        } catch (error) {
            console.error('에러 발생', error);
        } finally {
            setDeleting(false);
            setConfirmOpen(false);
        }
    }

    if (loading) {
        return <LoadingSpinner/>
    }

    if (review === null) {
        navigate('/review', {
            state: {
                reviewNotExist: true,
            }
        });
    }

    return (
        <>
            <main className="min-h-screen px-5 py-10 text-white sm:px-8 lg:px-12">
                <section className="mx-auto max-w-[1600px]">
                    <div className="mt-16 flex justify-between items-center sm:mt-12">
                        <Link to={'/review'} className="flex justify-center items-center gap-2 px-4 py-2 border border-border
                            rounded-xl text-muted hover:border-gray-600 transition duration-300">
                            <MdKeyboardDoubleArrowLeft/>
                            리뷰 목록
                        </Link>
                        {review.writer && (
                            <div className="flex gap-2">
                                <Link to={`/review/modify/${review.contentReviewId}`} className="px-4 py-2 bg-primary rounded-xl hover:bg-primary-hover
                                cursor-pointer transition duration-300">
                                    수정하기
                                </Link>
                                <button type='button' onClick={() => setConfirmOpen(true)}
                                        className="px-4 py-2 bg-red-500 rounded-xl hover:bg-red-400
                                        cursor-pointer transition duration-300">
                                    삭제
                                </button>

                                {/* 삭제 확인 */}
                                <ConfirmModal open={confirmOpen} title={'리뷰 삭제'} message={'리뷰를 삭제하시겠습니까?'}
                                              confirmText={'삭제'} loading={deleting} onConfirm={handleRemoveReview}
                                              onCancel={() => setConfirmOpen(false)}/>
                            </div>
                        )}
                    </div>

                    {/* 포스터 / 정보 */}
                    <div className="flex gap-4 mt-14">
                        <div
                            className="w-full relative aspect-[2/3] overflow-hidden bg-surface rounded-xl max-w-[230px]">
                            <img src={`${import.meta.env.VITE_API_SERVER}/uploads/${review.posterUrl}`}
                                 alt={review.contentTitle}
                                 className="h-full w-full object-cover"/>
                        </div>

                        {/* 영화 정보 */}
                        <div className="flex flex-col py-4">

                            {/* 영화 제목 / 개봉년도 */}
                            <div className="flex items-center gap-2 text-gray-200 transition duration-300
                                hover:text-gray-400 cursor-pointer">
                                <Link to={`/movie/${review.contentId}`} className="text-2xl font-semibold">
                                    {review.contentTitle}
                                </Link>
                                <span className="text-sm text-muted">
                                    {new Date(review.releaseAt).getFullYear()}
                                </span>
                            </div>

                            {/* 평점 */}
                            <div className="mt-5 flex items-center gap-2">
                                <div className="flex items-center">
                                    {Array.from({length: 5}).map((_, index) => (
                                        <MdStarRate key={index} size={20} className={index < review.score ?
                                            'text-yellow-500' : 'text-gray-700'}/>
                                    ))}
                                </div>

                                <span className="ml-1 text-sm font-semibold">
                                    {review.score.toFixed(1)}
                                </span>
                            </div>

                            {/* 리뷰 제목 */}
                            <div className="mt-6 break-keep text-xl leading-tight tracking-tight lg:text-3xl">
                                {review.reviewTitle}
                            </div>

                            {/* 작성자 / 작성년도 */}
                            <div className="mt-8 flex gap-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary"/>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm font-medium text-gray-200">
                                        {review.nickname != null ? review.nickname : review.email}
                                    </p>
                                    <p className="text-xs text-muted">
                                        {formatingDate(review.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="my-12 h-px bg-border sm:my-16"/>

                    {/* 리뷰 내용 */}
                    <div className={`text-xl font-light text-gray-300 space-y-7 break-keep leading-8 sm:text-lg sm:leading-9
                        first-letter:text-6xl first-letter:text-primary first-letter:float-left first-letter:mr-2`}>
                        {review.reviewText}
                    </div>
                </section>
            </main>
        </>
    )
}