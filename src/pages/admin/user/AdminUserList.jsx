import TitleLabel from "../../../components/admin/TitleLabel.jsx";
import UserStatusCard from "../../../components/admin/user/UserStatusCard.jsx";
import Select from "../../../components/common/Select.jsx";
import {useEffect, useState} from "react";
import {userTypeList} from "../../../constants/admin/userTypeList.js";
import InputLabel from "../../../components/common/InputLabel.jsx";
import Button from "../../../components/common/Button.jsx";
import LoadingSpinner from "../../../components/common/LoadingSpinner.jsx";
import {addUserApi, getUserListApi, getUserSummaryApi, modifyUserApi} from "../../../api/admin/AdminUserApi.js";
import {toast} from "sonner";
import UserStatusBadge from "../../../components/admin/user/UserStatusBadge.jsx";
import UserRoleBadge from "../../../components/admin/user/UserRoleBadge.jsx";
import Pagination from "../../../components/common/Pagination.jsx";
import {formatTimeAgo} from "../../../utils/dateUtils.js";
import UserDetailModal from "../../../components/admin/user/modal/UserDetailModal.jsx";
import {LuPlus} from "react-icons/lu";
import AddUserModal from "../../../components/admin/user/modal/AddUserModal.jsx";

export default function AdminUserList() {
    const [loading, setLoading] = useState(true);

    // 검색 조건
    const [type, setType] = useState('');
    const [keyword, setKeyword] = useState('');

    const [userSummary, setUserSummary] = useState(null); // 사용자 요약 저장
    const [userPage, setUserPage] = useState(null); // 사용자 응답 저장

    // 사용자 정보 관련 모달
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // 사용자 추가 관련 모달
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchUserList = async (page = 0) => {
        const search = {
            type: type?.trim() || null,
            keyword: keyword || null,
            page,
            size: 10,
        }

        setLoading(true);

        try {
            const res = await getUserListApi(search);
            setUserPage(res);
        } catch (error) {
            console.error('사용자 목록 조회 실패', error);
            setUserPage(null);
            toast.error('사용자를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 검색 메서드
    const handleSearch = () => {
        if (type.trim() === '') {
            toast.error('검색 조건을 선택해주세요.');
            return;
        }
        if (keyword.trim() === '') {
            toast.error('검색어를 입력해주세요.');
            return;
        }

        fetchUserList(0); // 첫 페이지 부터 조회
    }

    // 페이지 변경
    const handlePageChange = (page) => {
        if (page < 0 || page >= userPage.totalPages) {
            return;
        }
        fetchUserList(page);
    }

    // 사용자 정보 변경
    const handleChangeUserInfo = async (userId, userModifyRequestDTO) => {
        try {
            await modifyUserApi(userId, userModifyRequestDTO);

            const [summary] = await Promise.all([
                getUserSummaryApi(),
                fetchUserList(userPage?.number ?? 0),
            ]);
            setUserSummary(summary);
            toast.success('사용자 정보가 변경되었습니다.');
        } catch (error) {
            console.error('에러 발생', error);
            toast.error('사용자 정보 변경에 실패했습니다.');
        }
    }

    // 시용자 추가
    const handleAddUser = async (addUserRequestDTO) => {
        try {
            await addUserApi(addUserRequestDTO);

            const [summary] = await Promise.all([
                getUserSummaryApi(),
                fetchUserList(userPage?.number ?? 0),
            ]);
            setUserSummary(summary);
            toast.success('사용자가 등록되었습니다.');
        } catch (error) {
            console.error('에러 발생', error);
            toast.error('사용자 등록에 실패했습니다.')
        }
    }

    useEffect(() => {
        const fetchInitData = async () => {
            setLoading(true);

            try {
                // 사용자 요약 정보 조회
                const summary = await getUserSummaryApi();
                setUserSummary(summary);

                const res = await getUserListApi({
                    type: null,
                    keyword: null,
                    page: 0,
                    size: 10,
                });
                setUserPage(res);
            } catch (error) {
                console.error('에러 발생', error);
                setUserPage(null);
                toast.error('사용자를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        }
        fetchInitData();
    }, [])

    if (loading) {
        return <LoadingSpinner/>
    }

    const userList = userPage?.content ?? [];

    return (
        <>
            <TitleLabel title={'회원 관리'} desc={'회원 정보와 서비스 이용 상태를 관리합니다.'}>
                <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5
                    text-sm font-semibold text-white transition hover:bg-primary-hover cursor-pointer"
                    onClick={() => setShowAddModal(true)}>
                    <LuPlus className="text-base"/>
                    회원 추가
                </button>
            </TitleLabel>

            {/* 회원 통계 카드 */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {userSummary.map((member) => (
                    <UserStatusCard key={member.title} status={member}/>
                ))}
            </section>

            {/* 회원 검색 */}
            <section className="mt-8 rounded-2xl border border-border p-5">
                <div className="flex items-end gap-4">
                    <div className="w-32">
                        <Select name="type" value={type} onChange={(e) => setType(e.target.value)}
                                options={userTypeList}/>
                    </div>
                    <div className="flex-1">
                        <InputLabel type='text' name='keyword' value={keyword} placeholder='닉네임 또는 이메일 검색'
                                    onChange={(e) => setKeyword(e.target.value)}/>
                    </div>
                    <div className="w-32">
                        <Button type="button" label='검색' onClick={handleSearch}/>
                    </div>
                </div>
            </section>

            {/* 회원 목록 */}
            <section className="mt-6 overflow-hidden rounded-2xl border border-border">
                {!userPage ? (
                    <div className="py-16 text-center text-muted">
                        사용자들을 불러오지 못했습니다...
                    </div>
                ) : (
                    userList.length === 0 ? (
                        <div className="py-16 text-center text-muted">
                            검색 조건에 해당하는 사용자가 존재하지 않습니다...
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px]">
                                    <thead className="bg-background/50">
                                    <tr className="border-b border-border text-left text-sm text-muted">
                                        <th className="px-6 py-4">회원</th>
                                        <th className="px-6 py-4">권한</th>
                                        <th className="px-6 py-4">상태</th>
                                        <th className="px-6 py-4">가입일</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {userList.map((user) => (
                                        <tr key={user.userId}
                                            className="border-b border-border last:border-b-0 hover:bg-background/40">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="h-14 w-14 bg-white rounded-full bg-gradient-to-r from-primary to-secondary"/>

                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            {user.nickname}
                                                        </p>
                                                        <p className="mt-1 text-sm text-muted">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <UserRoleBadge role={user.role}/>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-foreground">
                                                <UserStatusBadge status={user.status}/>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-foreground">
                                                {formatTimeAgo(user.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="border border-border rounded-lg p-3 py-2 text-sm text-foreground
                                                    transition hover:border-primary hover:text-primary cursor-pointer"
                                                        onClick={() => {
                                                            setShowModal(true)
                                                            setSelectedUserId(user.userId)
                                                        }}>
                                                    상세
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination currentPage={userPage.number} totalPages={userPage.totalPages}
                                        first={userPage.first}
                                        last={userPage.last}
                                        onPageChange={handlePageChange}/>

                            {/* 사용자 정보 모달 */}
                            {showModal && <UserDetailModal setShowModal={setShowModal} userId={selectedUserId}
                                                           onChange={handleChangeUserInfo}/>}

                            {/* 사용자 추가 모달 */}
                            {showAddModal && <AddUserModal setShowModal={setShowAddModal} handleAdd={handleAddUser}/>}
                        </>
                    )
                )}
            </section>
        </>
    )
}