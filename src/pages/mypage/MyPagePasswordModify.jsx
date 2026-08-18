import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LuArrowLeft,
    LuCheck,
    LuEye,
    LuEyeOff,
    LuKeyRound,
    LuLockKeyhole,
    LuSave,
    LuShieldCheck,
} from "react-icons/lu";
import InputLabel from "../../components/common/InputLabel.jsx";
import {changePasswordApi} from "../../api/common/UserApi.js";
import {useAuthStore} from "../../store/authStore.js";

export default function MyPagePasswordModify() {
    const navigate = useNavigate();
    const {isLogin} = useAuthStore();

    const initForm = {
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    }

    const [form, setForm] = useState(initForm);

    const handleOnChange = (e) => {
        const {name, value} = e.target;

        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();

        const changePasswordRequestDTO = {
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
        }

        try {
            await changePasswordApi(changePasswordRequestDTO);

            // 변경후 마이페이지로 이동
            navigate('/mypage', {
                state: {
                    changePasswordSuccess: true,
                }
            })
        } catch (error) {
            console.error('에러 발생', error);
        }
    }

    if (!isLogin) {
        navigate('/auth/login');
    }

    return (
        <main className="min-h-screen px-5 pb-20 pt-24 text-white sm:px-8 lg:px-12">
            <section className="mx-auto max-w-2xl">
                {/* 페이지 제목 */}
                <div className="mb-8">
                    <p className="text-xs font-semibold tracking-[0.2em] text-primary">
                        ACCOUNT SECURITY
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                        비밀번호 변경
                    </h1>

                    <p className="mt-2 text-sm text-muted">
                        계정을 안전하게 보호할 수 있도록 비밀번호를 변경합니다.
                    </p>
                </div>

                <form onSubmit={handleChangePassword}>
                    <section className="overflow-hidden rounded-3xl border border-border bg-card">
                        {/* 폼 제목 */}
                        <header className="flex items-center gap-4 border-b border-border px-6 py-6 sm:px-8">
                            <span
                                className="
                                    flex h-11 w-11 shrink-0
                                    items-center justify-center
                                    rounded-xl bg-primary/10
                                    text-lg text-primary
                                "
                            >
                                <LuKeyRound />
                            </span>

                            <div>
                                <h2 className="font-semibold text-foreground">
                                    비밀번호 정보
                                </h2>

                                <p className="mt-1 text-xs text-muted">
                                    현재 비밀번호 확인 후 새 비밀번호로 변경됩니다.
                                </p>
                            </div>
                        </header>

                        <div className="space-y-6 px-6 py-7 sm:px-8 sm:py-8">

                            {/* 현재 비밀번호 */}
                            <InputLabel label={'현재 비밀번호'} type={'password'} maxLength={100} name={'currentPassword'}
                                placeholder={'현재 비밀번호를 입력해주세요'} value={form.currentPassword} onChange={handleOnChange}/>

                            {/* 새로운 비밀번호 */}
                            <InputLabel label={'새 비밀번호'} type={'password'} maxLength={100} name={'newPassword'}
                                        placeholder={'새로운 비밀번호를 입력해주세요'} value={form.newPassword} onChange={handleOnChange}/>

                            {/* 새로운 비밀번호 확인 */}
                            <InputLabel label={'새 비밀번호 확인'} type={'password'} maxLength={100} name={'confirmNewPassword'}
                                        placeholder={'새로운 비밀번호를 다시 입력해주세요'} value={form.confirmNewPassword} onChange={handleOnChange}/>
                        </div>
                    </section>

                    {/* 보안 안내 */}
                    <div
                        className="
                            mt-5 flex items-start gap-3
                            rounded-2xl border border-border
                            bg-card/60 px-5 py-4
                        "
                    >
                        <LuShieldCheck className="mt-0.5 shrink-0 text-primary" />

                        <p className="text-xs leading-5 text-muted">
                            다른 사이트에서 사용하는 비밀번호와 다르게 설정하고,
                            개인정보가 포함된 비밀번호는 사용하지 않는 것을
                            권장합니다.
                        </p>
                    </div>

                    {/* 버튼 */}
                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
                            disabled={(form.currentPassword.trim() === '') || (form.newPassword.trim() === '')
                                || (form.confirmNewPassword.trim() === '') || (form.newPassword !== form.confirmNewPassword)}
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
                            비밀번호 변경
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}