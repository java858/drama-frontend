export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    gold: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserWatchHistory {
    id: number;
    userId: number;
    episodeId: number;
    watchedAt: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    userId: number;
    username: string;
    role: string;
    gold: number;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
}