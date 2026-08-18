import api from "../axiosInstance.js";

const BASE_URL = '/api/notice';

// 리스트 조회
export const getAllNoticeListApi = async ({keyword = null, page = 0,
                                              size = 0, sort = 'createdAt.desc',
                                          }) => {
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
export const getNoticeByNoticeIdApi = async (noticeId) => {
    const res = await api.get(`${BASE_URL}/${noticeId}`);
    return res.data;
}