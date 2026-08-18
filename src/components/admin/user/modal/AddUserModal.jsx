import InputLabel from "../../../common/InputLabel.jsx";
import {useState} from "react";
import Select from "../../../common/Select.jsx";
import {userRoleList} from "../../../../constants/admin/userRoleList.js";
import {toast} from "sonner";

export default function AddUserModal({setShowModal, handleAdd}) {
    const initForm = {
        email: '',
        password: '',
        nickname: '',
        name: '',
        role: '',
    }

    const [form, setForm] = useState(initForm);

    const handleAddUser = async () => {
        if (form.email.trim() === '') {
            toast.error('이메일을 입력해주세요.');
            return;
        }
        if (form.password.trim() === '') {
            toast.error('비밀번호를 입력해주세요.');
            return;
        }
        if (form.nickname.trim() === '') {
            toast.error('닉네임을 입력해주세요.');
            return;
        }
        if (form.name.trim() === '') {
            toast.error('이름을 입력해주세요.');
            return;
        }
        if (form.role.trim() === '') {
            toast.error('권한을 입력해주세요.');
            return;
        }

        try {
            await handleAdd(form);
            setShowModal(false);
        } catch (error) {
            console.error('에러 발생', error);
        }
    }

    const handleChange = (e) => {
        const {name, value, type} = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }))
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                 onClick={() => setShowModal(false)}>
                <div className="w-full max-w-xl rounded-2xl bg-black border border-border p-6 shadow-xl"
                    onClick={(e) => e.stopPropagation()}>

                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">
                            사용자 등록
                        </h2>
                        <button type="button" className="rounded-lg p-2 text-white" onClick={() => setShowModal(false)}>
                            ✕
                        </button>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <InputLabel type={'text'} name={'email'} label={'이메일'} value={form.email}
                                    placeholder={'이메일'} onChange={handleChange}/>
                        <InputLabel type={'password'} name={'password'} label={'비밀번호'} value={form.password}
                                    placeholder={'비밀번호'} onChange={handleChange}/>
                        <InputLabel type={'text'} name={'nickname'} label={'닉네임'} value={form.nickname}
                                    placeholder={'닉네임'} onChange={handleChange}/>
                        <InputLabel type={'text'} name={'name'} label={'이름'} value={form.name}
                                    placeholder={'이름'} onChange={handleChange}/>
                        <Select name={'role'} label={'권한'} value={form.role} options={userRoleList} onChange={handleChange}/>
                    </div>

                    <div className="flex justify-end gap-2 mb-6">
                        <button type={'button'} onClick={() => setForm(initForm)}
                                className="border border-border text-white px-2 py-1 rounded-xl cursor-pointer hover:bg-gray-900">
                            초기화
                        </button>
                        <button type='button' onClick={handleAddUser}
                                className="bg-primary px-2 py-1 rounded-xl hover:bg-primary-hover cursor-pointer">
                            등록
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}