import {LuChevronLeft, LuChevronRight} from "react-icons/lu";

export default function Pagination({currentPage, totalPages, first, last, onPageChange, }) {

    if (totalPages <= 1) {
        return null;
    }

    const pages = Array.from({length: totalPages}, (_, index) => index,);

    return (
        <div className="flex items-center justify-center gap-2 border-t border-border px-6 py-4">
            <button type="button" disabled={first} onClick={() => onPageChange(currentPage - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border
                    text-foreground transition hover:border-primary hover:text-primary
                    disabled:cursor-not-allowed disabled:opacity-40">
                <LuChevronLeft/>
            </button>

            {pages.map((page) => (
                <button key={page} type="button" onClick={() => onPageChange(page)}
                        className={`h-9 w-9 rounded-lg text-sm font-medium transition ${currentPage === page ? 'bg-primary text-white'
                            : 'border border-border text-foreground hover:border-primary hover:text-primary'}`}>
                    {page + 1}
                </button>
            ))}

            <button type="button" disabled={last} onClick={() => onPageChange(currentPage + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border
                    text-foreground transition hover:border-primary hover:text-primary
                    disabled:cursor-not-allowed disabled:opacity-40">
                <LuChevronRight/>
            </button>
        </div>
    );
}