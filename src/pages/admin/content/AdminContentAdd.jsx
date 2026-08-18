import TitleLabel from "../../../components/admin/TitleLabel.jsx";
import {useEffect, useState} from "react";
import InputLabel from "../../../components/common/InputLabel.jsx";
import {genreListApi} from "../../../api/common/GenreApi.js";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import CheckLabel from "../../../components/common/CheckLabel.jsx";
import Select from "../../../components/common/Select.jsx";
import {ageRatingList} from "../../../constants/admin/ageRatingList.js";
import {contentStatusList} from "../../../constants/admin/contentStatusList.js";
import {addContentApi} from "../../../api/admin/AdminContentApi.js";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";

export default function AdminContentAdd() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const initForm = {
        title: '', // 제목
        ogTitle: '', // 원제
        description: '', // 설명
        releaseAt: '', // 공개일
        endAt: '', // 종료일
        runningTime: 0, // 러닝타임
        productionCountry: '', // 제작국가
        ageRating: '', // 관람 연령
        contentStatus: '', // 콘텐츠 상태
        trailerUrl: '', // 트레일러 url
        genreIds: [], // 장르 id
    }

    const [form, setForm] = useState(initForm);
    const [poster, setPoster] = useState(null);
    const [posterPreview, setPosterPreview] = useState(null); // 포스터 미리보기
    const [genreList, setGenreList] = useState([]);

    // 값 변경
    const handleChange = (e) => {
        const {name, value, type} = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    // 장르 체크박스 변경
    const handleGenreChange = (e) => {
        const genreId = Number(e.target.value);
        const checked = e.target.checked;

        setForm((prev) => ({
            ...prev,
            genreIds: checked ? [...prev.genreIds, genreId] : prev.genreIds.filter((id) => id !== genreId)
        }));
    }

    // 포스터 변경
    const handlePosterChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setPoster(null);
            setPosterPreview(null);
            return;
        }

        // 포스터 최대 용량 10MB
        const MAX_POSTER_SIZE = 10 * 1024 * 1024;

        // 파일 크기 유효성 검사
        if (file.size > MAX_POSTER_SIZE) {
            toast.error('포스터는 최대 10MB 까지 등록할 수 있습니다.');
            e.target.value = '';
            return;
        }

        // 파일 mimeType 유효성 검사
        if (!file.type.startsWith('image/')) {
            toast.error('이미지 파일만 등록이 가능합니다.');
            return;
        }

        setPoster(file);
        setPosterPreview(URL.createObjectURL(file));
    }

    // 콘텐츠 등록
    const handleAddContent = async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (form.title.trim() === '') {
            toast.error('제목을 입력해주세요.');
            return;
        }
        if (form.ogTitle.trim() === '') {
            toast.error('원제를 입력해주세요.');
            return;
        }
        if (form.productionCountry.trim() === '') {
            toast.error('제작국가를 입력해주세요.');
            return;
        }
        if (form.runningTime <= 0) {
            toast.error('러닝타임을 입력해주세요.');
            return;
        }
        if (form.description.trim() === '') {
            toast.error('설명을 입력해주세요.');
            return;
        }
        if (form.releaseAt.trim() === '') {
            toast.error('공개일을 입력해주세요.');
            return;
        }
        if (form.endAt.trim() === '') {
            toast.error('종료일을 입력해주세요.');
            return;
        }
        if (form.ageRating.trim() === '') {
            toast.error('관람등급을 입력해주세요.');
            return;
        }
        if (form.contentStatus.trim() === '') {
            toast.error('콘텐츠 상태를 입력해주세요.');
            return;
        }
        if (form.trailerUrl.trim() === '') {
            toast.error('트레일러 URL을 입력해주세요.');
            return;
        }
        if (form.genreIds.length === 0) {
            toast.error('장르를 한개이상 선택해주세요.');
            return;
        }
        if (!poster) {
            toast.error('포스터를 등록해주세요.');
            return;
        }

        const formData = new FormData();

        const contentBlob = new Blob(
            [JSON.stringify(form)],
            {type: 'application/json'}
        );

        formData.append('content', contentBlob);
        formData.append('poster', poster);

        try {

            const contentId = await addContentApi(formData);

            setForm(initForm);
            setPoster(null);
            setPosterPreview(null);

            navigate(`/admin/content/${contentId}/video/add`);
        } catch (error) {
            console.error('에러 발생', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await genreListApi();
                setGenreList(res);
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [])

    useEffect(() => {
        return () => {
            if (posterPreview) {
                URL.revokeObjectURL(posterPreview);
            }
        }
    }, [posterPreview])

    if (loading) {
        return <LoadingSpinner/>
    }

    return (
        <>
            <form onSubmit={handleAddContent}>
                <TitleLabel title="콘텐츠 등록" desc="콘텐츠의 기본 정보와 공개 정보를 등록합니다.">
                    <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white cursor-pointer">
                        등록
                    </button>
                </TitleLabel>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    {/* 왼쪽 */}
                    <div className="space-y-6">
                        <section className="rounded-2xl border border-border bg-card p-6">
                            <h2 className="mb-5 text-lg font-semibold text-foreground">
                                기본 정보
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">
                                <InputLabel type="text" label="제목" name="title" placeholder="제목" value={form.title}
                                            onChange={handleChange}/>
                                <InputLabel type="text" label="원제" name="ogTitle" placeholder="원제" value={form.ogTitle}
                                            onChange={handleChange}/>
                                <InputLabel type="text" label="제작 국가" name="productionCountry" placeholder="제작 국가"
                                            value={form.productionCountry} onChange={handleChange}/>
                                <InputLabel type="number" label="러닝타임" name="runningTime" min="0" placeholder="분 단위"
                                            value={form.runningTime} onChange={handleChange}/>
                            </div>

                            <label className="mt-5 block">
                                <span className="mb-2 block text-sm font-medium text-muted">
                                    설명
                                </span>
                                <textarea name="description" value={form.description} onChange={handleChange} rows={7}
                                          placeholder="콘텐츠 설명을 입력하세요." className="w-full resize-none rounded-xl border border-border
                                          bg-background px-4 py-3 text-sm text-foreground outline-none"/>
                            </label>
                        </section>

                        <section className="rounded-2xl border border-border bg-card p-6">

                            <h2 className="mb-5 text-lg font-semibold text-foreground">
                                공개 정보
                            </h2>

                            <div className="grid gap-5 md:grid-cols-2">
                                <InputLabel type="date" label="공개일" name="releaseAt" value={form.releaseAt}
                                            onChange={handleChange}/>
                                <InputLabel type="date" label="종료일" name="endAt" value={form.endAt}
                                            onChange={handleChange}/>
                                <Select name="ageRating" label="관람 등급" value={form.ageRating} onChange={handleChange}
                                        options={ageRatingList}/>
                                <Select name="contentStatus" label="콘텐츠 상태" value={form.contentStatus}
                                        onChange={handleChange}
                                        options={contentStatusList}/>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-border bg-card p-6">

                            <h2 className="mb-5 text-lg font-semibold text-foreground">
                                미디어 정보
                            </h2>

                            <InputLabel type="url" label="트레일러 URL" name="trailerUrl" placeholder="트레일러 URL"
                                        value={form.trailerUrl} onChange={handleChange}/>
                        </section>
                    </div>

                    {/* 오른쪽 */}
                    <aside className="space-y-6">
                        <section className="rounded-2xl border border-border bg-card p-6">

                            <h2 className="mb-5 text-lg font-semibold text-foreground">
                                포스터
                            </h2>

                            <label className="block cursor-pointer">
                                <div className="flex aspect-[2/3] items-center justify-center overflow-hidden
                                    rounded-xl border border-dashed border-border bg-background">
                                    {posterPreview ? (
                                        <img src={posterPreview} alt="포스터 미리보기" className="h-full w-full object-cover"/>
                                    ) : (
                                        <span className="px-4 text-center text-sm text-muted">
                                                포스터 이미지를 선택하세요.
                                            </span>
                                    )}
                                </div>

                                <input type="file" accept="image/*" onChange={handlePosterChange} className="hidden"/>
                            </label>

                            {poster && (
                                <p className="mt-3 truncate text-sm text-muted">
                                    {poster.name}
                                </p>
                            )}
                        </section>

                        <section className="rounded-2xl border border-border bg-card p-6">
                            <h2 className="mb-5 text-lg font-semibold text-foreground">
                                장르
                            </h2>

                            <div className="grid grid-cols-2 gap-3">
                                {genreList.map((genre) => (
                                    <CheckLabel key={genre.genreId} label={genre.genreName} name="genreIds"
                                                value={genre.genreId}
                                                checked={form.genreIds.includes(genre.genreId)}
                                                onChange={handleGenreChange}/>
                                ))}
                            </div>

                            {genreList.length === 0 && (
                                <p className="text-sm text-muted">
                                    등록된 장르가 없습니다.
                                </p>
                            )}
                        </section>
                    </aside>
                </div>
            </form>
        </>
    )
}