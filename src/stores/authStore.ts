import { create } from 'zustand';
import { login as loginApi, register as registerApi } from '../api/auth';
import {
    setToken,
    removeToken,
    setUser,
    getUser,
    getToken,
    removeUser,
} from '../utils/storage';
import type { User, LoginRequest, RegisterRequest } from '../types/user';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (data: LoginRequest) => {
        const response = await loginApi(data);
        setToken(response.token);

        const user: User = {
            id: response.userId,
            username: response.username,
            email: '',
            role: response.role,
            gold: response.gold,
            createdAt: '',
            updatedAt: '',
        };
        setUser(user);
        set({ user, isAuthenticated: true });
    },

    register: async (data: RegisterRequest) => {
        await registerApi(data);
    },

    logout: () => {
        removeToken();
        removeUser();
        set({ user: null, isAuthenticated: false });
    },

    init: () => {
        const storedUser = getUser();
        const token = getToken();
        if (storedUser && token) {
            set({ user: storedUser, isAuthenticated: true, isLoading: false });
        } else {
            set({ isLoading: false });
        }
    },
}));