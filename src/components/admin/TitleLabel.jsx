export default function TitleLabel({title, desc, children}) {
    return (
        <>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                        {title}
                    </h1>
                    {desc && (
                        <p className="mt-2 text-sm leading-6 text-muted">
                            {desc}
                        </p>
                    )}
                </div>
                {children && (
                    <div className="flex shrink-0 items-center gap-2">
                        {children}
                    </div>
                )}
            </div>
        </>
    )
}