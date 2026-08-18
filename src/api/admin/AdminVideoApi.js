import api from "../axiosInstance.js";

const BASE_URL = '/api/admin/video';

// 콘텐츠 영상 등록
export const addVideoApi = async (contentId, formData) => {
    const res = await api.post(`${BASE_URL}/${contentId}`, formData);
    return res.data;
}

// contentId로 영상 존재 여부 확인
export const existsVideoByContentIdApi = async (contentId) => {
    const res = await api.get(`${BASE_URL}/${contentId}/exists`);
    return res.data;
}

// contentId로 영상 단건 조회
export const getVideoByContentIdApi = async (contentId) => {
    const res = await api.get(`${BASE_URL}/${contentId}`);
    return res.data;
}

// 영상 수정
export const modifyVideoApi = async (contentId, formData) => {
    const res = await api.put(`${BASE_URL}/${contentId}`, formData);
    return res.data;
}