export const removeHtml = (text = "") => {
    return text
        .replace(/<[^>]*>/g, "")
        .replaceAll("&quot;", '"')
        .replaceAll("&amp;", "&")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">");
};

export const formatNewsDate = (date) => {
    if (!date) {
        return "";
    }
    return new Date(date).toLocaleDateString("ko-KR");
};