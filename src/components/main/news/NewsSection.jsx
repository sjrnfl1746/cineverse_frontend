import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {mockNewsList} from "../../../constants/main/news/mockNewsList.js";
import FeaturedNewsCard from "./FeaturedNewsCard.jsx";
import NewsList from "./NewsList.jsx";
import {getNewsApi} from "../../../api/common/newsApi.js";
import offset from "aos/src/js/libs/offset.js";
import LoadingSpinner from "../../common/LoadingSpinner.jsx";

export default function NewsSection() {
    const [loading, setLoading] = useState(true);

    const [newsList, setNewsList] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getNewsApi();
                setNewsList(res.items || [])
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    if (loading) {
        return <LoadingSpinner/>
    }

    const sideNewsList = newsList.slice(1, 5);

    return (
        <>
            <section className="py-16">
                <div className="mx-auto max-w-8xl px-6 lg:px-8">
                    {/* 제목 */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <span className="text-sm font-semibold text-primary">
                                News
                            </span>
                            <h2 className="mt-2 text-xl font-bold text-white md:text-2xl">
                                최신 콘텐츠 뉴스
                            </h2>
                        </div>

                        {/* link */}
                        <Link to={'/news'} className="flex items-center gap-1 text-sm text-muted
                            transition-colors hover:text-white">
                            더보기
                        </Link>
                    </div>

                    {/* 뉴스 영역 */}
                    {newsList.length <= 0 ? (
                        <div className="text-center text-muted">
                            뉴스가 존재하지 않습니다...
                        </div>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                            {/* 주요 기사 */}
                            <FeaturedNewsCard news={newsList[0]}/>

                            {/* 기사 리스트 */}
                            <NewsList newsList={sideNewsList}/>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}