export default function ContentDetailItem({label, value}) {
    return (
        <>
            <div>
                <dt className="text-xs font-medium text-muted">
                    {label}
                </dt>

                <dd className="mt-1.5 text-sm font-medium text-foreground">
                    {value || "-"}
                </dd>
            </div>
        </>
    )
}