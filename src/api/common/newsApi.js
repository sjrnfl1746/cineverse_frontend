import api from "../axiosInstance.js";

const BASE_URL = '/api/news';

// 뉴스 조회
export const getNewsApi = async (size = 5) => {
    const res = await api.get(`${BASE_URL}`, {
        params: {
            size,
        }
    });
    return res.data;
}