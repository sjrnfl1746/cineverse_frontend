import {use, useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    LuArrowLeft,
    LuCalendarDays,
    LuKeyRound,
    LuMapPin,
    LuSave,
    LuSearch,
    LuUser,
} from "react-icons/lu";
import {useAuthStore} from "../../store/authStore.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import {getUserAddressApi, updateUserApi} from "../../api/common/UserApi.js";
import {toast} from "sonner";

export default function MyPageModify() {
    const {user, isLogin} = useAuthStore();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    // 목업 데이터
    const [form, setForm] = useState({
        nickname: user.nickname,
        name: user.name,
        gender: user.gender,
        birthDate: user.birthDate,
        phoneNumber: user.phoneNumber,

        zipCode: "06236",
        city: "서울특별시",
        district: "강남구",
        street: "테헤란로 123",
        detail: "시네버스빌딩 5층",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 다음 주소 검색
    const handleAddressSearch = () => {
        if (!window.daum?.Postcode) {
            toast.error("주소 검색 기능을 불러오지 못했습니다.");
            return;
        }

        new window.daum.Postcode({
            oncomplete: (data) => {
                const street =
                    data.userSelectedType === "R"
                        ? data.roadAddress
                        : data.jibunAddress;

                setForm((prev) => ({
                    ...prev,
                    zipCode: data.zonecode ?? "",
                    city: data.sido ?? "",
                    district: data.sigungu ?? "",
                    street: street ?? "",
                    detail: "",
                }));
            },
        }).open();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.nickname.trim() === '') {
            toast.error('닉네임을 입력해주세요.');
            return;
        }
        if (form.name.trim() === '') {
            toast.error('이름을 입력해주세요.');
            return;
        }
        if (form.gender.trim() === '') {
            toast.error('성별을 입력해주세요.');
            return;
        }
        if (form.birthDate.trim() === '') {
            toast.error('닉네임을 입력해주세요.');
            return;
        }
        if (form.phoneNumber.trim() === '') {
            toast.error('닉네임을 입력해주세요.');
            return;
        }
        if (form.zipCode.trim() === '') {
            toast.error('우편번호를 입력해주세요.');
            return;
        }
        if (form.city.trim() === '') {
            toast.error('시/도를 입력해주세요.');
            return;
        }
        if (form.district.trim() === '') {
            toast.error('시/군/구를 입력해주세요.');
            return;
        }
        if (form.street.trim() === '') {
            toast.error('도로명 주소를 입력해주세요.');
            return;
        }
        if (form.detail.trim() === '') {
            toast.error('상세주소를 입력해주세요.');
            return;
        }

        try {
            await updateUserApi(form);

            // 수정 후 페이지 이동
            navigate("/mypage", {
                state: {
                    changeUserInfoSuccess: true,
                }
            });
        } catch (error) {
            console.error('에러 발생', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getUserAddressApi();
                setForm((prev) => ({
                    ...prev,
                    zipCode: res.zipCode ? res.zipCode : "",
                    city: res.city ? res.city : "",
                    district: res.district ? res.district : "",
                    street: res.street ? res.street : "",
                    detail: res.detail ? res.detail : "",
                }))
            } catch (error) {
                console.error('에러 발생', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [])

    if (loading) {
        return <LoadingSpinner/>
    }

    if (!isLogin) {
        navigate('/auth/login');
    }

    return (
        <main className="min-h-screen px-5 pb-20 pt-24 text-white sm:px-8 lg:px-12">
            <section className="mx-auto max-w-5xl">
                {/* 페이지 제목 */}
                <div className="mb-8">
                    <p className="text-xs font-semibold tracking-[0.2em] text-primary">
                        ACCOUNT SETTINGS
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        내 정보 수정
                    </h1>

                    <p className="mt-2 text-sm text-muted">
                        회원정보와 주소를 확인하고 수정할 수 있습니다.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* 기본 정보 */}
                        <FormSection
                            icon={LuUser}
                            title="기본 정보"
                            description="서비스에서 사용하는 회원정보입니다."
                        >
                            <div className="grid gap-6 sm:grid-cols-2">
                                <InputField
                                    label="닉네임"
                                    required
                                    type="text"
                                    name="nickname"
                                    value={form.nickname}
                                    maxLength={20}
                                    placeholder="닉네임을 입력해 주세요."
                                    onChange={handleChange}
                                />

                                <InputField
                                    label="이름"
                                    required
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    maxLength={30}
                                    placeholder="이름을 입력해 주세요."
                                    onChange={handleChange}
                                />

                                {/* 성별 */}
                                <div>
                                    <label
                                        htmlFor="gender"
                                        className="mb-2 block text-sm font-semibold text-foreground"
                                    >
                                        성별
                                        <span className="ml-1 text-red-400">*</span>
                                    </label>

                                    <select
                                        id="gender"
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        className="
                                            h-12 w-full rounded-xl
                                            border border-border bg-background
                                            px-4 text-sm text-foreground
                                            outline-none transition
                                            focus:border-primary
                                            focus:ring-2 focus:ring-primary/10
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        "
                                    >
                                        <option value="">선택해 주세요.</option>
                                        <option value="MALE">남성</option>
                                        <option value="FEMALE">여성</option>
                                        <option value="NONE">선택 안 함</option>
                                    </select>
                                </div>

                                <InputField
                                    label="생년월일"
                                    required
                                    type="date"
                                    name="birthDate"
                                    value={form.birthDate}
                                    onChange={handleChange}
                                />

                                <div className="sm:col-span-2">
                                    <InputField
                                        label="전화번호"
                                        required
                                        type="tel"
                                        name="phoneNumber"
                                        value={form.phoneNumber}
                                        maxLength={13}
                                        placeholder="010-0000-0000"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </FormSection>

                        {/* 주소 */}
                        <FormSection
                            icon={LuMapPin}
                            title="주소"
                            description="주소 검색을 이용해 등록된 주소를 변경할 수 있습니다."
                        >
                            <div className="space-y-5">
                                {/* 우편번호 */}
                                <div>
                                    <label
                                        htmlFor="zipcode"
                                        className="mb-2 block text-sm font-semibold text-foreground"
                                    >
                                        우편번호
                                    </label>

                                    <div className="flex gap-2">
                                        <input
                                            id="zipcode"
                                            type="text"
                                            name="zipcode"
                                            value={form.zipCode}
                                            readOnly
                                            placeholder="우편번호"
                                            className="
                                                h-12 min-w-0 flex-1
                                                rounded-xl border border-border
                                                bg-background/60 px-4
                                                text-sm text-muted outline-none
                                            "
                                        />

                                        <button
                                            type="button"
                                            onClick={handleAddressSearch}
                                            className="
                                                inline-flex shrink-0 items-center
                                                justify-center gap-2 rounded-xl
                                                bg-primary px-4
                                                text-sm font-semibold text-white
                                                transition hover:bg-primary-hover
                                                disabled:cursor-not-allowed
                                                disabled:opacity-60
                                            "
                                        >
                                            <LuSearch />
                                            주소 검색
                                        </button>
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <AddressField
                                        label="시/도"
                                        name="city"
                                        value={form.city}
                                    />

                                    <AddressField
                                        label="시/군/구"
                                        name="district"
                                        value={form.district}
                                    />
                                </div>

                                <AddressField
                                    label="도로명 주소"
                                    name="street"
                                    value={form.street}
                                />

                                <InputField
                                    label="상세 주소"
                                    type="text"
                                    name="detail"
                                    value={form.detail}
                                    maxLength={100}
                                    placeholder="상세 주소를 입력해 주세요."
                                    onChange={handleChange}
                                />
                            </div>
                        </FormSection>
                    </div>

                    {/* 하단 버튼 */}
                    <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/mypage")}
                            className="
                                inline-flex items-center justify-center
                                gap-2 rounded-xl
                                border border-border px-5 py-3
                                text-sm font-semibold text-muted
                                transition hover:border-gray-500
                                hover:bg-white/5 hover:text-white
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            <LuArrowLeft />
                            취소
                        </button>

                        <button
                            type="submit"
                            className="
                                inline-flex min-w-36 items-center
                                justify-center gap-2 rounded-xl
                                bg-primary px-5 py-3
                                text-sm font-semibold text-white
                                transition hover:bg-primary-hover
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >
                            <LuSave />
                            변경사항 저장
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

function FormSection({ icon: Icon, title, description, children }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <header className="flex items-center gap-3 border-b border-border px-6 py-5 sm:px-7">
                <span
                    className="
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        rounded-xl bg-primary/10 text-primary
                    "
                >
                    <Icon />
                </span>

                <div>
                    <h2 className="font-semibold text-foreground">
                        {title}
                    </h2>

                    <p className="mt-0.5 text-xs text-muted">
                        {description}
                    </p>
                </div>
            </header>

            <div className="px-6 py-7 sm:px-7">
                {children}
            </div>
        </section>
    );
}

function InputField({
                        label,
                        required = false,
                        ...inputProps
                    }) {
    return (
        <div>
            <label
                htmlFor={inputProps.name}
                className="mb-2 block text-sm font-semibold text-foreground"
            >
                {label}

                {required && (
                    <span className="ml-1 text-red-400">*</span>
                )}
            </label>

            <input
                id={inputProps.name}
                {...inputProps}
                className="
                    h-12 w-full rounded-xl
                    border border-border bg-background
                    px-4 text-sm text-foreground
                    outline-none transition
                    placeholder:text-muted/50
                    focus:border-primary
                    focus:ring-2 focus:ring-primary/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                "
            />
        </div>
    );
}

function AddressField({ label, name, value }) {
    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-semibold text-foreground"
            >
                {label}
            </label>

            <input
                id={name}
                type="text"
                name={name}
                value={value}
                readOnly
                className="
                    h-12 w-full cursor-default
                    rounded-xl border border-border
                    bg-background/60 px-4
                    text-sm text-muted outline-none
                "
            />
        </div>
    );
}