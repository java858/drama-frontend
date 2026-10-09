import request from '../utils/request';
import type { User, UserWatchHistory } from '../types/user';
import type { DramaFavPurchaseStatus } from '../types/drama';

export const getProfile = (): Promise<User> => {
    return request.get('/user/profile');
};

export const updateProfile = (data: Partial<User>): Promise<User> => {
    return request.put('/user/profile', data);
};

export const addFavorite = (dramaId: number): Promise<{ message: string }> => {
    return request.post(`/user/favorite/${dramaId}`);
};

export const removeFavorite = (dramaId: number): Promise<{ message: string }> => {
    return request.delete(`/user/favorite/${dramaId}`);
};

export const getFavorites = (): Promise<number[]> => {
    return request.get('/user/favorites');
};

export const getPurchasedDramaIds = (): Promise<number[]> => {
    return request.get('/user/purchases');
};

export const getHistory = (): Promise<UserWatchHistory[]> => {
    return request.get('/user/history');
};

export const recordWatchHistory = (episodeId: number): Promise<void> => {
    return request.post(`/user/history/${episodeId}`);
};

export const getDramaFavPurchaseStatus = (
    dramaId: number
): Promise<DramaFavPurchaseStatus> => {
    return request.get(`/user/drama-fav-purchase-status/${dramaId}`);
};