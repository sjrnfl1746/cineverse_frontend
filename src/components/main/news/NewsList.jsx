import NewsListItem from "./NewsListItem.jsx";

export default function NewsList({newsList}) {
    return (
        <>
            <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-surface/50 px-5">
                {newsList.map((news, index) => (
                    <NewsListItem key={index} news={news}/>
                ))}
            </div>
        </>
    )
}