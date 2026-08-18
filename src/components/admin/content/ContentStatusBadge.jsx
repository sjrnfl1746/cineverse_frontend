export default function ContentStatusBadge({status}) {

    const statusInfo = {
        READY: {
            label: '공개 예정',
            className: 'bg-yellow-500/10 text-yellow-500',
        },
        PUBLISHED: {
            label: '공개 중',
            className: 'bg-green-500/10 text-green-500',
        },
        END: {
            label: '공개 종료',
            className: 'bg-red-500/10 text-red-500',
        },
    };

    const currentStatus = statusInfo[status] ?? {
        label: status,
        className: 'bg-gray-500/10 text-gray-400',
    };

    return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${currentStatus.className}`}>
            {currentStatus.label}
        </span>
    );

}