import {useEffect, useRef, useState} from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {genreListApi} from "../../api/common/GenreApi.js";
import ContentCard from "../../components/main/common/ContentCard.jsx";
import TitleDesc from "../../components/common/TitleDesc.jsx";
import InputLabel from "../../components/common/InputLabel.jsx";
import Button from "../../components/common/Button.jsx";
import {getRandomContentApi} from "../../api/common/ContentApi.js";
import {toast} from "sonner";

export default function MovieList() {
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // 초기 시드 값 생성 후 20개씩 불러올때 같은 시드값을 보냄
    const [seed] = useState(Math.floor(Math.random() * 1_000_000_000));

    const observerTarget = useRef(null);
    const searchConditionRef = useRef({
        seed,
        type: null,
        keyword: null,
    })


    const [genreList, setGenreList] = useState(null);
    const [selectedGenreId, setSelectedGenreId] = useState(0);

    const [contentPage, setContentPage] = useState(null);

    // 검색 조건
    const [type, setType] = useState('title');
    const [keyword, setKeyword] = useState('');

    useEffect(() => {

        const fetchData = async () => {
            try {
                // 장르 조회
                const genres = await genreListApi();
                setGenreList(genres)

                const searchDTO = { // 초기 값
                    seed: seed,
                    type: null,
                    keyword: null,
                }

                // 콘텐츠 조회
                const contents = await getRandomContentApi(searchDTO, 0);
                setContentPage(contents)
            } catch (error) {
                console.error('에러 발생', error);
                setGenreList(null);
                setContentPage(null);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    useEffect( () => {
        const target = observerTarget.current;

        if (!target || !contentPage || contentPage.last || loadingMore) {
            return;
        }

        const observer = new IntersectionObserver(async ([entry]) => {
            if (!entry.isIntersecting) {
                return;
            }
            setLoadingMore(true);

            try {
                const res = await getRandomContentApi(searchConditionRef.current, contentPage.number + 1);

                setContentPage((prev) => ({
                    ...res,
                    content: [...prev.content, ...res.content],
                }))
            } finally {
                setLoadingMore(false);
            }
        });
        observer.observe(target);

        return () => observer.disconnect();
    }, [contentPage?.number, contentPage?.last, loadingMore]);

    // 콘텐츠 검색
    const handleSearchContent = async () => {
        if (keyword.trim() === '') {
            toast.error('검색어를 입력해주세요.');
            return;
        }

        setLoading(true);

        // 검색 조건
        const searchDTO = {
            type: type,
            keyword: keyword,
            seed: seed,
        }

        searchConditionRef.current = searchDTO;

        try {
            const res = await getRandomContentApi(searchDTO);
            setContentPage(res);
        } catch (error) {
            console.error('에러 발생', error);
            setContentPage(null);
        } finally {
            setLoading(false);
        }
    }

    const contentList = contentPage?.content ?? [];

    // 장르 필터
    const filterContentList = (selectedGenreId === 0)
        ? contentList
        : contentList.filter((content) => content.genres?.some(
            (genre) => genre.genreId === selectedGenreId
        ));

    if (loading) {
        return <LoadingSpinner/>;
    }

    return (
        <>
            <main className="min-h-screen px-5 py-10 text-white sm:px-8 lg:px-12">
                <section className="mx-auto max-w-[1600px]">
                    <TitleDesc label={'MOVIES'} title={'영화'} description={'지금 시청할 영화를 둘러보세요'}/>

                    {/* 검색 */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-full">
                            <InputLabel type={'text'} name={'keyword'} placeholder={'제목을 입력해주세요'}
                                        value={keyword} onChange={(e) => setKeyword(e.target.value)}/>
                        </div>
                        <div className="w-32">
                            <Button type={'button'} label={'검색'} onClick={handleSearchContent}/>
                        </div>
                    </div>

                    {/* filter 목록 */}
                    {genreList && (
                        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
                            <button type='button' onClick={() => setSelectedGenreId(0)}
                                    className={`shrink-0 px-4 py-2 rounded-full border border-border text-sm font-semibold cursor-pointer
                                 ${selectedGenreId === 0 ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                전체
                            </button>
                            {genreList.map((genre, idx) => (
                                <button key={genre.genreId} type="button"
                                        onClick={() => setSelectedGenreId(genre.genreId)}
                                        className={`shrink-0 px-4 py-2 rounded-full border border-border text-sm font-semibold cursor-pointer
                                    ${genre.genreId === selectedGenreId ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    {genre.genreName}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 영화 목록 */}
                    {filterContentList.length <= 0 ? (
                        <div className="text-center text-muted">
                            콘텐츠가 존재하지 않습니다...
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-4 lg:grid-cols-5">
                            {filterContentList.map((content) => (
                                <ContentCard key={content.contentId} content={content}/>
                            ))}
                        </div>
                    )}

                </section>

                {contentPage && !contentPage.last && (
                    <div ref={observerTarget} className="h-10"/>
                )}

                {loadingMore && <LoadingSpinner/>}
            </main>
        </>
    )
}