export default function AgreementItem({title, required = false, checked, onChange, oncClick}) {
    return (
        <>
            <div className="rounded-xl border border-border p-4">
                <label className="flex cursor-pointer items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <input type="checkbox" checked={checked} onChange={onChange}
                            className="w-4 h-4 accent-primary"/>

                        <span className="text-sm text-foreground">
                            {title}
                            {required ? (
                                <span className="ml-1 text-primary">
                                    (필수)
                                </span>
                            ) : (
                                <span className="ml-1 text-muted">
                                    (선택)
                                </span>
                            )}
                        </span>
                    </div>

                    <button type="button" onClick={oncClick} className="text-xs text-muted hover:text-primary">
                        보기
                    </button>
                </label>
            </div>
        </>
    )
}