import api from "../axiosInstance.js";

const BASE_URL = '/api/terms';

// 이용약관 조회
export const getActiveTermsApi = async () => {
    const res = await api.get(`${BASE_URL}/active`);
    return res.data;
}