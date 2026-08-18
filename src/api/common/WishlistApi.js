import api from "../axiosInstance.js";

const BASE_URL = '/api/wishlist';

// 사용자 찜 리스트 조회
export const getWishlistApi = async ({page = 0, size = 10, sort = 'createdAt.desc'}) => {
    const res = await api.get(`${BASE_URL}`, {
        params: {
            page,
            size,
            sort,
        }
    });
    return res.data;
}