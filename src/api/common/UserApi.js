import api from "../axiosInstance.js";

const BASE_URL = '/api/user';

// 내정보 조회
export const meApi = async () => {
    const res = await api.get(`${BASE_URL}/me`);
    return res.data;
}

// 사용자 페이지 관련 정보 조회
export const getMyPageApi = async () => {
    const res = await api.get(`${BASE_URL}/myPage`);
    return res.data;
}

// 비밀번호 변경
export const changePasswordApi = async (changePasswordRequestDTO) => {
    const res = await api.put(`${BASE_URL}/password`,  changePasswordRequestDTO);
    return res.data;
}

// 주소 정보 조회
export const getUserAddressApi = async () => {
    const res = await api.get(`${BASE_URL}/address`);
    return res.data;
}

// 사용자 정보 수정
export const updateUserApi = async (userMyPageRequestDTO) => {
    const res = await api.put(BASE_URL, userMyPageRequestDTO);
    return res.data;
}