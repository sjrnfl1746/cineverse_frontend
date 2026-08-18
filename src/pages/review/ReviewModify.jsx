import TitleDesc from "../../components/common/TitleDesc.jsx";
import {useEffect, useState} from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {getReviewByContentReviewIdApi, updateReviewApi} from "../../api/common/ReviewApi.js";
import {MdKeyboardDoubleArrowLeft} from "react-icons/md";
import Button from "../../components/common/Button.jsx";
import ConfirmModal from "../../components/common/ConfirmModal.jsx";
import {toast} from "sonner";

export default function ReviewModify() {
    const {contentReviewId} = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    // 기존 리뷰
    const [existReview, setExistReview] = useState(null);

    // 수정 확인
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [modifing, setModifing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getReviewByContentReviewIdApi(contentReviewId);
                setExistReview(res || null);
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    // 수정 메서드
    const handleModifyReview = async () => {
        if (existReview.score === 0) {
            toast.error('별점을 선택해주세요.')
            return;
        }

        if (existReview.reviewTitle.trim() === '') {
            toast.error('한줄평을 작성해주세요.');
            return;
        }

        if (existReview.reviewText.trim() === '') {
            toast.error('리뷰를 작성해주세요.');
            return;
        }

        const modifyDTO = {
            reviewTitle: existReview.reviewTitle,
            reviewText: existReview.reviewText,
            spoiler: existReview.spoiler,
            score: existReview.score,
        }

        try {
            setModifing(true);
            await updateReviewApi(contentReviewId, modifyDTO);

            // 수정 후 기존 상세 페이지로 이동
            navigate(`/review/${existReview.contentReviewId}`, {
                state: {
                    updateReviewSuccess: true,
                }
            })
        } catch (error) {
            console.error('에러 발생', error);
        } finally {
            setModifing(false);
            setConfirmOpen(false);
        }
    }

    if (loading) {
        return <LoadingSpinner/>
    }

    if (existReview === null) {
        navigate('/review', {
            state: {
                reviewModifyNotExist: true,
            }
        });
    }

    return (
        <>
            <main className="min-h-screen px-5 py-10 text-white sm:px-8 lg:px-12">
                <section className="mx-auto max-w-[1600px]">
                    <TitleDesc title={'리뷰 수정'} description={'작성된 리뷰를 수정합니다'}>
                        <Link to={`/review/${existReview.contentReviewId}`} className="flex justify-center items-center
                            gap-2 px-4 py-2 border border-border rounded-xl text-muted hover:border-gray-600
                            transition duration-300">
                            <MdKeyboardDoubleArrowLeft/>
                            리뷰
                        </Link>
                    </TitleDesc>

                    <form className="space-y-6">
                        <div className="flex items-center gap-4 rounded-xl bg-white/5 p-4">
                            <img src={`${import.meta.env.VITE_API_SERVER}/uploads/${existReview.posterUrl}`}
                                 alt={`${existReview.contentTitle} 포스터`} className="h-28 w-20 rounded object-cover"/>

                            <div className="flex-1">
                                <h2 className="text-lg font-bold">
                                    {existReview.contentTitle}
                                </h2>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold">
                                별점
                            </label>
                            <select name='score' required value={existReview.score}
                                    onChange={(e) => setExistReview({...existReview, score: Number(e.target.value)})}
                                    className="w-full rounded-lg bg-surface px-4 py-3 focus:outline-none">
                                <option value={0}>별점을 선택해주세요</option>
                                <option value={5}>★★★★★ 5점</option>
                                <option value={4}>★★★★☆ 4점</option>
                                <option value={3}>★★★☆☆ 3점</option>
                                <option value={2}>★★☆☆☆ 2점</option>
                                <option value={1}>★☆☆☆☆ 1점</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold">
                                한줄평
                            </label>
                            <input type='text' placeholder={'한줄평을 남겨주세요'} value={existReview.reviewTitle}
                                   onChange={(e) => setExistReview({...existReview, reviewTitle: e.target.value})}
                                   className="w-full resize-none rounded-lg border border-border focus:outline-none px-4 py-3"/>
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold">
                                리뷰
                            </label>
                            <textarea required maxLength={1000} rows={10} placeholder={'영화를 보고 느낀 점을 작성해 주세요'}
                                      value={existReview.reviewText}
                                      onChange={(e) => setExistReview({...existReview, reviewText: e.target.value})}
                                      className="w-full resize-none rounded-lg border border-border p-4 focus:outline-none"/>
                        </div>

                        <label className="flex items-center gap-2">
                            <input type='checkbox' value={existReview.spoiler} checked={existReview.spoiler}
                                   onChange={(e) => setExistReview({...existReview, spoiler: e.target.checked})}/>
                            스포일러가 포함되어 있어요
                        </label>

                        <Button label={'리뷰 수정'} type={'button'} onClick={() => setConfirmOpen(true)}/>

                        {/* 수정 확인 */}
                        <ConfirmModal open={confirmOpen} title={'리뷰 수정'} message={'리뷰를 수정하시겠습니까?'} confirmText={'수정'}
                                      loading={modifing} onConfirm={handleModifyReview}
                                      onCancel={() => setConfirmOpen(false)}/>
                    </form>
                </section>
            </main>
        </>
    )
}