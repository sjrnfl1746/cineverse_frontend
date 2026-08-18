import {GoDotFill} from "react-icons/go";

export default function UserStatusBadge({status}) {

    const statusInfo = {
        ACTIVE: {
            label: '정상',
            className: 'text-green-500',
        },
        SUSPENDED: {
            label: '이용 정지',
            className: 'text-yellow-500',
        },
    }

    const currentStatus = statusInfo[status] ?? {
        label: status,
        className: 'text-gray-400',
    };

    return (
        <>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${currentStatus.className}`}>
                <GoDotFill/>
                {currentStatus.label}
            </span>
        </>
    )
}