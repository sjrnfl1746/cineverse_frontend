export default function Button({type, label, onClick, disabled = false}) {
    return (
        <>
            <button type={type} onClick={onClick} disabled={disabled}
                    className={`w-full rounded-xl py-3 font-semibold text-white
                    transition-colors duration-300 ${disabled ? 'bg-primary-hover cursor-not-allowed' :
                        'bg-primary hover:bg-primary-hover cursor-pointer'}`}>
                {label}
            </button>
        </>
    )
}