import InputLabel from "../../components/common/InputLabel.jsx";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import SocialLoginButton from "../../components/common/SocialLoginButton.jsx";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import CheckLabel from "../../components/common/CheckLabel.jsx";
import {loginApi} from "../../api/common/AuthApi.js";
import {useAuthStore} from "../../store/authStore.js";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const {login} = useAuthStore();

    const initForm = {
        email: "",
        password: "",
        rememberMe: false,
    };

    const [loginForm, setLoginForm] = useState(initForm);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        setLoginForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    // 로그인
    const handleLogin = async () => {

        // 로그인 dto
        const loginRequestDTO = {
            email: loginForm.email,
            password: loginForm.password,
            rememberMe: loginForm.rememberMe,
        };

        try {
            const res = await loginApi(loginRequestDTO);

            // 정보 저장
            login(res);

            // 메인 페이지로 이동
            navigate('/', {
                state: {
                    loginSuccess: true,
                }
            });
        } catch (error) {
            console.error('에러 발생', error);
            toast.error(error.response?.data?.message ?? '오류가 발생했습니다.');
        }
    }

    useEffect(() => {
        if (location.state?.signupSuccess) {
            toast.success('회원가입이 완료되었습니다.');
        }

        if (location.state?.notLogin) {
            toast.error('로그인이 필요한 서비스입니다.')
        }
    }, []);

    return (
        <>
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-semibold">
                        로그인
                    </h1>
                </div>

                {/* 일반 로그인 */}
                <form className="space-y-5">
                    <InputLabel name={'email'} value={loginForm.email} label={"이메일"}
                                type={"text"} placeholder={"이메일을 입력해주세요"} onChange={handleChange}/>
                    <InputLabel name={'password'} value={loginForm.password} label={"비밀번호"}
                                type={"password"} placeholder={"비밀번호를 입력해주세요"} onChange={handleChange}/>

                    {/* 자동 로그인 */}
                    <CheckLabel label={'자동 로그인'} name={'rememberMe'} checked={loginForm.rememberMe}
                                onChange={handleChange}/>

                    <Button type={"button"} label={"로그인"} onClick={handleLogin}/>
                </form>

                {/* 회원가입 / 비밀번호 찾기 */}
                <div className="mt-5 flex justify-center gap-4 text-sm text-muted">
                    <Link to="/auth/signup/terms" className="hover:text-primary transition duration-300">
                        회원가입
                    </Link>
                    {/*<span>|</span>
                    <Link to="#" className="hover:text-primary transition duration-300">
                        비밀번호 찾기
                    </Link>*/}
                </div>

                {/*<div className="my-7 flex items-center gap-4">
                    <div className="h-px flex-1 bg-border"/>
                    <span className="text-xs text-muted">또는</span>
                    <div className="h-px flex-1 bg-border"/>
                </div>*/}

                {/* 소셜 로그인 */}
                {/*<div className="space-y-3">
                    <SocialLoginButton provider={'kakao'}/>
                    <SocialLoginButton provider={'google'}/>
                </div>*/}
            </div>
        </>
    )
}