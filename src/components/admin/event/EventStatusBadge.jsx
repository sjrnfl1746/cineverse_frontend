import {GoDotFill} from "react-icons/go";

export default function EventStatusBadge({status}) {

    const statusInfo = {
        READY: {
            label: '진행 예정',
            className: 'bg-blue-500/10 text-blue-500',
        },
        PUBLISHED: {
            label: '진행 중',
            className: 'bg-green-500/10 text-green-500',
        },
        RESULT_PENDING: {
            label: '발표 대기',
            className: 'bg-yellow-500/10 text-yellow-500',
        },
        END: {
            label: '종료',
            className: 'bg-red-500/10 text-red-500',
        }
    }

    const currentStatus = statusInfo[status] ?? {
        label: status,
        className: 'bg-gray-500/10 text-gray-400',
    };

    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${currentStatus.className}`}>
            {currentStatus.label}
        </span>
    )
}