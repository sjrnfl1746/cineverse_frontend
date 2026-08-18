import api from "../axiosInstance.js";

const BASE_URL = '/api/subscription';

// 전체 구독 플랜 조회
export const getSubscriptionPlanListApi = async () => {
    const res = await api.get(`${BASE_URL}`);
    return res.data;
}