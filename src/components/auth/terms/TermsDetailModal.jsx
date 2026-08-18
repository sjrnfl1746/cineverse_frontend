import {FiX} from "react-icons/fi";

export default function TermsDetailModal({term, onClose}) {
    if (!term) {
        return null;
    }

    return (
        <>
            <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                <div onClick={(e) => e.stopPropagation()}
                     className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded-2xl border border-border
                     bg-surface shadow-xl">
                    <div className="flex items-center justify-between border-b border-border px-5 py-4">

                        <h2 className="text-lg font-bold text-foreground">
                            {term.title}
                        </h2>

                        <button type="button" onClick={onClose} className="text-muted hover:text-foreground">
                            <FiX size={22}/>
                        </button>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto px-5 py-4 text-sm leading-6 text-muted">
                        {term.content}
                    </div>

                    <div className="border-t border-border px-5 py-4">
                        <button type="button" onClick={onClose} className="w-full rounded-xl bg-primary py-3
                            font-semibold text-white hover:bg-primary-hover">
                            확인
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}