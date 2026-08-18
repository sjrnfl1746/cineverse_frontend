import api from "../axiosInstance.js";

const BASE_URL = `/api/admin/notice`;

// 리스트 조회
export const getNoticeListApi = async ({keyword = null, page = 0, size = 10, sort = 'createdAt.desc'}) => {
    const res = await api.get(BASE_URL, {
        params: {
            keyword: keyword?.trim() || null,
            page,
            size,
            sort,
        },
    });
    return res.data;
}

// 단건 조회
export const getNoticeApi = async (noticeId) => {
    const res = await api.get(`${BASE_URL}/${noticeId}`);
    return res.data;
}

// 등록
export const addNoticeApi = async (notice) => {
    const res = await api.post(BASE_URL, notice);
    return res.data;
}

// 수정
export const modifyNoticeApi = async (noticeId, notice) => {
    const res = await api.put(`${BASE_URL}/${noticeId}`, notice);
    return res.data;
}

// 삭제
export const deleteNoticeApi = async (noticeId) => {
    const res = await api.delete(`${BASE_URL}/${noticeId}`);
    return res.data;
}