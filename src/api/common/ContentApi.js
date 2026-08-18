import api from "../axiosInstance.js";

const BASE_URL = '/api/content';

// 조회수 top 6 영화 조회
export const getTop6ContentApi = async () => {
    const res = await api.get(`${BASE_URL}/top6`);
    return res.data;
}

// 랜덤 콘텐츠 20개 조회
export const getRandomContentApi = async (searchRandomContentRequestDTO, page = 0, size = 20) => {
    const res = await api.get(`${BASE_URL}/random`, {
        params: {
            ...searchRandomContentRequestDTO,
            page,
            size,
        },
    });

    return res.data;
};

// contentId로 콘텐츠 조회
export const getContentByContentIdApi = async (contentId) => {
    const res = await api.get(`${BASE_URL}/${contentId}`);
    return res.data;
}

// 해당 콘텐츠 찜목록에 등록
export const addUserWishlist = async (contentId) => {
    const res = await api.post(`${BASE_URL}/${contentId}/wishlist`)
    return res.data;
}

// 해당 콘텐츠 찜목록에서 제거
export const removeUserWishlist = async (contentId) => {
    const res = await api.delete(`${BASE_URL}/${contentId}/wishlist`);
    return res.data;
}