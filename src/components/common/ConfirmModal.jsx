export default function ConfirmModal({open, title = '확인', message, confirmText = '확인', cancelText = '취소',
                                     confirmVariant = 'danger', loading = false, onConfirm, onCancel}) { // 공통으로 사용할 확인 모달

    if (!open) {
        return null;
    }

    const confirmClass = confirmVariant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-hover';

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
                onClick={onCancel}>
                <div className="w-full max-w-md rounded-2xl border border-border bg-black p-6 shadow-xl"
                    onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-lg font-semibold text-foreground">
                        {title}
                    </h2>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted">
                        {message}
                    </p>

                    <div className="mt-6 flex justify-end gap-2">
                        <button type="button" disabled={loading} onClick={onCancel} className={`rounded-xl border border-border
                            px-4 py-2.5 text-sm font-semibold text-muted transition hover:border-gray-400 hover:text-foreground
                            disabled:cursor-not-allowed disabled:opacity-50`}>
                            {cancelText}
                        </button>

                        <button type="button" disabled={loading} onClick={onConfirm} className={`rounded-xl px-4 py-2.5 text-sm
                            font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${confirmClass}`}>
                            {loading ? '처리 중...' : confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}