export default function TitleDesc({label, title, description, children}) {
    return (
        <>
            <div className="mt-14 mb-10 flex justify-between items-center">
                <div>
                    <p className="mb-2 text-xs font-bold tracking-[0.25em] text-primary">
                        {label}
                    </p>
                    <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                        {title}
                    </h1>
                    <p className="mt-3 text-sm text-white sm:text-base">
                        {description}
                    </p>
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