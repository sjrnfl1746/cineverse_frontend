import api from "../axiosInstance.js";

const BASE_URL = '/api/eventAnnounce';

// eventId로 단건 조회
export const getEventAnnounceByEventIdApi = async (eventId) => {
    const res = await api.get(`${BASE_URL}/${eventId}`);
    return res.data;
}

// 이벤트 결과 목록 조회
export const getAllEventAnnounceApi = async ({page = 0, size = 10, sort = 'createdAt.desc',}) => {
    const res = await api.get(`${BASE_URL}`, {
        params: {
            page,
            size,
            sort,
        },
    });
    return res.data;
}