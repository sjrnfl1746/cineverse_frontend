import api from "../axiosInstance.js";

const BASE_URL = '/api/event';

// 이벤트 리스트 조회 - 5개, 삭제 되지 않은것, published
export const getEventList = async () => {
    const res = await api.get(`${BASE_URL}`);
    return res.data;
}

// 이벤트 단건 조회
export const getEventById = async (eventId) => {
    const res = await api.get(`${BASE_URL}/${eventId}`);
    return res.data;
}