import api from "../axiosInstance.js";

const BASE_URL = '/api/payment';

// 결제 준비
export const preparePaymentApi = async (paymentPrepareRequestDTO) => {
    const res = await api.post(`${BASE_URL}/prepare`, paymentPrepareRequestDTO);
    return res.data;
}

// orderId로 결제 내역 조회
export const getPaymentApi = async (orderId) => {
    const res = await api.get(`${BASE_URL}/${orderId}`);
    return res.data;
}