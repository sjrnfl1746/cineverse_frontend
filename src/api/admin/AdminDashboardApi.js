import api from "../axiosInstance.js";

const BASE_URL = 'api/admin/dashboard';

// 대시보드 값 조회
export const getDashboardDataApi = async () => {
    const res = await api.get(`${BASE_URL}`);
    return res.data;
}