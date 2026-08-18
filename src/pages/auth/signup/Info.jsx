import InputLabel from "../../../components/common/InputLabel.jsx";
import {useState} from "react";
import Button from "../../../components/common/Button.jsx";
import Select from "../../../components/common/Select.jsx";
import {genderOptions} from "../../../constants/genderOptions.js";
import Address from "../../../components/auth/Address.jsx";
import {toast} from "sonner";
import {sendMailCodeApi, verifyEmailCodeApi} from "../../../api/common/MailApi.js";
import PhoneNumberInput from "../../../components/common/PhoneNumberInput.jsx";
import {useSignupStore} from "../../../store/signupStore.js";
import {signupApi} from "../../../api/common/AuthApi.js";
import {useNavigate} from "react-router-dom";

export default function Info() {
    const navigate = useNavigate();
    const {agreedTermsIds, clearTermsAgreement} = useSignupStore();

    const initForm = {
        email: "",
        emailCode: "",
        password: "",
        passwordCheck: "",
        nickname: "",
        name: "",
        gender: "",
        birthDate: "",
        phoneNumber: "",
        address: {
            zipCode: "",
            city: "",
            district: "",
            street: "",
            detail: "",
        }
    };

    const [form, setForm] = useState(initForm);

    const [codeSent, setCodeSent] = useState(false); // 인증번호 발송 여부
    const [emailVerified, setEmailVerified] = useState(false); // 이메일 인증완료 여부

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/; // 이메일 정규식
    const phoneRegex = /^010-\d{4}-\d{4}$/; // 전화번호 정규식

    // 필수 입력값들 입력 여부 확인
    const isSignupValid =
        form.email.trim() !== '' &&
        emailVerified &&
        form.password.trim() !== '' &&
        form.passwordCheck.trim() !== '' &&
        form.password === form.passwordCheck &&
        form.nickname.trim() !== '' &&
        form.name.trim() !== '' &&
        form.gender !== '' &&
        form.birthDate !== '' &&
        phoneRegex.test(form.phoneNumber.trim()) &&
        form.address.zipCode.trim() !== '' &&
        form.address.city.trim() !== '' &&
        form.address.district.trim() !== '' &&
        form.address.street.trim() !== '';

    // 입력값 변경 메서드
    const handleChange = (e) => {
        const {name, value} = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        // 이메일인 경우 인증번호 발송 여부 / 이메일 인증완료 여부 초기화
        if (name === 'email') {
            setCodeSent(false);
            setEmailVerified(false);
        }
    }

    // 인증번호 전송 메서드
    const handleSendCode = async () => {
        if (form.email.trim() === '') {
            toast.error('이메일을 입력해주세요.');
            return;
        }

        if (!emailRegex.test(form.email)) {
            toast.error('올바른 이메일 형식이 아닙니다.');
            return;
        }

        // 회원가입 이메일 인증 DTO
        const emailCodeSendRequestDTO = {
            email: form.email,
            type: "SIGNUP",
        }

        try {
            await sendMailCodeApi(emailCodeSendRequestDTO)
            setCodeSent(true);
            toast.success('인증번호를 발송했습니다.');
        } catch (error) {
            console.error('에러 발생', error);
            toast.error(error.response?.data?.message ?? '오류가 발생했습니다.');
        }
    }

    // 인증번호 검증 메서드
    const handleVerifyCode = async () => {
        if (form.emailCode.trim() === '') {
            toast.error('인증번호를 입력해주세요.');
            return;
        }

        // 인증코드 발송 DTO
        const emailCodeVerifyRequestDTO = {
            email: form.email,
            code: form.emailCode,
            type: "SIGNUP",
        }

        try {
            await verifyEmailCodeApi(emailCodeVerifyRequestDTO);
            setEmailVerified(true);
            toast.success('이메일 인증이 완료되었습니다.');
        } catch (error) {
            console.error('에러 발생', error);
            toast.error(error.response?.data?.message ?? '오류가 발생했습니다.');
        }
    }

    // 회원가입 메서드
    const handleSignup = async () => {
        if (!isSignupValid) {
            toast.error('필수 정보를 모두 입력하고 이메일 인증을 완료해주세요.');
            return;
        }

        if (!phoneRegex.test(form.phoneNumber)) {
            toast.error('전화번호는 010-0000-0000 형식으로 입력해주세요.');
            return;
        }

        // 회원가입 dto
        const signupRequestDTO = {
            email: form.email,
            password: form.password,
            nickname: form.nickname,
            name: form.name,
            gender: form.gender,
            birthDate: form.birthDate,
            phoneNumber: form.phoneNumber,
            address: form.address,
            agreedTermsIds: agreedTermsIds,
        }

        try {
            await signupApi(signupRequestDTO);
            clearTermsAgreement(); // 약관동의 초기화
            setForm(initForm); // 입력 폼 초기화
            setCodeSent(false); // 코드 전송여부 초기화
            setEmailVerified(false); // 이메일 인증여부 초기화

            // 로그인 페이지로 이동
            navigate('/auth/login', {
                state: {
                    signupSuccess: true,
                }
            });
        } catch (error) {
            console.error('에러 발생', error);
            toast.error(error.response?.data?.message ?? '오류가 발생했습니다.');
        }

        console.log(form);
    }

    return (
        <>
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-lg mb-12">
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-foreground">
                        회원 정보 입력
                    </h1>

                    <p className="mt-2 text-sm text-muted">
                        CINEVERSE 가입을 위한 정보를 입력해주세요.
                    </p>
                </div>

                <div className="space-y-4">

                    {/* 이메일 */}
                    <div className="flex flex-col gap-2">
                        <InputLabel name={'email'} label={'이메일'} type={'text'}
                                    onChange={handleChange} value={form.email} placeholder={'이메일을 입력해주세요'}/>
                        <Button type={'button'} label={'이메일 인증'} onClick={handleSendCode}/>
                    </div>

                    {/* 이메일 코드 */}
                    {codeSent && (<div className="flex flex-col gap-2">
                        <InputLabel name={'emailCode'} label={'인증번호'} type={'text'}
                                    onChange={handleChange} value={form.emailCode} placeholder={'인증번호 입력'}/>
                        <Button type={'button'} label={'확인'} onClick={handleVerifyCode}/>
                    </div>)}

                    {/* 비밀번호 */}
                    <InputLabel name={'password'} label={'비밀번호'} type={'password'}
                                onChange={handleChange} value={form.password} placeholder={'비밀번호를 입력해주세요'}/>

                    {/* 비밀번호 확인 */}
                    <div className="flex flex-col gap-2">
                        <InputLabel name={'passwordCheck'} label={'비밀번호 확인'} type={'password'}
                                    onChange={handleChange} value={form.passwordCheck} placeholder={'비밀번호를 다시 입력해주세요'}/>

                        {form.passwordCheck !== "" && (
                            form.password === form.passwordCheck ? (
                                <span className="text-xs text-success">
                                    비밀번호가 일치합니다.
                                </span>
                            ) : (
                                <span className="text-xs text-danger">
                                    비밀번호가 일치하지 않습니다.
                                </span>
                            )
                        )}
                    </div>

                    {/* 닉네임 */}
                    <InputLabel name={'nickname'} label={'닉네임'} type={'text'}
                                onChange={handleChange} value={form.nickname} placeholder={'닉네임을 입력해주세요'}/>

                    {/* 이름 */}
                    <InputLabel name={'name'} label={'이름'} type={'text'}
                                onChange={handleChange} value={form.name} placeholder={'이름을 입력해주세요'}/>

                    {/* 성별 */}
                    <Select name={'gender'} label={'성별'} onChange={handleChange}
                            value={form.gender} options={genderOptions}/>

                    {/* 생년월일 */}
                    <InputLabel name={'birthDate'} label={'생년월일'} type={'date'}
                                onChange={handleChange} value={form.birthDate} placeholder={'생년월일을 입력해주세요'}/>

                    {/* 전화번호 */}
                    <PhoneNumberInput name={'phoneNumber'} label={'전화번호'} value={form.phoneNumber}
                                      onChange={handleChange} placeholder={'010-0000-0000'}/>

                    {/* 주소 */}
                    <Address form={form.address} setForm={setForm} onChange={handleChange}/>

                    {/* 회원가입 버튼 */}
                    <Button type={'button'} label={'회원가입'} disabled={!isSignupValid} onClick={handleSignup}/>
                </div>
            </div>
        </>
    )
}