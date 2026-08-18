import {useNavigate} from "react-router-dom";
import AgreementItem from "../../../components/auth/AgreementItem.jsx";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import {useSignupStore} from "../../../store/signupStore.js";
import {getActiveTermsApi} from "../../../api/common/TermsApi.js";
import TermsDetailModal from "../../../components/auth/terms/TermsDetailModal.jsx";

export default function Terms() {
    const navigate = useNavigate();

    const {setTermsAgreement} = useSignupStore();

    const [terms, setTerms] = useState([]); // 이용 약관
    const [checkedTermsIds, setCheckedTermsIds] = useState([]); // 체크된 약관 id들
    const [loading, setLoading] = useState(true); // 로딩중

    const [selectedTerm, setSelectedTerm] = useState(null); // 선택된 약관

    const fetchTerms = async () => {
        try {
            const data = await getActiveTermsApi();
            setTerms(data);
        } catch (error) {
            console.error('에러메시지: ', error);
            /*
             * error.response?.data?.message: 백엔드가 내려준 에러 메시지를 꺼내는 코드
             * ?? 뒷부분: 앞의 값이 null 이거나 undefined면 기본 값 사용
             */
            toast.error(error.response?.data?.message ?? '오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTerms();
    }, [])

    // 전체 체크 여부 확인
    const isAllChecked = terms.length > 0 && checkedTermsIds.length === terms.length;

    // 필수 값 체크 여부 확인
    const isRequiredChecked = terms.filter((term) => term.required)
        .every((term) => checkedTermsIds.includes(term.termsId));

    // 전체 체크
    const handleAllCheck = (checked) => {
        if (checked) {
            setCheckedTermsIds(terms.map((term) => term.termsId));
            return;
        }

        setCheckedTermsIds([]);
    };

    // 개별 체크
    const handleCheck = (termsId) => {
        setCheckedTermsIds((prev) =>
            prev.includes(termsId) ? prev.filter((id) => id !== termsId) : [...prev, termsId]);
    };

    // 다음 버튼
    const handleNext = () => {
        if (!isRequiredChecked) {
            toast.error('필수 약관에 모두 동의해 주세요.');
            return;
        }

        // 약관 동의 내역 저장
        setTermsAgreement(checkedTermsIds);

        // 회원 정보 페이지로 이동
        navigate('/auth/signup/info');
    }

    if (loading) {
        return <LoadingSpinner/>;
    }

    return (
        <>
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-foreground">
                        약관 동의
                    </h1>

                    <p className="mt-2 text-sm text-muted">
                        CINEVERSE 이용을 위해 약관에 동의해주세요.
                    </p>
                </div>

                {/* 전체동의 */}
                <label className="mb-4 flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4">
                    <input type="checkbox" checked={isAllChecked} onChange={(e) => handleAllCheck(e.target.checked)}
                           className="h-4 w-4 accent-primary"/>
                    <span className="font-semibold text-foreground">
                        전체 동의
                    </span>
                </label>

                <div className="space-y-3">
                    {terms.map((term) => (
                        <AgreementItem key={term.termsId} title={term.title} required={term.required}
                                       checked={checkedTermsIds.includes(term.termsId)}
                                       onChange={() => handleCheck(term.termsId)}
                                       oncClick={() => setSelectedTerm(term)}/>
                    ))}

                    {selectedTerm && (
                        <TermsDetailModal term={selectedTerm} onClose={() => setSelectedTerm(null)}/>
                    )}
                </div>

                <button type="button" onClick={handleNext} disabled={!isRequiredChecked}
                        className="mt-6 w-full rounded-xl bg-primary py-3 font-semibold text-white transition
                    hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
                    다음
                </button>
            </div>
        </>
    )
}