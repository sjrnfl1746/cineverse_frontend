import api from "../axiosInstance.js";

const BASE_URL = '/api/video';

// 영상 조회
export const getVideoPathByContentIdApi = async (contentId) => {
    const res = await api.get(`${BASE_URL}/${contentId}`);
    return res.data;
}