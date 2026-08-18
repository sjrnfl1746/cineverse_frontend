import {formatNewsDate, removeHtml} from "../../../utils/newsUtils.js";

export default function FeaturedNewsCard({ news }) {
    return (
        <article className="group h-full overflow-hidden rounded-2xl border border-border">
            <a
                href={news.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
            >
                <div className="relative h-full min-h-[320px] overflow-hidden bg-white/5">
                    <NewsPlaceholder />

                    <div className="absolute inset-0 bg-gradient-to-r
                        from-black/80 via-black/10 to-transparent"
                    />

                    <span className="absolute left-5 top-5 rounded-full bg-primary
                        px-3 py-1 text-xs font-semibold text-white">
                        주요 뉴스
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                        <time className="text-xs text-gray-300">
                            {formatNewsDate(news.pubDate)}
                        </time>

                        <h3 className="mt-2 line-clamp-2 text-xl font-bold text-white
                            transition-colors group-hover:text-primary md:text-2xl">
                            {removeHtml(news.title)}
                        </h3>

                        <p className="mt-3 hidden line-clamp-2 text-sm leading-6
                            text-gray-300 sm:block">
                            {removeHtml(news.description)}
                        </p>
                    </div>
                </div>
            </a>
        </article>
    );
}

function NewsPlaceholder() {
    return (
        <div className="absolute inset-0 flex items-center justify-center
            bg-gradient-to-br from-primary/30 to-secondary/30">
            <div className="text-center">
                <p className="text-sm font-semibold text-primary">
                    CINEVERSE
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                    MOVIE NEWS
                </p>
            </div>
        </div>
    );
}