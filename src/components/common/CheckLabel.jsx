export default function CheckLabel({label, name, value, checked, onChange}) {
    return (
        <>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
                <input type="checkbox" name={name} value={value} checked={checked} onChange={onChange} className="h-4 w-4 accent-primary"/>
                {label}
            </label>
        </>
    )
}