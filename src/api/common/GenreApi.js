import api from "../axiosInstance.js";

const BASE_URL = '/api/genre';

// 장르 불러오기
export const genreListApi = async () => {
    const res = await api.get(`${BASE_URL}`)
    return res.data;
}