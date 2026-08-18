export const formatDate = (dateTime) => {
    if (!dateTime) {
        return "-";
    }

    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    }).format(new Date(dateTime));
}