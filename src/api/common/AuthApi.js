import api from "../axiosInstance.js";

const BASE_URL = '/api/auth';

// 회원가입
export const signupApi = async (signupRequestDTO) => {
    const res = await api.post(`${BASE_URL}/signup`, signupRequestDTO);
    return res.data;
}

// 로그인
export const loginApi = async (loginRequestDTO) => {
    const res = await api.post(`${BASE_URL}/login`, loginRequestDTO);
    return res.data;
}

// 로그아웃
export const logoutApi = async () => {
    const res = await api.post(`${BASE_URL}/logout`);
    return res.data;
}