export default function Select({name, label, value, onChange, options, disabled = false}) {
    return (
        <>
            <div>
                <label className="mb-2 block text-sm font-medium text-muted">
                    {label}
                </label>
                <select name={name} value={value} onChange={onChange} className="w-full rounded-xl border border-border
                bg-background px-4 py-3 text-sm text-foreground outline-none" disabled={disabled}>
                    <option value="">선택</option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>{option.name}</option>
                    ))}
                </select>
            </div>
        </>
    )
}