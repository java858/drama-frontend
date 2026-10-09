import request from '../utils/request';
import type { Drama, DramaDetailResponse } from '../types/drama';
import type { DramaGenre } from '../types/genre';

export interface PagedDramas {
    records: Drama[];
    total: number;
    size: number;
    current: number;
    pages: number;
}

export const getLatestDramasPaged = (
    page: number = 1,
    size: number = 20,
    genreId?: number | null
): Promise<PagedDramas> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('size', String(size));
    if (genreId) {
        params.append('genreId', String(genreId));
    }
    return request.get(`/drama/latest?${params.toString()}`);
};

export const getHotDramas = (limit: number = 10): Promise<Drama[]> => {
    return request.get(`/drama/hot?limit=${limit}`);
};

export const getDramaDetail = (dramaId: number): Promise<DramaDetailResponse> => {
    return request.get(`/drama/detail/${dramaId}`);
};

export const searchDramas = (keyword: string, lang: string = 'zh'): Promise<Drama[]> => {
    return request.get(`/drama/search?keyword=${encodeURIComponent(keyword)}&lang=${lang}`);
};

export const getAllGenres = (): Promise<DramaGenre[]> => {
    return request.get('/genre/list');
};