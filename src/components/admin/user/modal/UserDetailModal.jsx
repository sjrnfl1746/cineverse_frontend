import Select from "../../../common/Select.jsx";
import {userRoleList} from "../../../../constants/admin/userRoleList.js";
import {userStatusList} from "../../../../constants/admin/userStatusList.js";
import {useEffect, useState} from "react";
import LoadingSpinner from "../../../common/LoadingSpinner.jsx";
import {getUserByIdApi} from "../../../../api/admin/AdminUserApi.js";
import {formatDate} from "../../../../utils/subscriptionUtils.js";
import {formatTimeAgo} from "../../../../utils/dateUtils.js";
import {toast} from "sonner";

export default function UserDetailModal({setShowModal, userId, onChange}) {
    const [loading, setLoading] = useState(true);
    const [changing, setChanging] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getUserByIdApi(userId);
                setUser(res);
            } catch (error) {
                console.error('에러 발생', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [userId])

    const handleSelectChange = async (e) => {
        const {name, value} = e.target;

        if (value.trim() === '') {
            toast.error('값을 선택해주세요.');
            return;
        }

        try {
            setChanging(true);

            await onChange(userId, {
                [name]: value,
            });

            setUser((prev) => ({
                ...prev,
                [name]: value,
            }))
            setShowModal(false);
        } catch (error) {
            console.error('에러 발생', error);
        } finally {
            setChanging(false);
        }
    }

    if (loading) {
        return <LoadingSpinner/>
    }

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                 onClick={() => setShowModal(false)}>
                <div className="w-full max-w-md rounded-2xl bg-black border border-border p-6 shadow-xl"
                     onClick={(e) => e.stopPropagation()}>

                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">
                            사용자 상세
                        </h2>
                        <button type="button" className="rounded-lg p-2 text-white" onClick={() => setShowModal(false)}>
                            ✕
                        </button>
                    </div>

                    <div className="mb-6 flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-secondary"/>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-semibold text-white">{user.nickname}</p>
                                {user.subscribed && <p className="text-xs bg-secondary px-2 py-1 rounded-full">구독중</p>}
                            </div>
                            <p className="text-sm font-medium text-muted">{user.email}</p>
                        </div>
                    </div>

                    <div className="divide-y divide-border rounded-xl border border-border">
                        <InfoRow label={'이름'} value={user.name}/>
                        <InfoRow label={'전화번호'} value={user.phoneNumber}/>
                        <InfoRow label={'생년월일'} value={formatDate(user.birthDate)}/>
                        <InfoRow label={'가입일'} value={formatTimeAgo(user.createdAt)}/>
                    </div>

                    <div className="mt-4">
                        <Select name={'role'} label={'권한'} value={user.role} options={userRoleList}
                            onChange={handleSelectChange} disabled={user.role === 'ROLE_ADMIN'}/>
                    </div>

                    <div className="mt-4">
                        <Select name={'status'} label={'상태'} value={user.status} options={userStatusList}
                                onChange={handleSelectChange} disabled={user.role === 'ROLE_ADMIN'}/>
                    </div>

                    {changing && (
                        <p className="mt-3 text-center text-sm text-muted">
                            변경사항을 저장하는 중입니다...
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}

function InfoRow({label, value}) {
    return (
        <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-white">{label}</span>
            <span className="text-sm font-medium text-white">{value}</span>
        </div>
    )
}