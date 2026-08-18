import TitleDesc from "../../components/common/TitleDesc.jsx";
import {useEffect, useState} from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {getNewsApi} from "../../api/common/newsApi.js";
import {formatingDate} from "../../utils/dateUtils.js";
import {FaArrowRight} from "react-icons/fa";

export default function NewsList() {
    const [loading, setLoading] = useState(true);

    const [newsList, setNewsList] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getNewsApi(19);
                setNewsList(res.items || []);
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    // 뉴스글에 존재하는 html 태그 제거
    const decodeHtml = (value = '') => {
        const parser = new DOMParser();

        return (parser.parseFromString(value, 'text/html').body.textContent || "");
    };

    if (loading) {
        return <LoadingSpinner/>
    }
    const featuredNews = newsList[0];
    const remainingNews = newsList.slice(1);

    return (
        <>
            <main className="relative min-h-screen overflow-hidden px-5 py-10 text-white sm:px-8 lg:px-12">
                {/* 배경 장식 */}
                <div className="pointer-events-none absolute left-[-180px] top-[100px] h-[420px] w-[420px]
                    rounded-full bg-blue-600/10 blur-[120px]"/>
                <div className="pointer-events-none absolute right-[-140px] top-[500px] h-[380px] w-[380px]
                    rounded-full bg-violet-600/10 blur-[120px]"/>

                <section className="relative mx-auto max-w-[1600px]">
                    <TitleDesc label={'NEWS'} title={'뉴스'} description={'새로운 이야기와 주요 소식을 만나보세요'}/>

                    {newsList.length === 0 ? (
                        <div className="mt-16 text-center text-muted">
                            현재 등록된 뉴스가 없습니다...
                        </div>
                    ) : (
                        <>
                            {/* 대표 뉴스 */}
                                <a href={featuredNews.link || featuredNews.originallink} target={'_blank'}
                                   rel="noopener noreferrer"
                                   className="group relative mt-12 block overflow-hidden rounded-[32px] border border-border
                               bg-[#101217] transition duration-500 hover:border-white/30">

                                    <div
                                        className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.18),transparent_38%)]"/>
                                    <div
                                        className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent"/>

                                    <div className="relative grid min-h-[420px] lg:grid-cols-[0.65fr_1.35fr]">
                                        <div
                                            className="flex flex-col justify-between border-b border-border p-7 lg:border-r lg:p-10">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_16px_rgb(96,165,250,0.9)]"/>
                                                <span className="text-xs font-medium tracking-[0.25em] text-blue-300">
                                                FEATURED STORY
                                            </span>
                                            </div>

                                            <div className="mt-16 lg:mt-0">
                                                <p className="text-sm text-white/40">
                                                    NEWS
                                                </p>
                                                <p className="mt-2 text-sm text-white/60">
                                                    {formatingDate(featuredNews.pubDate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14">
                                            <div>
                                                <h2 className="max-w-4xl text-3xl font-semibold leading-tight
                                                tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                                                    {decodeHtml(featuredNews.title)}
                                                </h2>

                                                <p className="mt-7 max-w-3xl text-base leading-8 text-white/55 sm:text-lg">
                                                    {decodeHtml(featuredNews.description)}
                                                </p>
                                            </div>

                                            <div className="mt-12 flex items-center justify-between">
                                            <span className="text-sm text-white/40">
                                                원문 기사로 이동
                                            </span>

                                                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border
                                                transition duration-300 group-hover:rotate-[-45deg] group-hover:bg-blue-500 group-hover:text-white">
                                                <FaArrowRight/>
                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>

                                {/* 목록 상단 */}
                                <div className="mt-24 flex items-end justify-between border-b border-border pb-6">
                                    <div>
                                        <p className="text-xs tracking-[0.25em] text-blue-400">
                                            LATEST ARTICLES
                                        </p>
                                        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                                            최신 뉴스
                                        </h2>
                                    </div>

                                    <span className="text-sm tabular-nums text-white/35">
                                        ARTICLES
                                    </span>
                                </div>

                                {/* 메거진형 뉴스 그리드 */}
                            <div className="grid border-l border-border sm:grid-cols-2 xl:grid-cols-3">
                                {remainingNews.map((news, index) => (
                                    <a key={index} href={news.link || news.originallink} target={'_blank'} rel="noopener noreferrer"
                                       className="group relative flex min-h-[360px] flex-col border-b border-r border-border
                                        bg-white/[0.015] p-7 transition duration-500 hover:z-10 hover:bg-white/[0.06] sm:p-8">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-xs text-white/25">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>

                                            <span className="max-w-[170px] truncate rounded-full border border-white/10
                                                px-3 py-1.5 text-[11px] text-white/40 transition
                                                group-hover:border-blue-400/30 group-hover:text-blue-300">
                                                NEWS
                                            </span>
                                        </div>

                                        <div className="my-auto py-10">
                                            <h3 className="line-clamp-3 text-lg font-medium leading-snug tracking-[-0.025em]
                                                text-white/90 transition duration-300 group-hover:text-white sm:text-2xl">
                                                {decodeHtml(news.title)}
                                            </h3>

                                            <p className="mt-5 line-clamp-2 text-sm leading-6 text-white/40
                                                transition group-hover:text-white/55">
                                                {decodeHtml(news.description)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-white/10 pt-5">
                                            <time className="text-xs text-white/30">
                                                {formatingDate(news.pubDate)}
                                            </time>

                                            <span className="translate-x-1 text-white/30 opacity-0 transition duration-300
                                                group-hover:translate-x-0 group-hover:text-blue-400 group-hover:opacity-100">
                                                <FaArrowRight/>
                                            </span>
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0
                                            bg-gradient-to-r from-blue-500 to-violet-500 transition-transform duration-500
                                            group-hover:scale-x-100"/>
                                    </a>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </main>
        </>
    )
}