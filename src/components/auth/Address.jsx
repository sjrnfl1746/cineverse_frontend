export default function Address({form, setForm}) {

    // 조소 찾기
    const handleSearchAddress = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                const address = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;
                const parts = address.split(" "); // 공백으로 분리

                setForm((prev) => ({
                    ...prev,
                    address: {
                        ...prev.address,
                        zipCode: data.zonecode,
                        city: parts[0] ?? "",
                        district: parts[1] ?? "",
                        street: parts.slice(2).join(" "),
                    }
                }))
            }
        }).open();
    }

    return (
        <>
            <div className="flex flex-col gap-2">
                <label className="mb-2 block text-sm font-medium text-muted">
                    주소
                </label>
                <div className="flex gap-2">
                    <input type="text" placeholder="우편번호" value={form.zipCode} readOnly
                           className="w-1/2 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"/>
                    <button type="button" onClick={handleSearchAddress}
                            className="w-1/2 px-2 py-1 bg-primary rounded-full text-sm
                            transition duration-300 hover:bg-primary-hover cursor-pointer">
                        우편번호로 찾기
                    </button>
                </div>
                <input type="text" placeholder="주소" value={(form.city + " " + form.district + " " + form.street).trim()}
                       readOnly className="w-full rounded-xl border border-border bg-background
                       px-4 py-3 text-sm outline-none"/>
                <input name="detail" type="text" placeholder="상세주소" value={form.detail}
                       onChange={(e) => setForm((prev) => ({
                           ...prev,
                           address: {
                               ...prev.address,
                               detail: e.target.value,
                           }
                       }))}
                       className="w-full rounded-xl border border-border bg-background
                       px-4 py-3 text-sm outline-none"/>

            </div>
        </>
    )
}