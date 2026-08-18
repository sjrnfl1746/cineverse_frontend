export default function InputLabel({name, label = null, type, value, placeholder, onChange, maxLength = 1000}) {
    return (
        <>
            <div>
                <label className={`${label !== null ? 'mb-2' : ''} block text-sm font-medium text-muted`}>
                    {label}
                </label>
                <input name={name} type={type} value={value} placeholder={placeholder} onChange={onChange} maxLength={maxLength}
                       className="w-full rounded-xl border border-border
                       bg-background px-4 py-3 text-sm text-white outline-none"/>
            </div>
        </>
    )
}