import TitleLabel from "../../../components/admin/TitleLabel.jsx";
import {useEffect, useState} from "react";
import {FiCalendar, FiImage, FiInfo, FiTrash2, FiUploadCloud} from "react-icons/fi";
import InputLabel from "../../../components/common/InputLabel.jsx";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {addEventApi} from "../../../api/admin/AdminEventApi.js";

export default function AdminEventAdd() {
    const navigate = useNavigate();

    // 초기 폼
    const initForm = {
        title: '',
        description: '',
        startAt: '',
        endAt: '',
    };

    const [form, setForm] = useState(initForm);

    // 이벤트 포스터
    const [banner, setBanner] = useState(null);
    const [bannerPreview, setBannerPreview] = useState('');

    // 값 변경 메서드
    const handleChange = (e) => {
        const {name, value} = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        // 포스터 최대 용량
        const MAX_BANNER_SIZE = 10 * 1024 * 1024;

        // 파일 크기 유효성 검사
        if (file.size > MAX_BANNER_SIZE) {
            toast.error('포스터는 최대 10MB 까지 등록할 수 있습니다.');
            e.target.value = '';
            return;
        }

        setBanner(file);
        setBannerPreview(URL.createObjectURL(file));

        // 같은 파일을 다시 선택할 수 있도록 초기화
        e.target.value = '';
    };

    // 배너 이미지 제거
    const handleBannerRemove = () => {
        if (bannerPreview) {
            URL.revokeObjectURL(bannerPreview);
        }

        setBanner(null);
        setBannerPreview('');
    }

    // 이벤트 등록 메서드
    const handleSubmit = async (e) => {
        e.preventDefault();

        const today = new Date();

        if (today >= new Date(form.startAt)) {
            toast.error('시작일은 오늘날짜 이후로 설정 가능합니다.');
            return;
        }
        if (new Date(form.startAt) >= new Date(form.endAt)) {
            toast.error('종료일은 시작일 이후로 설정 가능합니다.');
            return;
        }
        if (form.title.trim() === '') {
            toast.error('제목을 입력해주세요.');
            return;
        }
        if (form.description.trim() === '') {
            toast.error('내용을 입력해주세요.');
            return;
        }

        const formData = new FormData();

        const eventBlob = new Blob(
            [JSON.stringify(form)],
            {type: 'application/json'}
        );

        formData.append('poster', banner);
        formData.append('event', eventBlob);

        try {
            await addEventApi(formData);

            navigate(`/admin/event`, {
                state: {
                    addEventSuccess: true,
                }
            })
        } catch (error) {
            console.error('에러 발생', error);
        }
    }

    useEffect(() => {
        return () => {
            if (bannerPreview) {
                URL.revokeObjectURL(bannerPreview);
            }
        }
    }, [bannerPreview]);

    return (
        <>
            <main>
                <TitleLabel title={'이벤트 등록'} desc={'새로운 이벤트를 등록합니다.'}/>

                <form onSubmit={handleSubmit} className="mt-8 overflow-hidden rounded-2xl border border-border">

                    {/* 상단 안내 */}
                    <div className="border-b border-border px-6 py-5 sm:px-8">
                        <h2 className="text-lg font-semibold text-foreground">
                            이벤트 정보
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            캐러셀과 이벤트 페이지에 표시할 정보를 입력해주세요.
                        </p>
                    </div>

                    <div className="space-y-10 px-6 py-8 sm:px-8">
                        {/* 이벤트 배너 */}
                        <section>
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-foreground">
                                    이벤트 배너
                                </h3>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    가로형 이미지를 등록해주세요.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* 캐러셀 미리보기 */}
                                <div
                                    className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl border border-border bg-muted/30">
                                    {bannerPreview ? (
                                        <>
                                            <img src={bannerPreview} alt={'이벤트 배너 미리보기'}
                                                 className="absolute inset-0 h-full w-full object-cover"/>

                                            <div className="absolute inset-y-0 left-0 flex-wrap w-[72%] flex-col justify-center
                                                p-5 sm:p-5 lg:p-12">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2 w-2 rounded-full bg-primary"/>

                                                    <span
                                                        className="text-[10px] font-semibold tracking-[0.25em] text-white/65 sm:text-xs">
                                                        EVENT
                                                    </span>
                                                </div>
                                            </div>

                                            <button type='button' onClick={handleBannerRemove} className="absolute right-4 top-4
                                                flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white
                                                backdrop-blur transition hover:bg-red-500">
                                                <FiTrash2/>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <label className="flex h-full cursor-pointer flex-col items-center justify-center
                                                transition hover:bg-muted/50">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-full
                                                    bg-background text-muted-foreground shadow-sm">
                                                    <FiImage className="text-2xl"/>
                                                </div>

                                                <p className="mt-4 text-sm font-medium text-foreground">
                                                    이벤트 배너 미리보기
                                                </p>
                                            </label>
                                        </>
                                    )}
                                </div>

                                {/* 파일 선택 */}
                                <label className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed
                                    border-border bg-muted/10 px-5 py-5 transition hover:border-primary hover:bg-primary/[0.03]">
                                    <div
                                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <FiUploadCloud className='text-xl'/>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {banner ? banner.name : '가로형 이미지를 선택해주세요'}
                                        </p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            JPG, PNG, WEBP · 권장 1920 × 840px · 최대 10MB
                                        </p>

                                        {banner && (
                                            <p className="mt-1 text-xs text-primary">
                                                {(banner.size / 1024 / 1024).toFixed(2)}{" "}MB
                                            </p>
                                        )}
                                    </div>

                                    <span className="shrink-0 rounded-lg border border-border bg-background px-4 py-2 text-xs
                                        font-medium text-foreground transition group-hover:border-primary group-hover:text-primary">
                                        {banner ? '이미지 변경' : '파일 선택'}
                                    </span>

                                    <input type={'file'} accept={'image/jpeg, image/png, image/webp'}
                                           onChange={handleBannerChange} className="sr-only"/>
                                </label>

                                <div className="flex items-start gap-2 rounded-xl bg-muted/30 px-4 py-3">
                                    <FiInfo className="mt-0.5 shrink-0 text-muted-foreground"/>

                                    <p className="text-xs leading-5 text-muted-foreground">
                                        이미지 왼쪽에는 이벤트 제목과 같이 설명이 표시됩니다. 중요한 피사체는 중앙이나
                                        오른쪽에 배치하는 것을 권장합니다.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="border-t border-border"/>

                        {/* 이벤트 제목 */}
                        <section>
                            <InputLabel type={'text'} label={'이벤트 제목'} name={'title'} placeholder={'이벤트 제목을 입력해주세요'}
                                        value={form.title} onChange={handleChange} maxLength={100}/>
                            <div className="mt-2 flex justify-end">
                                <span className="text-xs text-muted-foreground">
                                    {form.title.length} / 100
                                </span>
                            </div>
                        </section>

                        {/* 이벤트 설명 */}
                        <section>
                            <label className="mb-2.5 block text-sm font-medium text-foreground">
                                이벤트 설명
                            </label>

                            <textarea name={'description'} maxLength={2000} value={form.description}
                                      placeholder={'이벤트에 대한 설명을 입력해주세요'}
                                      onChange={handleChange} rows={8} className="w-full resize-none rounded-xl border border-border
                                        bg-background px-4 py-2.5 text-sm leading-6 text-foreground outline-none transition
                                        placeholder:text-muted-foreground/60 focus:outline-none"/>
                            <div className="mt-2 flex items-center justify-between gap-4">
                                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <FiInfo/>
                                    이벤트 상세 페이지와 캐러셀에 표시되는 내용입니다.
                                </p>

                                <span className="shrink-0 text-xs text-muted-foreground">
                                    {form.description.length} / 2000
                                </span>
                            </div>
                        </section>

                        {/* 이벤트 기간 */}
                        <section>
                            <div className="mb-3">
                                <h3 className="text-sm font-medium text-foreground">
                                    이벤트 기간
                                </h3>
                            </div>

                            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
                                <InputLabel type={'date'} label={'시작일'} name={'startAt'} value={form.startAt}
                                            onChange={handleChange}/>
                                <span className="hidden h-12 items-center text-sm text-muted-foreground md:flex">
                                        ~
                                    </span>
                                <InputLabel type={'date'} label={'종료일'} name={'endAt'} value={form.endAt}
                                            onChange={handleChange}/>
                            </div>
                        </section>
                    </div>

                    <div
                        className="flex flex-col-reverse gap-3 border-t border-border px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
                        <button type={'button'} onClick={() => navigate(-1)} className="h-11 rounded-xl
                            border border-border bg-background px-6 text-sm font-medium text-foreground transition hover:bg-muted">
                            취소
                        </button>

                        <button type='submit' className="h-11 rounded-xl bg-primary px-7 text-sm font-semibold
                            text-primary-foreground transition hover:bg-primary-hover">
                            이벤트 등록
                        </button>
                    </div>
                </form>
            </main>
        </>
    )
}