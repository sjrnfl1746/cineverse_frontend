import Button from "../common/Button.jsx";
import {addReviewApi} from "../../api/common/ReviewApi.js";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";
import ConfirmModal from "../common/ConfirmModal.jsx";

export default function ReviewForm({movie, onChangeMovie}) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        contentId: movie.contentId,
        score: 0,
        reviewTitle: '',
        reviewText: '',
        spoiler: false,
    });

    // 등록 확인
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [adding, setAdding] = useState(false);

    // 리뷰 등록 메서드
    const handleAddReview = async () => {

        if (formData.score === 0) {
            toast.error('별점을 선택해주세요.')
            return;
        }

        if (formData.reviewTitle.trim() === '') {
            toast.error('한줄평을 작성해주세요.');
            return;
        }

        if (formData.reviewText.trim() === '') {
            toast.error('리뷰를 작성해주세요.');
            return;
        }

        try {
            setAdding(true);
            await addReviewApi(formData);

            // 리뷰 목록 페이지 이동
            navigate('/review', {
                state: {
                    addReviewSuccess: true,
                }
            })
        } catch (error) {
            console.error('에러 발생', error);
        } finally {
            setAdding(false);
            setConfirmOpen(false);
        }
    }

    return (
        <>
            <form className="space-y-6">
                <div className="flex items-center gap-4 rounded-xl bg-white/5 p-4">
                    <img src={`${import.meta.env.VITE_API_SERVER}/uploads/${movie.thumbnailUrl}`}
                         alt={`${movie.title} 포스터`}
                         className="h-28 w-20 rounded object-cover"/>

                    <div className="w-full lg:flex lg:justify-between">
                        <div className="flex-1">
                            <h2 className="text-lg font-bold">
                                {movie.title}
                            </h2>
                        </div>

                        <button type='button' onClick={onChangeMovie} className="text-sm text-primary">
                            영화 변경
                        </button>
                    </div>
                </div>

                <div>
                    <label className="mb-2 block font-semibold">
                        별점
                    </label>

                    <select name='score' required value={formData.score}
                            onChange={(e) => setFormData({...formData, score: Number(e.target.value)})}
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
                    <label className='mb-2 block font-semibold'>
                        한줄평
                    </label>
                    <input type="text" placeholder={'한줄평을 남겨주세요'} value={formData.reviewTitle}
                           onChange={(e) => setFormData({...formData, reviewTitle: e.target.value})}
                           className="w-full resize-none rounded-lg border border-border focus:outline-none px-4 py-3"/>
                </div>

                <div>
                    <label className="mb-2 block font-semibold">
                        리뷰
                    </label>
                    <textarea required maxLength={1000} rows={10} placeholder={'영화를 보고 느낀 점을 작성해 주세요'}
                              value={formData.reviewText}
                              onChange={(e) => setFormData({...formData, reviewText: e.target.value})}
                              className="w-full resize-none rounded-lg border border-border p-4 focus:outline-none"/>
                </div>

                <label className="flex items-center gap-2">
                    <input type='checkbox' value={formData.spoiler}
                           onChange={(e) => setFormData({...formData, spoiler: e.target.checked})}/>
                    스포일러가 포함되어 있어요
                </label>

                <Button label={'리뷰 등록'} type={'button'} onClick={() => setConfirmOpen(true)}/>

                {/* 등록 확인 */}
                <ConfirmModal open={confirmOpen} title={'리뷰 등록'} message={'리뷰를 등록하시겠습니까?'} confirmText={'등록'}
                              loading={adding} onConfirm={handleAddReview}
                              onCancel={() => setConfirmOpen(false)}/>
            </form>
        </>
    )
}