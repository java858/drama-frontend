import request from '../utils/request';
import type { Episode } from '../types/episode';

export const getEpisode = (episodeId: number): Promise<Episode> => {
    return request.get(`/episode/${episodeId}`);
};

export const checkPlayPermission = (episodeId: number): Promise<boolean> => {
    return request.get(`/episode/check/${episodeId}`);
};

// 视频流播放 URL（直接使用）
export const getStreamUrl = (episodeId: number): string => {
    return `http://localhost:8080/api/episode/stream/${episodeId}`;
};