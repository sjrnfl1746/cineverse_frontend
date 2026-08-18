import api from "../axiosInstance.js";

const BASE_URL = '/api/mail';

// 인증번호 전송
export const sendMailCodeApi = async (emailCodeSendRequestDTO) => {
    const res = await api.post(`${BASE_URL}/code/send`, emailCodeSendRequestDTO);
    return res.data;
}

// 인증번호 확인
export const verifyEmailCodeApi = async (emailCodeVerifyRequestDTO) => {
    const res = await api.post(`${BASE_URL}/code/verify`, emailCodeVerifyRequestDTO);
    return res.data;
}