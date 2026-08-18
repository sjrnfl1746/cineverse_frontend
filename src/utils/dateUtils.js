export const formatTimeAgo = (dateValue) => {
    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);
    const now = new Date();

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    const diffMilliseconds = now.getTime() - date.getTime();

    // 미래 시간인 경우
    if (diffMilliseconds < 0) {
        return "방금 전";
    }

    const seconds = Math.floor(diffMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return "방금 전";
    }

    if (minutes < 60) {
        return `${minutes}분 전`;
    }

    if (hours < 24) {
        return `${hours}시간 전`;
    }

    if (days < 30) {
        return `${days}일 전`;
    }

    if (months < 12) {
        return `${months}달 전`;
    }

    return `${years}년 전`;
}

export const formatingDate = (dateTime) => {
    if (!dateTime) {
        return "-";
    }

    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }
    return new Intl.DateTimeFormat('ko-KR', options).format(new Date(dateTime));
}

export const formatingTime = (dateTime) => {
    if (!dateTime) {
        return "-";
    }

    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };

    return new Date(dateTime).toLocaleString("ko-KR", options);
};