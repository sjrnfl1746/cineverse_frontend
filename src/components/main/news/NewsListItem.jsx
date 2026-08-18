import {formatNewsDate, removeHtml} from "../../../utils/newsUtils.js";

export default function NewsListItem({news}) {
    return (
        <>
            <article className="group py-5 first:pt-5 last:pb-5">
                <a href={news.link} target="_blank" rel="noopener noreferrer" className="flex gap-4">
                    <div className="min-w-0 flex-1">
                        <time className="text-xs text-muted">
                            {formatNewsDate(news.pubDate)}
                        </time>

                        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-gray-200
                            transition-colors group-hover:text-primary md:text-base">
                            {removeHtml(news.title)}
                        </h3>

                        <p className="mt-2 line-clamp-1 text-xs text-muted">
                            {removeHtml(news.description)}
                        </p>
                    </div>
                </a>
            </article>
        </>
    )
}