export default function UserRoleBadge({role}) {

    const roleInfo = {
        ROLE_ADMIN: {
            label: '최고 관리자',
            className: 'bg-red-500/10 text-red-500',
        },
        ROLE_MANAGER: {
            label: '관리자',
            className: 'bg-yellow-500/10 text-yellow-500',
        },
        ROLE_USER: {
            label: '일반 회원',
            className: 'bg-green-500/10 text-green-500',
        },
    }

    const currentRole = roleInfo[role] ?? {
        label: role,
        className: 'text-gray-400',
    };

    return (
        <>
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${currentRole.className}`}>
                {currentRole.label}
            </span>
        </>
    )
}