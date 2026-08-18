import {Link} from "react-router-dom";
import ContentCard from "./ContentCard.jsx";
import {useEffect, useState} from "react";
import {getTop6ContentApi} from "../../../api/common/ContentApi.js";
import LoadingSpinner from "../../common/LoadingSpinner.jsx";

export default function ContentSection({title, link}) {
    const [loading, setLoading] = useState(true);

    const [contentList, setContentList] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getTop6ContentApi();
                setContentList(res);
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

    return (
        <>
            <section>
                <div className="mx-auto max-w-8xl px-6 lg:px-8">
                    {/* 제목 / 더보기 */}
                    <div className="mb-5 flex items-center justify-between">
                        {/* title */}
                        <h2 className="text-xl font-bold text-white md:text-2xl">
                            {title}
                        </h2>

                        {/* link */}
                        <Link to={link} className="text-sm text-muted transition-colors hover:text-primary">
                            더보기
                        </Link>
                    </div>

                    {/* content */}
                    {contentList.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                            {contentList.map((content) => (
                                <ContentCard key={content.contentId} content={content}/>
                            ))}
                        </div>) : (
                        <div className="text-center text-muted">
                            콘텐츠가 존재하지 않습니다...
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}