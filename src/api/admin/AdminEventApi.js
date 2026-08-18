import api from "../axiosInstance.js";

const BASE_URL = '/api/admin/event';

// 이벤트 등록
export const addEventApi = async (formData) => {
    const res = await api.post(`${BASE_URL}`, formData);
    return res.data;
}

// 이벤트 요약
export const eventSummaryApi = async () => {
    const res = await api.get(`${BASE_URL}/summary`);
    return res.data;
}

// 이벤트 리스트 조회
export const getEventListApi = async ({eventStatus = null, keyword = null, page = 0,
                                          size = 10, sort = 'createdAt.desc',}) => {
    const res = await api.get(BASE_URL, {
        params: {
            eventStatus: eventStatus?.trim() || null,
            keyword: keyword || null,
            page,
            size,
            sort,
        },
    });
    return res.data;
}

// 이벤트 단건 조회
export const  getEventApi = async (eventId) => {
    const res = await api.get(`${BASE_URL}/${eventId}`);
    return res.data;
}

// 이벤트 수정
export const updateEventApi = async (eventId, formData) => {
    const res = await api.put(`${BASE_URL}/${eventId}`, formData);
    return res.data;
}

// 이벤트 삭제
export const deleteEventApi = async (eventId) => {
    const res = await api.delete(`${BASE_URL}/${eventId}`);
    return res.data;
}