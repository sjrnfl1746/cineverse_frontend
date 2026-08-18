import api from "../axiosInstance.js";

const BASE_URL = '/api/admin/content';

// 콘텐츠 등록
export const addContentApi = async (formData) => {
    const res = await api.post(`${BASE_URL}`, formData);
    return res.data;
}

// 콘텐츠 리스트 조회
export const getContentListApi = async ({keyword = null, contentStatus = null, page = 0,
                                            size = 10, sort = 'createdAt.desc',}) => {
    const res = await api.get(BASE_URL, {
        params: {
            keyword: keyword?.trim() || null,
            contentStatus: contentStatus || null,
            page,
            size,
            sort,
        },
    });

    return res.data;
};

// 콘텐츠 단건 조회
export const getContentApi = async (contentId) => {
    const res = await api.get(`${BASE_URL}/${contentId}`);
    return res.data;
}

// 콘텐츠 수정
export const updateContentApi = async (contentId, formData) => {
    const res = await api.put(`${BASE_URL}/${contentId}`, formData);
    return res.data;
}

// 콘텐트 삭제
export const deleteContentApi = async (contentId) => {
    const res = await api.delete(`${BASE_URL}/${contentId}`);
    return res.data;
}