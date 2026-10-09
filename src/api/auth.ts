import request from '../utils/request';
import type { LoginRequest, LoginResponse, RegisterRequest } from '../types/user';

export const login = (data: LoginRequest): Promise<LoginResponse> => {
    return request.post('/auth/login', data);
};

export const register = (data: RegisterRequest): Promise<{ message: string }> => {
    return request.post('/auth/register', data);
};