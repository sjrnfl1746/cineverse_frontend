import api from "../axiosInstance.js";

const BASE_URL = '/api/admin/eventAnnounce';

// 이벤트 결과 등록
export const addEventAnnouncementApi = async (eventId, eventAnnouncement) => {
    const res = await api.post(`${BASE_URL}/${eventId}`, eventAnnouncement)
    return res.data;
}

// 이벤트 결과 수정
export const updateEventAnnouncementApi = async (eventId, eventAnnouncement) => {
    const res = await api.put(`${BASE_URL}/${eventId}`, eventAnnouncement)
    return res.data;
}

// 이벤트 결과 삭제
export const deleteEventAnnouncementApi = async (eventId) => {
    const res = await api.delete(`${BASE_URL}/${eventId}`);
    return res.data;
}

// 이벤트 결과 조회
export const getEventAnnouncementByEventId = async (eventId) => {
    const res = await api.get(`${BASE_URL}/${eventId}`);
    return res.data;
}