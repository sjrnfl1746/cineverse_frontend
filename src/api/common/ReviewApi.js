import api from "../axiosInstance.js";

const BASE_URL = '/api/review';

// 리뷰 등록
export const addReviewApi = async (reviewForm) => {
    const res = await api.post(`${BASE_URL}`, reviewForm);
    return res.data;
}

// 리뷰 단건 조회
export const getReviewByContentReviewIdApi = async (contentReviewId) => {
    const res = await api.get(`${BASE_URL}/${contentReviewId}`);
    return res.data;
}

// 리뷰 리스트 조회
export const getReviewList = async (searchDTO, page = 0, size = 10) => {
    const res = await api.get(`${BASE_URL}`, {
        params: {
            ...searchDTO,
            page,
            size,
        }
    });
    return res.data;
}

// 리뷰 삭제
export const removeReviewApi = async (contentReviewId) => {
    const res = await api.delete(`${BASE_URL}/${contentReviewId}`);
    return res.data;
}

// 리뷰 수정
export const updateReviewApi = async (contentReviewId, formData) => {
    const res = await api.put(`${BASE_URL}/${contentReviewId}`, formData);
    return res.data;
}

// 사용자 리뷰 조회
export const getUserReviewListApi = async ({page = 0, size = 10, sort = 'createdAt.desc'}) => {
    const res = await api.get(`${BASE_URL}/me`, {
        params: {
            page,
            size,
            sort,
        }
    });
    return res.data;
}