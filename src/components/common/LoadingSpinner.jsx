export default function LoadingSpinner({message = "불러오는 중입니다..."}) {
    return (
        <>
            <div className="flex flex-col items-center justify-center py-16 text-muted">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"/>
                <p className="text-sm">{message}</p>
            </div>
        </>
    )
}