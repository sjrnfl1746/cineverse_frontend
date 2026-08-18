export default function PhoneNumberInput({name, label, value, placeholder, onChange}) {

    // 전화번호 형식 포맷
    const formatPhoneNumber = (inputValue) => {

        // 숫자만 남김
        let onlyNumber = inputValue.replace(/\D/g, "").slice(0, 11);

        if (onlyNumber.length <= 3) {
            return onlyNumber;
        }

        if (onlyNumber.length <= 7) {
            return onlyNumber.replace(/(\d{3})(\d+)/, "$1-$2");
        }

        return onlyNumber.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
    };

    const handleChange = (e) => {
        const formattedValue = formatPhoneNumber(e.target.value);

        onChange({
            target: {
                name,
                value: formattedValue,
            }
        })
    }

    return (
        <>
            <div>
                <label className="mb-2 block text-sm font-medium text-muted">
                    {label}
                </label>
                <input name={name} type="tel" placeholder={placeholder} onChange={handleChange} inputMode={'numeric'}
                       value={value} maxLength={13} className="w-full rounded-xl border border-border bg-background
                       px-4 py-3 text-sm text-white outline-none"/>
            </div>
        </>
    )
}