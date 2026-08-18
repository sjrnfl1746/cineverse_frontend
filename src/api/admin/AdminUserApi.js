import api from "../axiosInstance.js";

const BASE_URL = '/api/admin/user';

// 사용자 요약 조회
export const getUserSummaryApi = async () => {
    const res = await api.get(`${BASE_URL}/summary`);
    return res.data;
}

// 사용자 리스트 조회
export const getUserListApi = async ({type = null, keyword = null, page = 0,
                                         size = 10, sort = 'createdAt.desc',}) => {
    const res = await api.get(BASE_URL, {
        params: {
            type: type?.trim() || null,
            keyword: keyword || null,
            page,
            size,
            sort,
        },
    });
    return res.data;
}

// 사용자 단건 조회
export const getUserByIdApi = async (userId) => {
    const res = await api.get(`${BASE_URL}/${userId}`);
    return res.data;
}

// 사용자 정보 수정
export const modifyUserApi = async (userId, userModifyRequestDTO) => {
    const res = await api.put(`${BASE_URL}/${userId}`, userModifyRequestDTO);
    return res.data;
}

// 사용자 추가
export const addUserApi = async (addUserRequestDTO) => {
    const res = await api.post(`${BASE_URL}`, addUserRequestDTO);
    return res.data;
}