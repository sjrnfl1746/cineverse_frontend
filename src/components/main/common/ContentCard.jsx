import {Link} from "react-router-dom";

export default function ContentCard({content}) {
    return(
        <>
            <Link to={`/movie/${content.contentId}`} className="group cursor-pointer">
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface">
                    {/* 이미지 */}
                    <img src={`${import.meta.env.VITE_API_SERVER}/uploads/${content.thumbnailUrl}`} alt={content.title} className="h-full w-full object-cover
                        transition-transform duration-300 group-hover:scale-105"/>
                </div>
                {/* 제목 */}
                <h3 className="mt-3 truncate font-medium text-white">
                    {content.title}
                </h3>
                {/* 장르 */}
                <p className="mt-1 truncate text-xs text-muted">
                    {content.genres?.map((genre) => genre.genreName).join(" · ")}
                </p>
            </Link>
        </>
    )
}

function getContentTypeLabel(type) {
    const labels = {
        MOVIE: '영화',
        DRAMA: '드라마',
        ANIMA: '애니',
    };
    return labels[type] ?? '콘텐츠';
}